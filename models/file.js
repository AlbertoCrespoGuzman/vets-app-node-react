var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt-nodejs')


var File = new Schema({
    originalName: {
      type:String,
      unique: true
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

File.plugin(passportLocalMongoose)

module.exports = mongoose.model('File', File);