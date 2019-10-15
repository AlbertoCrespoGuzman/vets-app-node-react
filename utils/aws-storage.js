require('dotenv').config()
const AWS = require('aws-sdk')
const fs = require('fs')
const User = require('../models/user')
const path = require('path')
const moment = require('moment')
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
                
                if(allFields.displayName && allFields.displayName.length > 0 && allFields.displayName.indexOf(allFields.type) === -1){
                    allFields.displayName = allFields.displayName + '.' + allFields.type
                }
            var filePath = path.resolve('tmp') + '/' + (allFields.displayName && allFields.displayName.length > 0 ? allFields.displayName : allFields.file.originalname) /* + '.' + allFields.type */
            var AWSfilePath = user.username + '/' + (allFields.displayName && allFields.displayName.length > 0 ? allFields.displayName : allFields.file.originalname) /* + '.' + allFields.type */
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Body : fs.createReadStream(filePath),
                Key : AWSfilePath
              };
              s3.upload(params, function (err, data) {
                if (err) {
                  console.log("Error", err)
                  reject(err)
                }
                if (data) {
                  try {
                    if(allFields.displayName.split('.').length > 1){
                      fs.unlinkSync(path.resolve('.' + allFields.tmp +  allFields.displayName ))
                      resolve(AWSfilePath)
                    }else{
                      fs.unlinkSync(path.resolve('.' + allFields.tmp +  allFields.displayName +  '.' + allFields.type ))
                      resolve(AWSfilePath)
                    }
                    
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
  
exports.saveDatabaseCollectionInAWS = function (collectionPath){
    return new Promise((resolve, reject) => {
        if(process.env.AWS_ENABLED === "true"){

            
                
            var filePath = path.resolve(collectionPath)
            var AWSfilePath = 'database/' + collectionPath.split('/')[1] 
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Body : fs.createReadStream(filePath),
                Key : AWSfilePath
              };
              s3.upload(params, function (err, data) {
                if (err) {
                  console.log("Error", err)
                  reject(err)
                }
                if (data) {
                  try {
                    fs.unlinkSync(path.resolve(/*'.' + */ collectionPath))
                    resolve(AWSfilePath)
                  } catch(err) {
                    console.error(err)
                  }
                  
                }
              })
            
        }else{
            console.log('!process.env.AWS_ENABLED',process.env.AWS_ENABLED)
            resolve('/tmp/')
        }
    })
}
exports.getFilesInFolder = async (s3Folder) => {

  var files = []

  s3Folder = s3Folder.indexOf('/') != s3Folder.length ? s3Folder + '/' : s3Folder

  const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Delimiter: '/',
        Prefix: s3Folder
    };
    

    const data = await s3.listObjects(params).promise()
    
    
    for (let index = 1; index < data['Contents'].length; index++) {
        files.push(data['Contents'][index]['Key'])
    }
    return files
}
exports.removeDatabaseFilesMoreThanOneWeek = (files) =>{ 

  filesMoreThanOneWeek = []

  files.forEach(file => {
        if(file.includes('/') && file.includes('.json') && file.includes('_')){
              console.log('inside IF')
              var fileDate = ((file.split('/')[1]).split('_')[1]).split('.json')[0]
              fileDateDay = Number(fileDate.split('-')[0])
              fileDateMonth = Number(fileDate.split('-')[1]) - 1
              fileDateYear = Number(fileDate.split('-')[2])

              var a = moment([new Date().getFullYear(), new Date().getMonth(), new Date().getDate()]);
              var b = moment([fileDateYear, fileDateMonth, fileDateDay])
              if(Math.abs(a.diff(b, 'days')) >= 7 || Math.abs(a.diff(b, 'years')) > 0 || Math.abs(a.diff(b, 'months')) > 0){
                filesMoreThanOneWeek.push(file)
              }
        }
  })


  filesMoreThanOneWeek.forEach(file => {
        
          var params = {  Bucket: process.env.AWS_BUCKET_NAME, Key: file };
          s3.deleteObject(params, function(err, data) {
            if(err) console.log('error deleting file ', err)
          });
  })
      
}
