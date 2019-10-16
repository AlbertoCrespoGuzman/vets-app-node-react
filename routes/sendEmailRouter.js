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
  .post(function (req, res, next){ 
            if(req.body && req.body.name && req.body.email && 
                req.body.message && req.body.phone && req.body.address){
                var mailOptions = { from: process.env.MAIL_USER, 
                                to: process.env.MAIL_USER, 
                                subject: req.body.name + ' enviou email', 
                                html: 'Email recebido desde o site. "\n Dados do cliente:"\n Nome: ' + req.body.name + '."\n Telephone: '+ req.body.phone + '."\n Endereço: '+ req.body.address + '."\n Email de contato: '+ req.body.email + '."\n Messagem: '+ req.body.message  
                            }
                transporter.sendMail(mailOptions, function (err) {
                    if (err) { 
                        return res.status(500).send({ msg: 'error sendMail->' + err.message }); 
                    }
                    res.status(200).send({ msg: 'ok'});
                });
            }else{
                res.status(500).send({ msg: 'error sendMail '}); 
            }
    })



  module.exports = router