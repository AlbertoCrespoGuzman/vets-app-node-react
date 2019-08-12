var mongoose = require('mongoose')
var Schema = mongoose.Schema


var File = new Schema({
    originalName: {
      type:String
    },
    displayName: { 
        type:String
    },
    url: {
      type: String,
      default: ''
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
    enabled:{
        type: Boolean,
        default: true
    },
    read:{
        type: Boolean,
        default: false
    },
    lastRead:{
        type:Date
      },
});

module.exports = mongoose.model('File', File);