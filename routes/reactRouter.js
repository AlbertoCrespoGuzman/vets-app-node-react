var express = require('express')
var bodyParser = require('body-parser')
var router = express.Router()
router.use(bodyParser.json());
const path = require('path')

router.route('/')
  .get(function (req, res, next){
    res.sendFile(path.join(__dirname, 'frontend-react/build', 'index.html'));
  })

  router.route('/reset_password')
  .get(function (req, res, next){
    console.log('ÉTOY AQUIIIIi')
    res.sendFile('index.html');
  })  
  


  module.exports = router