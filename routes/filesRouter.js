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


router.use(bodyParser.json());
router.use(cookieParser());
router.use(i18n.init)


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
                                ? allFields.displayName : file_.originalname )
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
                    var fileDB = new File({
                        originalName : allFields.file.originalname,
                        displayName: allFields.displayName && allFields.displayName.length > 0 ? allFields.displayName : allFields.file.originalname,
                        url: 'AwsRes', // !!!,
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
                        return res.status(200).send(fileSaved)
                      })
                    
                })
                .catch(err => {
                    console.log('3',JSON.stringify(err))
                    return res.status(400).send(err)
                })
                
            })
})

function saveFileToDB(allFields, awsResponse){
    console.log('holaaa')
    return new Promise((resolve, reject) => {
        console.log('aqui estoy...2', JSON.stringify(file))
            var fileDB = new File({
                originalName : allFields.file.originalname,
                displayName: allFields.displayName && allFields.displayName.length > 0 ? allFields.displayName : allFields.file.originalname,
                url: awsResponse, // !!!,
                type: allFields.file.mimetypes.split('.')[1],
                size: allFields.file.size,
                user: allFields.userId,

            })
            fileDB.save(function (err, fileSaved) {
                if (err) {
                    console.log('que dices bro')
                    return reject(err);
                }
                resolve(fileSaved)
              })
        })

}

  module.exports = router