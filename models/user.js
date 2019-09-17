var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt-nodejs')


var User = new Schema({
    username: {
      type:String,
      unique: true
    },
    type:{
      type: Number,
      default: 0
    },
    lang:{
      type: String,
      default: 'pt'
    },
    password: { 
        type:String
    },
    admin:   {
        type: Boolean,
        default: false
    },
    vet:   {
        type: Boolean,
        default: false
    },
    client:   {
        type: Boolean,
        default: false
    },
    clinic:   {
        type: Boolean,
        default: false
    },
    
    lastActivity:{
      type:Date,
      default:Date.now
    },
    completename: { 
        type:String
    },
    cpf: { 
        type:String
    },
    address: { 
        type:String
    },
    technicalSupport:{
      type: String,
      default: ''
    },
    phone:{
      type: String,
      default: ''
    },
    crmv:{
      type: String,
      default: ''
    },
    android_token:{
      type: String,
      default: ''
    },
    iphone_token:{
      type: String,
      default: ''
    },
    files: [{
        type : mongoose.Schema.ObjectId,
        ref: 'File'
    }],
    resetPasswordToken: String,
    resetPasswordExpires: Date
})


User.pre('save', function(next) {
  var user = this;
  var SALT_FACTOR = 5

  if(user.type === 1){
      user.client = true
      user.clinic = false
      user.vet = false
      user.admin = false
  }else if(user.type === 2){
    user.client = false
    user.clinic = true
    user.vet = false
    user.admin = false
  }else if(user.type === 3){
    user.client = false
      user.clinic = false
      user.vet = true
      user.admin = false
  }else if(user.type === 4){
    user.client = false
    user.clinic = false
    user.vet = false
    user.admin = true
  }

  if (user.password && !user.isModified('password')) return next();
  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})

User.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}
User.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', User)