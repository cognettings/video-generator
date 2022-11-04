const https = require('https')
const fs = require('fs')

module.exports = async function download (
  urls,
  dir,
  baseFilename = 'download',
  fileExtension = ''
) {
  if (typeof dir === 'undefined' || dir === '') {
    throw new Error('Invalid dir')
  }

  // create dir if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  const requests = urls.map((url, i) => {
    return downloadHelper(url, `${dir}/${baseFilename}${i}${fileExtension}`)
  })

  return Promise.all(requests)
}

function downloadHelper (url, filename) {
  return new Promise(resolve => {
    let numberOfRetries = 5

    makeRequest()

    function makeRequest () {
      if (numberOfRetries < 0) {
        return
      }

      numberOfRetries -= 1

      const request = https.get(url, response => {
        const file = fs.createWriteStream(filename)

        response.on('end', resolve)

        response.pipe(file)
      })

      request.on('error', function (e) {
        console.warn('failed to download an image, retrying')
        makeRequest()
      })

      request.on('timeout', function (e) {
        console.warn('failed to download an image, retrying')
        makeRequest()
        request.abort()
      })

      request.on('uncaughtException', function (e) {
        console.warn('failed to download an image, retrying')
        makeRequest()
        request.abort()
      })

      request.setTimeout(5000)
    }
  })
}
