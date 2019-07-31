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
const apiRouter = require('./routes/apiRouter')
const reactRouter = require('./routes/reactRouter')
const app = express()
require('dotenv').config()




app.use(compression())

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-1dxy7.mongodb.net/vets_db?retryWrites=true&w=majority`,
    { useNewUrlParser: true })
    .then((response)=>{
        console.log('DB Connected Successfully')
    }).catch(err => {
      console.error(err)
    })



app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.json({limit: '100mb'}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())



app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter)
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

app.listen(`${process.env.PORT}`, function(){
  console.info('Server listening on port ' + this.address().port);
});
//app.listen(`${process.env.PORT}`, `${process.env.HOST}`)
//console.log(`Running on http://${process.env.HOST}:${process.env.PORT}`)