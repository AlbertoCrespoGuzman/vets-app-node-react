var express = require('express')
var bodyParser = require('body-parser')
var router = express.Router()
const Verify = require('./../security/verify')
require('dotenv').config()
var i18n = require("i18n")
const User = require('../models/user')
const File = require('../models/file')
const Comment = require('../models/comment')

router.use(bodyParser.json())
router.use(i18n.init)

options = { upsert: true, new: true, setDefaultsOnInsert: true };

router.route('/file/:fileId')
  .post(Verify.verifyOrdinaryUser, function (req, res, next){
      var comment = new Comment({
          message: req.body.message,
          file: req.params.fileId,
          sender: req.body.sender,
          receiver: req.body.receiver,
          read: false,
          readTime: null
      })
      comment.save(function (err, commentSaved) {
            Comment.find({file: commentSaved.file, read: false})
            .populate('receiver')
            .exec(function (err, comments) {
                var adminNoReadCommentsCount = 0
                var customerNoReadCommentsCount = 0
                comments.forEach(commentForCount => {
                    if(commentForCount.receiver.admin){
                        adminNoReadCommentsCount++
                    }else{
                        customerNoReadCommentsCount++
                    }
                })
                File.findOneAndUpdate( { _id: commentSaved.file }, { adminNoReadCommentsCount, customerNoReadCommentsCount, "$push": { "comments": commentSaved._id } }, options)
                .exec( function(err, fileSaved){
                    sendMobileNotification()
                    return res.status(200).send(fileSaved)
                })
            })
            
        })
  })
  .get(Verify.verifyOrdinaryUser, function (req, res, next){

          File.findOne({ _id: req.params.fileId })
          .populate({
            path: 'comments',
             populate: [{
                  path: 'sender'
              },
              {
                  path: 'receiver'
              }]
        })
    .exec(function (err, user){
      if(err) res.code(500).json(err)
        res.json(user)
    })
          .exec( function(err, user){
              return res.status(200).send(fileSaved)
          })
    })


router.route('/read/:commentId')
  .patch(Verify.verifyOrdinaryUser, function (req, res, next){
    Comment.findOneAndUpdate( { _id: req.params.commentId }, { read: true, readTime: new Date() }, options)
        .exec( function(err, comment){
                Comment.find({file: comment.file, read: false})
                .populate('receiver')
                .exec(function (err, comments) {
                    var adminNoReadCommentsCount = 0
                    var customerNoReadCommentsCount = 0
                    comments.forEach(commentForCount => {
                        if(commentForCount.receiver.admin){
                            adminNoReadCommentsCount++
                        }else{
                            customerNoReadCommentsCount++
                        }
                    })
                    File.findOneAndUpdate({ id: comment.file}, {adminNoReadCommentsCount, customerNoReadCommentsCount }, options)
                    .exec(function (err, fileSaved) {
                        return res.status(200).send(fileSaved)
                    })
                })
        })
    })


function sendMobileNotification(){

}
  module.exports = router