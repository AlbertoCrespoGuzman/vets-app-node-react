const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const express = require('express')
const path = require('path')
const compression = require('compression')
const https = require('https')
const fs = require('fs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const shell = require('shelljs')
const statusRouter = require('./routes/statusRouter')
const filesRouter = require('./routes/filesRouter')
const reactRouter = require('./routes/reactRouter')
const usersRouter = require('./routes/usersRouter')
const sendEmailRouter = require('./routes/sendEmailRouter')
const commentsRouter = require('./routes/commentsRouter')
const databaseBackup = require('./utils/database-backup')

const app = express()
require('dotenv').config()
const i18n = require("i18n")
var cors = require('cors')
const cronJob = require('cron').CronJob

const User = require('./models/user')

i18n.configure({
    locales:['pt'],
    fallback: 'pt',
    logDebugFn: function (msg) {
        console.log('debug', msg);
    },
    directory: path.join(__dirname + '/locales')
});

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(compression())

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-1dxy7.mongodb.net/vets_db?retryWrites=true&w=majority`,
    { useNewUrlParser: true })
    .then((response)=>{
        console.log('DB Connected Successfully')
        User.findOne({username: process.env.ADMIN_USER})
          .exec( function(err, user){
              if(err) console.log(err);
              
              if(user) {
                  console.log("admin master OK " + JSON.stringify(user))
              } else {
                  console.log("admin master doesn't exist");
                  User.register(new User({ username : process.env.ADMIN_USER, password: process.env.ADMIN_PASS }),
                      process.env.ADMIN_PASS, function(err, user) {
                          if(err) console.log(err)
                            user.completename = 'admin'
                            user.admin = true
                            user.save(function(err,user) {
                                console.log('admin created successfully')
                            });
                    });
              }
           });
       //    databaseBackup.collectionsBackup()
    }).catch(err => {
      console.error(err)
    })
 
 
   var databaseBackupJob = new cronJob({
      cronTime: '0 3 */1 * *',  //“At 03:00 on every day-of-month.”
      onTick: function(){
        databaseBackup.collectionsBackup()
  }})
  databaseBackupJob.start()

    app.use(passport.initialize());
    //passport.use(new LocalStrategy(User.authenticate()));
    passport.use(new LocalStrategy(function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
          if (err) return done(err);
          if (!user) return done(null, false, { msg: i18n.__("USERNAME_WRONG") })
          user.comparePassword(password, function(err, isMatch) {
            if (isMatch) {
              return done(null, user)
            } else {
              i18n.setLocale(user.lang)
              return done(null, false, { msg: i18n.__("PASSWORD_WRONG") })
            }
          })
        })
    }))
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.json({limit: '100mb'}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(i18n.init)


app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/comments', commentsRouter)
app.use('/api/users', usersRouter)
app.use('/api/files', filesRouter)
app.use('/api/send_email', sendEmailRouter)
app.use('/status', statusRouter)
app.use('/', reactRouter)


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error',{
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  
  res.render('error',{
    message: err.message,
    error: JSON.stringify(err)
  });
});

app.all('*', function(req, res, next){
  var responseSettings = {
      "AccessControlAllowOrigin": req.headers.origin,
      "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
      "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
      "AccessControlAllowCredentials": true
  }
  res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
  res.header("Access-Control-Allow-Origin",  /*responseSettings.AccessControlAllowOrigin */ '*');
  //res.header("Access-Control-Allow-Headers", /*(req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with" */ );
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);

  return next()
})

app.listen(`${process.env.PORT}`, function(){
  console.info('Server listening on port ' + this.address().port)
})





module.exports = app
