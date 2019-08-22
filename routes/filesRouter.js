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
const Comment = require('../models/comment')
var cookieParser = require('cookie-parser')
const path = require('path')
const AwsStorage = require('./../utils/aws-storage')
const fs = require('fs')
const AWS = require('aws-sdk')
fsAsync = require('fs').promises

router.use(bodyParser.json());
router.use(cookieParser());
router.use(i18n.init)

options = { upsert: true, new: true, setDefaultsOnInsert: true };

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })


var s3 = new AWS.S3()

router.route('/')
  .get(Verify.verifyOrdinaryUser, function (req, res, next){
      Verify.getIfAdminFromToken(req.headers['authorization'])
      .then(isAdmin => {
        if(isAdmin){
            File.find({})
                .sort({lastActivity:-1})
                .populate('user')
                .populate('admin')
                .exec(function(err, files){
                    if (err) throw err
                    res.json(files)
            })
        }else{
                Verify.getUsernameFromToken(req.headers['authorization'])
                .then(username => {
                    User.findOne({ username })
                    .exec(function(err, user){
                        if (err) throw err
                        File.find({user: user._id})
                            .sort({lastActivity:-1})
                            .populate('user')
                            .populate('admin')
                            .exec(function(err, files){
                                if (err) throw err
                                res.json(files)
                            })
                    })
                    
                })
                .catch(err => {
                    return res.status(500).json(err)
                })
            }
        
      })
      .catch(err => {
        return res.status(500).json(err)
      })
        
  })
  
  .post(Verify.verifyAdmin, function (req, res, next){
      
        var allFields = { }

        var storage = multer.diskStorage({
                destination: function (req, file_, cb) {
                    allFields.file = file_
                    allFields.userId = req.body.userId
                    allFields.size = req.body.size
                    allFields.adminId = req.body.adminId
                    allFields.tmp = '/tmp/'
                    allFields.type = file_.originalname.split('.').length > 1 ? file_.originalname.split('.')[file_.originalname.split('.').length -1] : ''
                    allFields.displayName = req.body.displayName
                    allFields.commentsEnabled = (req.body.commentsEnabled == "true")
                    console.log(JSON.stringify(allFields))
                cb(null, path.resolve('tmp'))
            },
            filename: function (req, file_, cb) {
                allFields.file = file_
                allFields.userId = req.body.userId
                allFields.size = req.body.size
                allFields.adminId = req.body.adminId
                allFields.tmp = '/tmp/'
                allFields.type = file_.originalname.split('.').length > 1 ? file_.originalname.split('.')[file_.originalname.split('.').length -1] : ''
                allFields.displayName = req.body.displayName
                allFields.commentsEnabled = (req.body.commentsEnabled == "true")
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
                .then(awsKeyGot => {
                    console.log('aqui esoty', allFields)
                    console.log(awsKeyGot)
                    console.log(typeof awsKeyGot)
                    var fileDB = new File({
                        originalName : allFields.file.originalname,
                        displayName: allFields.displayName && allFields.displayName.length > 0 ? allFields.displayName : allFields.file.originalname,
                        awsKey: awsKeyGot, // !!!,
                        type: allFields.type,
                        lastRead: null,
                        commentsEnabled : allFields.commentsEnabled,
                //        size: allFields.size,
                        user: allFields.userId,
                        admin: allFields.adminId

        
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
                                var params = {  Bucket: process.env.AWS_BUCKET_NAME, Key: file.awsKey };
                                s3.deleteObject(params, function(err, data) {
                                if (err) console.log(err, err.stack);  // error
                                else     return res.status(200).send({success: true})            // deleted
                                });
                            }else{
                                try {
                                    fs.unlinkSync(path.resolve('.' + file.tmp +  file.displayName +  '.' + file.type ))
                                  } catch(err) {
                                    console.error(err)
                                  }
                            }
                            
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
                                if(process.env.AWS_ENABLED === "true"){
                                    var params = {
                                        Bucket: process.env.AWS_BUCKET_NAME,
                                        Key : file.awsKey
                                    }
                                    res.contentType('application/' + file.type)
                                    s3.getObject(params).createReadStream().pipe(res)
                                }else{
                                    var data =fs.readFileSync(path.resolve('.' + file.tmp + file.displayName + '.' + file.type))
                                    res.contentType('application/' + file.type)
                                    console.log('data', data)
                                    res.send(data)
                                }
                                
                                if(!user.admin){
                                    File.findOneAndUpdate( { _id: file._id }, {read: true, lastRead: new Date()}, options)
                                    .exec( function(err, file){
                                        
                                    })
                                }
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
  router.route('/:fileName/user/:userId' )
  .get(Verify.verifyOrdinaryUser, function (req, res, next){
      
    User.findOne({ _id: req.params.userId})
        .populate('files')
        .exec( function(err, user){
            var fileNameExists = false
            user.files.forEach(file => {
                if(file.displayName === req.params.fileName){
                    fileNameExists = true
                }
            })
            if(fileNameExists){
                res.status(400).send({err: 'Este usuário já possui um arquivo com esse mesmo nome.'})
            }else{
                res.json({success: true})
            }
        })
})
function deleteRawFile(){

}

  module.exports = router