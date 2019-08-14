var express = require('express')
var bodyParser = require('body-parser')
var router = express.Router()
router.use(bodyParser.json());

router.route('/')
  .get(function (req, res, next){

    res.send('index2.html')
  })
  router.route('/reset_password')
  .get(function (req, res, next){
    res.send('index.html')
  })
  
  


  module.exports = router