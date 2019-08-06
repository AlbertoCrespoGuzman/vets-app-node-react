var express = require('express')
var bodyParser = require('body-parser')
var router = express.Router()
var passport = require('passport')
var User = require('../models/user')
var Verify = require('../security/verify')
var nodemailer = require('nodemailer')
var path = require('path');
var cookieParser = require('cookie-parser')
var i18n = require("i18n")
var async = require('async')
var crypto = require("crypto")
require('dotenv').config()

i18n.configure({
    locales:['en', 'es', 'pt'],
    fallback: 'pt',
    logDebugFn: function (msg) {
        console.log('debug', msg);
    },
    directory: path.join(__dirname + '/../locales')
})
var transporter = nodemailer.createTransport({ service: process.env.MAIL_SERVICE,
                                               auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS } 
                                             });
                                       
var options = { upsert: true, new: true, setDefaultsOnInsert: true, multi: true };

const { check, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


router.use(bodyParser.json());
router.use(cookieParser());
router.use(i18n.init)

router.route('/')
  .get(Verify.verifyAdmin, function (req, res, next)
  {
    User.find({}, function (err, user){
      if (err) throw err
      res.json(user)
    });
  });


router.route('/register')

    .post(Verify.verifyAdmin, [
            check('username').isEmail().custom((value, { req }) => {
                                             return new Promise((resolve, reject) => {
                                                User.findOne({ 'username': value }, (err, user) => {
                                                   if(user !== null) {
                                                      return reject();
                                                   } else {
                                                      return resolve();
                                                   }
                                                });
                                             });
                                          }).withMessage((value, { req, location, path }) => {
                                              return req.__("EMAIL_ALREADY_IN_USE")
                                            }),
            check('password').isLength({min : 4}).withMessage((value, { req, location, path }) => {
              return req.__("PASSWORD_SHORT")
            }),
            check('password').custom((value,{req, loc, path}) => {
                if (value !== req.body.confirmPassword) { throw new Error(req.__("PASSWORDS_NOT_MATCH")) } 
                else { return value }
            }),
            check('type').custom((value,{req, loc, path}) => {
              if (value === 0) { throw new Error(req.__("USER_TYPE_ERROR")) } 
              else { return value }
          })

          ]
          ,function(req, res) {
                  const errors = validationResult(req)
                  if (!errors.isEmpty()) {
                    return res.status(422).json({ errors: errors.array() });
                  }
                  console.log(JSON.stringify(req.body))

                  User.register(new User({ username : req.body.username, 
                                            type: req.body.type, 
                                            password: req.body.password, 
                                            admin: false, 
                                            clinic: false, 
                                            client: false, 
                                            vet: false,
                                            cpf: req.body.cpf,
                                            completename : req.body.completename,
                                            address: req.body.address
                                            }),
                                    req.body.password, function(err, user) {

                              if(err) return res.status(422).json({ err })
                              console.log('ANTES user saved first time and modified type ->', user)
                              /*if(req.body.type === 1){
                                  user.client = true
                              }else if(req.body.type === 2){
                                  user.clinic = true
                              }else if(req.body.type === 3){
                                user.vet = true
                              }else if(req.body.type === 4){
                                  user.admin = true
                              }
                              */
                           //   user.lang = req.getLocale()
                              console.log('user saved first time and modified type ->', user)
                              console.log('req.body', req.body)
                              user.save(function(err,user) {
                                  if (err) { return res.status(500).send({ msg: err.message }); }
                                      
                                      var mailOptions = { from: process.env.MAIL_USER, to: user.username, subject: req.__("EMAIL_VERIFICATION_SUBJECT"), text: req.__("EMAIL_VERFICATION_TEXT", {host: req.headers.host, userId: user._id}) };

                                      transporter.sendMail(mailOptions, function (err) {
                                          if (err) { return res.status(500).send({ msg: 'error sendMail->' + err.message }); }
                                          res.status(200).send({ msg: req.__("EMAIL_VERIFICATION_SENT", user.username)});
                                      });
                              });
                });
               
      });
router.route('/confirmation/:userId')
.get(function (req, res, next) {
    
    User.findById(req.params.userId)
        .exec(function (err, user) {
        if (err) next(err)

         user.verified = true
         req.setLocale(user.lang)

        user.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            res.status(200).send({msg : req.__("EMAIL_ACCOUNT_VERIFIED_SUCCESSFULLY")});
            //res.redirect('/#/login/' + req.__("EMAIL_ACCOUNT_VERIFIED_SUCCESSFULLY"))
        })
    })
})
router.route('/confirmation/resend')
      .post(
            [
              check('username').isEmail().custom((value, { req }) => {
                                console.log('username:' , value)
                               return new Promise((resolve, reject) => {
                                  User.findOne({ 'username': value }, (err, user) => {
                                     if(user === null) {
                                        return reject();
                                     } else {
                                        return resolve();
                                     }
                                  })
                               });
                            }).withMessage((value, { req, location, path }) => {
                                return req.__("EMAIL_IS_NOT_REGISTERED")
                              })
            ], function(req, res){
                const errors = validationResult(req);
                  if (!errors.isEmpty()) {
                    return res.status(422).json({ errors: errors.array() });
                  }

                User.findOne({ 'username': req.body.username }, (err, user) => {
                          
                          req.setLocale(user.lang)
                          var mailOptions = { from: process.env.MAIL_USER, to: user.username, subject: req.__("EMAIL_VERIFICATION_SUBJECT"), text: req.__("EMAIL_VERFICATION_TEXT", {host: req.headers.host, userId: user._id}) };

                            transporter.sendMail(mailOptions, function (err) {
                                if (err) { 
                                  User.findByIdAndRemove(user.username, (err, todo) => {
                                        if (err) return res.status(500).send(err);
                                        const response = {
                                            message: req.__("VERIFICATION_EMAIL_ERROR")
                                        };
                                        return res.status(200).send(response);
                                    });
                                  return res.status(500).send({ msg: 'error sendMail->' + err.message }); 
                                }
                           //     res.redirect('/login');
                                res.status(200).send({ msg: req.__("EMAIL_VERIFICATION_SENT", user.username)});
                            })             
                });
            })

router.route('/forgot')
        .post([


          ], function(req, res, next) {
            const errors = validationResult(req);
                if (!errors.isEmpty()) {
                  return res.status(422).json({ errors: errors.array() });
                }

            async.waterfall([
              function(done) {
                crypto.randomBytes(20, function(err, buf) {
                  var token = buf.toString('hex');
                  done(err, token);
                });
              },
              function(token, done) {
                User.findOne({ username: req.body.username }, function(err, user) {

                  if (!user) return res.status(422).json({ msg: req.__("EMAIL_IS_NOT_REGISTERED") })
                 

                  req.setLocale(user.lang)  
                  user.resetPasswordToken = token;
                  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                  user.save(function(err) {
                    done(err, token, user);
                  });
                });
              },
              function(token, user, done) {
                var mailOptions = { from: process.env.MAIL_USER, 
                                    to: user.username, 
                                    subject: req.__("EMAIL_RESET_PASSWORD_SUBJECT"), 
                                    text: req.__("EMAIL_RESET_PASSWORD", {host: req.headers.host, token: token}) };

                transporter.sendMail(mailOptions, function (err) {
                    if (err) { return res.status(500).send({ msg: 'error sendMail->' + err.message }); }
                    res.status(200).send({ msg: req.__("EMAIL_VERIFICATION_SENT", user.username)});
                });
              }
            ], function(err) {
              if (err) return next(err);
              //res.redirect('/forgot');
            });           
});
router.route('/reset/:token')
      .get([], function(req, res) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            if (err) { return res.status(422).send({ msg: req.__("PASSWORD_RESET_TOKEN_INVALID") }); }
         //   return res.redirect('/forgot');
          }
          res.redirect('/#/reset/' + req.params.token)
          //res.status(200).send({ msg: 'mensaje temporal: redirect to RESET PASSWORD'});
          /*
            res.render('reset', {
            user: req.user
          });
          */

        });
});
router.route('/reset/:token')
      .post([
            check('password').custom((value,{req, loc, path}) => {
                if (value !== req.body.confirmPassword) { throw new Error(req.__("PASSWORDS_NOT_MATCH")) } 
                else { return value }
            })
        ], function(req, res) {
            const errors = validationResult(req);
                  if (!errors.isEmpty()) {
                    return res.status(422).json({ errors: errors.array() });
                  }
            async.waterfall([
              function(done) {
                User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                  if (!user) {
                    return res.status(422).send({ msg: req.__("PASSWORD_RESET_TOKEN_INVALID") });
                  }

                  req.setLocale(user.lang)

                  user.password = req.body.password;
                  user.resetPasswordToken = undefined;
                  user.resetPasswordExpires = undefined;

                  user.save(function(err) {
                    req.logIn(user, function(err) {
                      done(err, user);
                    });
                  });
                });
              },
              function(user, done) {
                 var mailOptions = { from: process.env.MAIL_USER, 
                                     to: user.username, 
                                     subject: req.__("EMAIL_RESET_PASSWORD_SUBJECT"), 
                                     text: req.__("EMAIL_RESET_PASSWORD_TEXT", {email: user.username}) 
                                  }

                transporter.sendMail(mailOptions, function (err) {
                    if (err) { return res.status(500).send({ msg: 'error sendMail->' + err.message }); }
                    res.status(200).send({ msg: req.__("PASSWORD_CHANGED_SUCCESSFULLY", user.username)});
                });
                   
                
              }
            ], function(err) {
              res.redirect('/');
            });
});
// CLIENT VET REGISTRATION
router.route('/register-vet')
    .post(Verify.verifyAdmin, [
            check('username').isEmail().custom((value, { req }) => {
                                             return new Promise((resolve, reject) => {
                                                User.findOne({ 'username': value }, (err, user) => {
                                                   if(user !== null) {
                                                      return reject();
                                                   } else {
                                                      return resolve();
                                                   }
                                                });
                                             });
                                          }).withMessage((value, { req, location, path }) => {
                                              return req.__("EMAIL_ALREADY_IN_USE")
                                            }),
            check('password').isLength({min : 4}).withMessage((value, { req, location, path }) => {
              return req.__("PASSWORD_SHORT")
            }),
            check('password').custom((value,{req, loc, path}) => {
                if (value !== req.body.confirmPassword) { throw new Error(req.__("PASSWORDS_NOT_MATCH")) } 
                else { return value }
            })

          ]
          ,function(req, res) {
                
                  const errors = validationResult(req);
                  if (!errors.isEmpty()) {
                    return res.status(422).json({ errors: errors.array() });
                  }
                  console.log(JSON.stringify(req.body))

                  User.register(new User({ username : req.body.username }),
                                    req.body.password, function(err, user) {

                              if(err) return res.status(422).json({ err })
                              user.client = true
                              user.lang = req.getLocale()

                              user.save(function(err,user) {
                                  if (err) { return res.status(500).send({ msg: err.message }); }
                                      
                                      var mailOptions = { from: process.env.MAIL_USER, to: user.username, subject: req.__("EMAIL_VERIFICATION_SUBJECT"), text: req.__("EMAIL_VERFICATION_TEXT", {host: req.headers.host, userId: user._id}) };

                                      transporter.sendMail(mailOptions, function (err) {
                                          if (err) { return res.status(500).send({ msg: 'error sendMail->' + err.message }); }
                                          res.status(200).send({ msg: req.__("EMAIL_VERIFICATION_SENT", user.username)});
                                      });
                              });
                });
               
      
      });

// CLIENT ADMIN REGISTRATION
router.route('/register-admin')
    
    .post(Verify.verifyAdmin, [
            check('username').isEmail().custom((value, { req }) => {
                                             return new Promise((resolve, reject) => {
                                                User.findOne({ 'username': value }, (err, user) => {
                                                   if(user !== null) {
                                                      return reject();
                                                   } else {
                                                      return resolve();
                                                   }
                                                });
                                             });
                                          }).withMessage((value, { req, location, path }) => {
                                              return req.__("EMAIL_ALREADY_IN_USE")
                                            }),
            check('password').isLength({min : 4}).withMessage((value, { req, location, path }) => {
              return req.__("PASSWORD_SHORT")
            }),
            check('password').custom((value,{req, loc, path}) => {
                if (value !== req.body.confirmPassword) { throw new Error(req.__("PASSWORDS_NOT_MATCH")) } 
                else { return value }
            })

          ]
          ,function(req, res) {
                
                  const errors = validationResult(req);
                  if (!errors.isEmpty()) {
                    return res.status(422).json({ errors: errors.array() });
                  }
                  console.log(JSON.stringify(req.body))

                  User.register(new User({ username : req.body.username, password: req.body.password, vet: req.body.vet, admin: req.body.admin  }),
                                    req.body.password, function(err, user) {

                              if(err) return res.status(422).json({ err })
                              user.lang = req.getLocale()

                              user.save(function(err,user) {
                                  if (err) { return res.status(500).send({ msg: err.message }); }
                                      
                                      var mailOptions = { from: process.env.MAIL_USER, to: user.username, subject: req.__("EMAIL_VERIFICATION_SUBJECT"), text: req.__("EMAIL_VERFICATION_TEXT", {host: req.headers.host, userId: user._id}) };

                                      transporter.sendMail(mailOptions, function (err) {
                                          if (err) { return res.status(500).send({ msg: 'error sendMail->' + err.message }); }
                                          res.status(200).send({ msg: req.__("EMAIL_VERIFICATION_SENT", user.username)});
                                      });
                              });
                });
               
      });

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
        if (err) {
          return next(err);
        }
        if (!user) {
            var json
            if(i18n.__("USERNAME_WRONG") === req.__(info.msg)){
                json = { username: req.__(info.msg) }
            }else{
                json = { password: req.__(info.msg) }
            }
           return res.status(401).json(json);
        }

        req.setLocale(user.lang)
        if(!user.verified){
          return res.status(400).json({
            username: req.__("LOGIN_EMAIL_VERIFICATION_REQUIRED")
          });
        }
        req.logIn(user, function (err) {
              if (err) {
                return res.status(500).json({
                  username: req.__("LOGIN_ERROR_NOT_LOGIN")
                });
              }

              var token = Verify.getToken({"username":user.username, "_id":user._id ,
                                             "admin":user.admin,"vet":user.vet, "client":user.client,"clinic":user.clinic});
            

              var iduser = user._id;
              console.log('userRouter login ok....')
              res.status(200).json({
                status: req.__("LOGIN_SUCCESSFULL"),
                success: true,
                token: token,
                iduser: iduser,
                admin: user.admin,
                vet: user.vet,
                client: user.client,
                clinic: user.clinic,
                lang: user.lang
              });
        });
  })(req, res, next);
});

router.get('/logout', function (req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});
router.get('/facebook', passport.authenticate('facebook'),
  function(req, res){});

router.get('/facebook/callback', function(req,res,next){
  passport.authenticate('facebook', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
              var token = Verify.getToken(user);
              res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });
    });
  })(req,res,next);
});

router.route('/search/:userName')
.get(function (req, res, next) {

    User.find({ username: { "$regex": req.params.userName, "$options": "i" }  } )
        .select('-password')
        .exec(function (err, taskgroup) {
        if (err) next(err);
        console.log(taskgroup)
        res.json(taskgroup);
    });

});
router.route('/:user_type')
    .get(Verify.verifyAdmin, function(req, res) {
        if(req.params.user_type ==  1){
              User.find({ admin: true} )
                  .select('-password')
                  .exec(function (err, user) {
                  if (err) next(err)
                  res.json(user)
              })
            }else if(req.params.user_type ==  2){
              console.log('vets')
                User.find({ vet: true} ,function (err, user) {
                  if (err) res.status(500).json({ error: "save failed", err: err})
                  res.json(user)
              })
            }else if(req.params.user_type ==  3){
                User.find({ client: true} )
                  .select('-password')
                  .exec(function (err, user) {
                  if (err) next(err)
                  res.json(user)
              })
            }
          
      });     
router.route("/language")
  .post(Verify.verifyOrdinaryUser, function(req, res){

options = { upsert: true, new: true, setDefaultsOnInsert: true };

    User.findOneAndUpdate(req.body.user_id, {lang: req.body.lang}, options)
    .select('-password')
    .exec( function(err, user){
      if(err) res.status(500).json({error: err})
        res.json(user)
    })
  })
router.route('/payment/test/:userId')
  .put(Verify.verifyOrdinaryUser, function(req, res) {
    UserPayment.findOneAndUpdate({user: req.params.userId}, {credits: 10}, options)
        .exec(function (err, payment){
          if(err) res.code(500).json(err)
            res.json(payment)
        })
  })
router.route('/details/:userId')
    .get(Verify.verifyOrdinaryUser, function(req, res) {
        User.findById(req.params.userId, {})
            .select('-password')
            .populate('details')

            .populate({
                    path: 'pets',
                     populate: [{
                          path: 'specie'
                      },
                      {
                          path: 'race'
                      }]
                })
            .exec(function (err, user){
              if(err) res.code(500).json(err)
                res.json(user)
            })
      })

    .post(Verify.verifyOrdinaryUser, function(req, res) {
      
        var options2 = { upsert: true, new: true, setDefaultsOnInsert: true, strict: false};

        User.findById(req.params.userId, {})
            .exec(function (err, user){
              if(err) res.code(500).json(err)
                UserDetails.create( req.body, options2,
                  function(err, userDetails){
                      if(err) res.status(500).json(err)

                        User.findByIdAndUpdate(userDetails.user, { details: userDetails._id }, options2)
                            .populate('details')
                            .exec(function (err, userfinal){
                              if(err) res.status(500).json(err)
                                res.json(userfinal)
                            })
                    })
            })
    })
    .put(Verify.verifyOrdinaryUser, function(req, res) {
      
        var options2 = { upsert: true, new: true, setDefaultsOnInsert: true, strict: false};

        User.findById(req.params.userId, {})
            .exec(function (err, user){
              if(err) res.code(500).json(err)
                UserDetails.findByIdAndUpdate(user.details ? user.details : {},  req.body, options2)
                    .exec(function (err, userDetails){
                      if(err) res.status(500).json(err)
                        console.log(userDetails)
                        User.findByIdAndUpdate(userDetails.user, { details: userDetails._id }, options2)
                            .populate('details')
                            .exec(function (err, userfinal){
                              if(err) res.status(500).json(err)
                                res.json(userfinal)
                            })
                    })
            })
    })
    
module.exports = router;
