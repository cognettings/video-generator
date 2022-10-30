const https = require('https') // or 'https' for https:// URLs
const http = require('http') // or 'https' for https:// URLs
const fs = require('fs')
const cheerio = require('cheerio')

main()

// https.get(
//   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmb8EsR8ZlXiYYeYRVSf0Ca-1R_EvKQs_YkA&usqp=CAU',
//   response => {
//     const file = fs.createWriteStream(`temp/image.jpg`)
//     response.pipe(file)
//     response.on('end', () => {
//       console.log('done')
//     })
//   }
// )

function scrape () {
  return new Promise(res => {
    const request = https.get(
      'https://www.google.com/search?source=lnms&tbm=isch&sa=X&tbs=&q=cats',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
        }
      },
      function (response) {
        // const file = fs.createWriteStream(`${outputDir}/httpsImage${i}.image`)
        // response.pipe(file)
        const data = []
        response.on('data', d => {
          data.push(d)
        })

        response.on('end', () => {
          const urls = []
          // console.log(data.join(''))
          // console.log('done')
          const $ = cheerio.load(data.join(''))
          // $( "img[data-='first_name']" );
          $('img').each(function () {
            const src = $(this).attr('data-src')
            if (src) {
              // console.log(src)
              urls.push(src)
            }
          })
          // $('h2.title').text('Hello there!')
          // $('h2').addClass('welcome')

          // download(urls)
          res(urls)
        })
      }
    )

    request.on('error', () => {
      request.abort()
    })
  })
}

async function main () {
  const urls = await scrape()
  // console.log(urls)
  await download(urls)
  console.log('done')
}

function download (urls) {
  let finished = 0

  return new Promise(res => {
    // console.log(urls)
    urls.forEach((url, i) => {
      const request = https.get(
        url,
        // {
        //   headers: {
        //     'User-Agent':
        //       'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
        //   }
        // },
        response => {
          const file = fs.createWriteStream(`temp/image${i}.image`)
          response.pipe(file)
          response.on('end', () => {
            console.log('downloaded', url)
            finished += 1
          })
        }
      )

      request.on('error', e => {
        console.error('failed to download', url, e)
        request.abort()
        finished += 1
      })
    })

    // resolve when count of finished/failed downloads reaches the original number requested
    const i = setInterval(() => {
      if (finished !== urls.length) return

      clearInterval(i)

      resolve()
    }, 500)
  })
}
