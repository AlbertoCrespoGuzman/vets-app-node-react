



exports.saveFileInAWS = function (file){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('simulating AWS transfer...')
            console.log('OK from AWS')
            resolve(true)
        }, 2000)
    })
}

