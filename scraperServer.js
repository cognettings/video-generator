const Scraper = require('./thumbnailScraper')

const s = new Scraper()

process.on('message', async (m) => {
  console.log('request to scrape images')
  const urls = await s.scrape(m.searchTerm, 100)
  console.log('images have been scraped', urls.length)

  process.send({ urls })
})
