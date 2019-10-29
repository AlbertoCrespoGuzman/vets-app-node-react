var shell = require('shelljs')
const moment = require('moment')
const awsStorage = require('./aws-storage')
require('dotenv').config()


exports.collectionsBackup = async () => {
    var dateTime = moment().format('DD-MM-YYYY')
    const usersCollectionPath = 'tmp/users_' + dateTime + '.json';
    const filesCollectionPath = 'tmp/files_' + dateTime + '.json';
    const commentsCollectionPath = 'tmp/comments_' + dateTime + '.json';
    
    var prefix = ""
    if(os.platform() === 'linux'){
      prefix = "./usr/bin/"
    }
    
    shell.exec(prefix + 'mongoexport --host Cluster0-shard-0/cluster0-shard-00-00-1dxy7.mongodb.net:27017,cluster0-shard-00-01-1dxy7.mongodb.net:27017,cluster0-shard-00-02-1dxy7.mongodb.net:27017 --ssl --username '+ process.env.MONGO_DB_USERNAME + ' --password '+ process.env.MONGO_DB_PASSWORD + ' --authenticationDatabase admin --db   '+ process.env.MONGO_DB_DATABASE + ' --collection users --type json --out ' + usersCollectionPath + ' ')
    shell.exec(prefix + 'mongoexport --host Cluster0-shard-0/cluster0-shard-00-00-1dxy7.mongodb.net:27017,cluster0-shard-00-01-1dxy7.mongodb.net:27017,cluster0-shard-00-02-1dxy7.mongodb.net:27017 --ssl --username '+ process.env.MONGO_DB_USERNAME + ' --password '+ process.env.MONGO_DB_PASSWORD + ' --authenticationDatabase admin --db   '+ process.env.MONGO_DB_DATABASE + ' --collection files --type json --out ' + filesCollectionPath + ' ')
    shell.exec(prefix + 'mongoexport --host Cluster0-shard-0/cluster0-shard-00-00-1dxy7.mongodb.net:27017,cluster0-shard-00-01-1dxy7.mongodb.net:27017,cluster0-shard-00-02-1dxy7.mongodb.net:27017 --ssl --username '+ process.env.MONGO_DB_USERNAME + ' --password '+ process.env.MONGO_DB_PASSWORD + ' --authenticationDatabase admin --db   '+ process.env.MONGO_DB_DATABASE + ' --collection comments --type json --out ' + commentsCollectionPath + ' ')

    awsStorage.saveDatabaseCollectionInAWS(usersCollectionPath)
    awsStorage.saveDatabaseCollectionInAWS(filesCollectionPath)
    awsStorage.saveDatabaseCollectionInAWS(commentsCollectionPath)
    awsStorage.removeDatabaseFilesMoreThanOneWeek( await awsStorage.getFilesInFolder('database'))

}
