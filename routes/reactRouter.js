var express = require('express')
var bodyParser = require('body-parser')
var router = express.Router()
router.use(bodyParser.json());

router.route('/')
  .get(function (req, res, next){
    res.render('index', {  })
  })

  router.route('/error')
  .get(function (req, res, next){

    setTimeout(()=> {
        console.error('forcing error')
        hoalquetal
    }, 5000)
    res.send('forced error this never has to be seen')
  })


  module.exports = router