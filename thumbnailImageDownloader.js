const ImageScraper = require('./thumbnailScraper.js')
const download = require('./asynchronousFileDownloader.js')

const scraper = new ImageScraper()

main()

async function main () {
  const urls = await scraper.scrape(process.argv[2], process.argv[3])
  console.log('scraped the urls', urls)
  await download(urls, `./output/${process.argv[2]}`, 'image', '.image')
  console.log('downloaded the images')
}
