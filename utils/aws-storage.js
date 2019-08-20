require('dotenv').config()
const AWS = require('aws-sdk')
const fs = require('fs')
const User = require('../models/user')
const path = require('path')
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })


var s3 = new AWS.S3()

exports.saveFileInAWS = function (allFields){
    return new Promise((resolve, reject) => {
        if(process.env.AWS_ENABLED === "true"){

            User.findOne({ _id: allFields.userId})
            .exec(function(err, user){
                if (err) throw err
                
            var filePath = path.resolve('tmp') + '/' + (allFields.displayName && allFields.displayName.length > 0 ? allFields.displayName : allFields.file.originalname) + '.' + allFields.type 
            var AWSfilePath = user.username + '/' + (allFields.displayName && allFields.displayName.length > 0 ? allFields.displayName : allFields.file.originalname) + '.' + allFields.type 
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Body : fs.createReadStream(filePath),
                Key : AWSfilePath
              };
              s3.upload(params, function (err, data) {
                if (err) {
                  console.err("Error", err)
                  reject(err)
                }
                if (data) {
                  console.log("AWS in:", JSON.stringify(data))
                  console.log("Uploaded in:", data.Location)
                  try {
                    fs.unlinkSync(path.resolve('.' + allFields.tmp +  allFields.displayName +  '.' + allFields.type ))
                    resolve(AWSfilePath)
                  } catch(err) {
                    console.error(err)
                  }
                  
                }
              })
            })
            
        }else{
            console.log('!process.env.AWS_ENABLED',process.env.AWS_ENABLED)
            resolve('/tmp/')
        }
    })
}

exports.getFileFromAws = async function (AWSfilePath) {
    try {
        var params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key : AWSfilePath
          };
  
      const data = await s3.getObject(params).promise();
  
      return data.Body.toString('utf-8');
    } catch (e) {
      throw new Error(`Could not retrieve file from S3: ${e.message}`)
    }
  }
  

