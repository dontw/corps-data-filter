const csv = require('csvtojson')

module.exports = {

  csvToJson(path) {
    return new Promise((resolve, reject) => {
      csv()
        .fromFile(path)
        .on('end_parsed', (jsonArrayObj) => {
          resolve(jsonArrayObj)
        })
        .on('done', (error) => {
          if (error) {
            console.log('oops some error:', error)
            reject(error)
          }
        })
    });

  }
}
