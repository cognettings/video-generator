const cheerio = require('cheerio') // for parsing and traversing html strings
const https = require('https')

class ThumbnailScraper {
  scrape (searchTerm, numberOfImages) {
    if (typeof searchTerm === 'undefined' || searchTerm === '') {
      throw new Error('Invalid search term.')
    }

    if (typeof numberOfImages === 'undefined' || isNaN(numberOfImages) || parseInt(numberOfImages) < 1) {
      throw new Error('Invalid number of images.')
    }

    return new Promise(resolve => {
      const request = https.get(
        `https://www.google.com/search?source=lnms&tbm=isch&sa=X&tbs=&q=${searchTerm}`,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
          }
        },
        response => {
          const data = []

          response.on('data', chunk => {
            data.push(chunk)
          })

          response.on('end', () => {
            const urls = []

            // get the thumbnail urls from the response html
            const $ = cheerio.load(data.join(''))
            $('img').each(function () {
              const src = $(this).attr('data-src')
              if (src) {
                urls.push(src)
              }
            })

            // return only the number requested
            if (parseInt(numberOfImages) > urls.length) {
              resolve(urls)
            } else {
              resolve(urls.slice(0, numberOfImages))
            }
          })
        }
      )

      request.on('error', () => {
        request.abort()
      })
    })
  }
}

module.exports = ThumbnailScraper
