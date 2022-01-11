const https = require('https')
const fs = require('fs')

module.exports = async function download (urls, dir, baseFilename = 'download', fileExtension = '') {
  if (typeof dir === 'undefined' || dir === '') {
    throw new Error('Invalid dir')
  }

  // create dir if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  // download one file after another
  return urls.reduce((p, url, i) => {
    return p.then(() => downloadHelper(url, `./${dir}/${baseFilename}${i}${fileExtension}`))
  }, Promise.resolve())
}

function downloadHelper (url, filename) {
  return new Promise(resolve => {
    const request = https.get(url, response => {
      const file = fs.createWriteStream(filename)

      response.on('end', resolve)

      response.pipe(file)
    })
  })
}
