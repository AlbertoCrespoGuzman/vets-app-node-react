var express = require('express')
var bodyParser = require('body-parser')
var router = express.Router()
router.use(bodyParser.json())
var multer = require('multer')
const Verify = require('./../security/verify')
require('dotenv').config()
var i18n = require("i18n")
const User = require('../models/user')
const File = require('../models/file')
var cookieParser = require('cookie-parser')
const path = require('path')
const AwsStorage = require('./../utils/aws-storage')
const fs = require('fs')

router.use(bodyParser.json());
router.use(cookieParser());
router.use(i18n.init)

options = { upsert: true, new: true, setDefaultsOnInsert: true };


router.route('/')
  .get(Verify.verifyAdmin, function (req, res, next){
        File.find({})
            .populate('user')
            .exec(function(err, files){
            if (err) throw err
            res.json(files)
        })
  })
  
  .post(Verify.verifyAdmin, function (req, res, next){
      
        var allFields = { }

        var storage = multer.diskStorage({
                destination: function (req, file_, cb) {
                    allFields.file = file_
                    allFields.userId = req.body.userId
                    allFields.size = req.body.size
                    allFields.type = file_.originalname.split('.').length > 1 ? file_.originalname.split('.')[file_.originalname.split('.').length -1] : ''
                    allFields.displayName = req.body.displayName

                    console.log(JSON.stringify(allFields))
                cb(null, path.resolve('tmp'))
            },
            filename: function (req, file_, cb) {
                allFields.file = file_
                allFields.userId = req.body.userId
                allFields.size = req.body.size
                allFields.type = file_.originalname.split('.').length > 1 ? file_.originalname.split('.')[file_.originalname.split('.').length -1] : ''
                allFields.displayName = req.body.displayName
                cb(null, allFields.displayName  && allFields.displayName.length > 0 
                                ? (allFields.displayName  + '.' + allFields.type) : file_.originalname )
            }
        })
        var upload = multer({ storage: storage }).single('file')
        upload(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    console.log(JSON.stringify(err))
                    return res.status(500).json(err)
                } else if (err) {
                    console.log(JSON.stringify(err))
                    return res.status(500).json(err)
                }

                AwsStorage.saveFileInAWS(allFields)
                .then(AwsRes => {
                    console.log('aqui esoty', allFields)
                    console.log(AwsRes)
                    var fileDB = new File({
                        originalName : allFields.file.originalname,
                        displayName: allFields.displayName && allFields.displayName.length > 0 ? allFields.displayName : allFields.file.originalname,
                        url: AwsRes, // !!!,
                        type: allFields.type,
                //        size: allFields.size,
                        user: allFields.userId,
        
                    })
                    console.log('ei', fileDB)
                    fileDB.save(function (err, fileSaved) {
                        if (err) {
                            console.log('que dices bro', JSON.stringify(err))
                            return res.status(500).json(err)
                        }
                        User.findOneAndUpdate( { _id: fileSaved.user }, { "$push": { "files": fileSaved._id } }, options)
					    .exec( function(err, user){
                            return res.status(200).send(fileSaved)
                        })
                    })
                    
                })
                .catch(err => {
                    console.log('3',JSON.stringify(err))
                    return res.status(400).send(err)
                })
                
            })
})
router.route('/:fileId')
  .delete(Verify.verifyAdmin, function (req, res, next){
      File.findOne({ _id: req.params.fileId})
      .exec(function(err, file){
        File.deleteOne({ _id: req.params.fileId })
            .exec(function(err, files){
                if (err) throw err
                User.findOneAndUpdate( { _id: file.user }, { "$pull": { "files": req.params.fileId } }, options)
					    .exec( function(err, user){
                            if (err) throw err
                            if(process.env.AWS_ENABLED){
                                deleteRawFile()
                            }
                            return res.status(200).send({success: true})
            })
        })
    })
  })
  .get(Verify.verifyOrdinaryUser, function (req, res, next){
    Verify.getUsernameFromToken(req.headers['authorization'])
    .then(username =>{
        User.findOne({username})
        .exec(function(err, user){
            console.log('get filesRouter   ')
                File.findOne({_id : req.params.fileId})
                .populate('user')
                .exec(function(err, file){
                    if (err) throw err
                    
                            if(username === file.user.username || user.admin){
                            try{
                                var data = null
                                if(process.env.AWS_ENABLED === true){
                                    console.log('get process.env.AWS_ENABLED', process.env.AWS_ENABLED)
                                }else{
                                    var data =fs.readFileSync(path.resolve('.' + file.url + file.displayName + '.' + file.type))
                                }
                                res.contentType('application/' + file.type)
                                res.send(data)
                            }catch(err){
                                console.log('err', JSON.stringify(err))
                                return res.status(500).json(err)
                            }
                            }else{
                                console.log('unauthorized')
                                res.status(400).send({err: 'Voce não está autorizado para visualizar esse arquivo'})
                            }
                })
            })
        })
  })
function deleteRawFile(){

}

  module.exports = router