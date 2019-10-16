var express = require('express')
var bodyParser = require('body-parser')
var router = express.Router()
router.use(bodyParser.json());
const path = require('path')
var nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({ service: process.env.MAIL_SERVICE,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS } 
  });


router.route('/')
  .get(function (req, res, next){
            if(req.body && req.body.name && req.body.email && 
                req.body.message && req.body.phone && req.body.address){
                var mailOptions = { from: process.env.MAIL_USER, 
                                to: process.env.MAIL_USER, 
                                subject: req.body.name + ' enviou email', 
                                html: 'Email recebido desde o site. Dados do cliente: < /br> Nome: ' + req.body.name + '</br> Telephone: '+ req.body.phone + '</br> Endereço: '+ req.body.address + '</br> Email de contato: '+ req.body.email + '</br> Messagem: '+ req.body.message  
                            }
                transporter.sendMail(mailOptions, function (err) {
                    if (err) { 
                        return res.status(500).send({ msg: 'error sendMail->' + err.message }); 
                    }
                    res.status(200).send({ msg: req.__("EMAIL_VERIFICATION_SENT", user.username)});
                });
            }else{
                res.status(500).send({ msg: 'error sendMail '}); 
            }
    })



  module.exports = router