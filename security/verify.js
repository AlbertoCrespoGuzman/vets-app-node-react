var User = require('../models/user')
var jwt = require('jsonwebtoken') // used to create, sign, and verify tokens
require('dotenv').config()

exports.getToken = function (user) {
  return jwt.sign(user, process.env.SECURITY_SECRETKEY, {
    //expiresIn: '7d'
  });
};
exports.getUsernameFromToken = function (token){
  return new Promise((resolve, reject) => {
    
        jwt.verify(token, process.env.SECURITY_SECRETKEY, function (err, decoded){
          if (err){
            console.log('err!', err)
            var err = new Error('You are not authenticated! verifyOrdinaryUser')
            err.status = 401
            reject(err)
          }
          else{
            console.log(JSON.stringify(decoded))
            resolve(decoded.username)
          }
        })
            
          })
}
exports.getIfAdminFromToken = function (token){
  return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.SECURITY_SECRETKEY, function (err, decoded){
          if (err){
            console.log('err!', err)
            var err = new Error('You are not authenticated! verifyOrdinaryUser')
            err.status = 401
            reject(err)
          }
          else{
            resolve(decoded.admin)
          }
        })
            
          })
}
exports.verifyOrdinaryUser = function (req, res, next){
  var token = req.body.token || req.query.token || req.headers['authorization'];
  
  if (token){
    jwt.verify(token, process.env.SECURITY_SECRETKEY, function (err, decoded){
          if (err){
            
            var err = new Error('You are not authenticated! verifyOrdinaryUser')
            err.status = 401
            return next(err)
          }
          else{
            req.decoded = decoded;
            
            User.findOneAndUpdate({ username: req.decoded.username  }, {lastActivity: new Date() } )
                .exec(function (err, user) {
                if (err) next(err);
                next();
            })
          }
        });
  }
  else{
    var err = new Error('No token provided!');
    err.status = 403;
    return next(err);
  }
};

/////////////////////////////////////////////////////////////////////////////////// task 1 : verifyAdmin()

exports.verifyVet = function (req, res, next){
  var token = req.body.token || req.query.token || req.headers['authorization'];
  
  if (token){
    jwt.verify(token, process.env.SECURITY_SECRETKEY, function (err, decoded){
          if (err){
            var err = new Error('You are not authenticated to perfom this operation!');
            err.status = 401;
            return next(err);
          }else{
            req.decoded = decoded;

            if(!req.decoded.vet){
                var err = new Error('verifyVet:You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
              }else{
                User.findOneAndUpdate({ username: req.decoded.username  }, {lastActivity: new Date()} )
                  .exec(function (err, taskgroup) {
                      if (err) next(err);
                      next();
                  })
              }
          }
        });
  }
  else{
    var err = new Error('No token provided!');
    err.status = 403;
    return next(err);
  }
 }

exports.verifyClient = function (req, res, next){
    var token = req.body.token || req.query.token || req.headers['authorization'];
    
    if (token){
      jwt.verify(token, process.env.SECURITY_SECRETKEY, function (err, decoded){
            if (err){
              var err = new Error('You are not authenticated to perfom this operation!');
              err.status = 401;
              return next(err);
            }else{
              req.decoded = decoded;
  
              if(!req.decoded.client){
                  var err = new Error('verifyVet:You are not authorized to perform this operation!');
                  err.status = 403;
                  return next(err);
                }else{
                  User.findOneAndUpdate({ username: req.decoded.username  }, {lastActivity: new Date()} )
                    .exec(function (err, taskgroup) {
                        if (err) next(err);
                        next();
                    })
                }
            }
          });
    }
    else{
      var err = new Error('No token provided!');
      err.status = 403;
      return next(err);
    }
   }

exports.verifyClinic = function (req, res, next){
    var token = req.body.token || req.query.token || req.headers['authorization'];
    
    if (token){
      jwt.verify(token, process.env.SECURITY_SECRETKEY, function (err, decoded){
            if (err){
              var err = new Error('You are not authenticated to perfom this operation!');
              err.status = 401;
              return next(err);
            }else{
              req.decoded = decoded;
  
              if(!req.decoded.clinic){
                  var err = new Error('verifyVet:You are not authorized to perform this operation!');
                  err.status = 403;
                  return next(err);
                }else{
                  User.findOneAndUpdate({ username: req.decoded.username  }, {lastActivity: new Date()} )
                    .exec(function (err, taskgroup) {
                        if (err) next(err);
                        next();
                    })
                }
            }
          });
    }
    else{
      var err = new Error('No token provided!');
      err.status = 403;
      return next(err);
    }
   }
exports.verifyAdmin = function (req, res, next){
  var token = req.body.token || req.query.token || req.headers['authorization']
  if (token){
    jwt.verify(token, process.env.SECURITY_SECRETKEY, function (err, decoded){
          if (err){
            var err = new Error('You are not authenticated to perfom this operation!');
            err.status = 401;
            return next(err);
          }else{
            req.decoded = decoded;

            if(!req.decoded.admin){
                var err = new Error('verifyAdmin:You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
              }else{
                User.findOneAndUpdate({ username: req.decoded.username  }, {lastActivity: new Date()} )
                  .exec(function (err, taskgroup) {
                      if (err) next(err);
                      next();
                  })
              }
          }
        });
  }
  else{
    var err = new Error('No token provided!');
    err.status = 403;
    return next(err);
  }
 }
