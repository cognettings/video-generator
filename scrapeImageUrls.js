var Scraper = require('images-scraper');

const google = new Scraper({
  puppeteer: {
    headless: true,
  },
});

(async () => {
  const results = await google.scrape(process.argv[2], process.argv[3] ?? 5);
  results.forEach(result => console.log(result.url))
})();
