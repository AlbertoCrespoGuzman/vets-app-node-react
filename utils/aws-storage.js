require('dotenv').config()


exports.saveFileInAWS = function (file){
    return new Promise((resolve, reject) => {
        if(process.env.AWS_ENABLED === true){
            console.log('process.env.AWS_ENABLED',process.env.AWS_ENABLED)
            resolve('aws')
        }else{
            console.log('!process.env.AWS_ENABLED',process.env.AWS_ENABLED)
            resolve('/tmp/')
        }
    })
}

