
const User = require('../models/user')
const File = require('../models/file')
const Comment = require('../models/comment')


var admin = require("firebase-admin");

var serviceAccount = require("./../utils/manifest-alpha-152719-firebase-adminsdk-1r3e0-1c89c45af9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://manifest-alpha-152719.firebaseio.com"
});



exports.sendPushNotificationForFileToCustomer = (file) => {
    console.log('sendPushNotificationForFileToCustomer')
    User.findOne({_id: file.user})
    .exec( function(err, user){
        if (err) throw err
        
        if(user.android_token && user.android_token.length > 5){
            var message = {
                notification: {
                title: 'Parapeti - Exame pronto',
                body: 'Seu exame ' + file.displayName + ' encontra-se disponível.'
                },
                data: {
                    screen: 'exams'
                },
                token: user.android_token
            }

            admin.messaging().send(message)
                .then((response) => {
                console.log('Successfully sent message:', response);
                })
                .catch((error) => {
                console.log('Error sending message:', error);
                });
        }else{
            console.log('no android token...')
        }


            
    })
}


exports.sendMobileNotification = (comment) => {
    console.log('sendMobileNotification', comment.receiver)
    File.findOne({_id: comment.file})
        .exec( function(err, user){
            if (err) throw err
            
            if(comment.receiver.android_token && comment.receiver.android_token.length > 5){
                
                
                var message = {
                    notification: {
                    title: 'Parapeti - Mesangem Recebida',
                    body: 'Recebeu uma mensagem referente ao exame ' + file.displayName + '.' 
                    },
                    data: {
                        screen: 'exams'
                    },
                    token: user.android_token
                }

                admin.messaging().send(message)
                    .then((response) => {
                    console.log('Successfully sent message:', response);
                    })
                    .catch((error) => {
                    console.log('Error sending message:', error);
                    });
            }else{
                console.log('no android token...')
            }
        })
}
