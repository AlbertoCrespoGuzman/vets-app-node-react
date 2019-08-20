var mongoose = require('mongoose')
var Schema = mongoose.Schema


var File = new Schema({
    originalName: {
      type:String
    },
    displayName: { 
        type:String
    },
    awsKey: {
      type: String
    },
    tmp: {
        type: String,
        default: '/tmp/'
      },
    type:   {
        type: String,
        default: 'pdf'
    },
    size: {
        type: Number,
        default: 0
    },
    lastActivity:{
        type:Date,
        default:Date.now
      },
    user: {
        type : mongoose.Schema.ObjectId,
        ref: 'User'
    },
    commentsEnabled:{
        type: Boolean,
        default: false
    },
    adminNoReadCommentsCount:{
        type: Number,
        default: 0
    },
    customerNoReadCommentsCount: {
      type: Number,
      default: 0
    },
    read:{
        type: Boolean,
        default: false
    },
    lastRead:{
        type:Date
      },
      comments: [{
        type : mongoose.Schema.ObjectId,
        ref: 'Comment'
    }],
});

module.exports = mongoose.model('File', File);