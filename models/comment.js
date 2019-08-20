var mongoose = require('mongoose')
var Schema = mongoose.Schema


var Comment = new Schema({
    message: {
      type: String
    },
    sentTime:{
        type:Date,
        default:Date.now
      },
    file: {
        type : mongoose.Schema.ObjectId,
        ref: 'File'
    },
    sender: {
        type : mongoose.Schema.ObjectId,
        ref: 'User'
    },
    receiver: {
        type : mongoose.Schema.ObjectId,
        ref: 'User'
    },
    read:{
        type: Boolean,
        default: false
    },
    readTime:{
        type:Date
      }
});

module.exports = mongoose.model('Comment', Comment);