const https = require('https') // or 'https' for https:// URLs
const http = require('http') // or 'https' for https:// URLs
const fs = require('fs')

var Scraper = require('images-scraper')

const google = new Scraper({
  puppeteer: {
    headless: true
  }
})

const outputDir = `output/${process.argv[2]}`

try {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
  }

  main()
} catch (err) {
  console.error(err)
}

function scrape () {
  return new Promise(async resolve => {
    const results = await google.scrape(process.argv[2], process.argv[3] ?? 5)
    const urls = results.map(result => result.url)
    resolve(urls)
  })
}

async function main () {
  const urls = await scrape()

  const httpsUrls = urls.filter(url => url.startsWith('https'))
  const httpUrls = urls.filter(url => !url.startsWith('https'))

  httpsUrls.forEach((url, i) => {
    const request = https.get(url, function (response) {
      const file = fs.createWriteStream(`${outputDir}/httpsImage${i}`)
      response.pipe(file)
      response.on('end', () => {
        console.log('downloaded', url)
      })
    })

    request.on('error', (e) => {
      console.error('failed to download', url, e)
    })
  })

  httpUrls.forEach((url, i) => {
    const request = http.get(url, function (response) {
      const file = fs.createWriteStream(`${outputDir}/httpImage${i}`)
      response.pipe(file)
      response.on('end', () => {
        console.log('downloaded', url)
      })
    })

    request.on('error', (e) => {
      console.error('failed to download', url, e)
    })
  })
}
