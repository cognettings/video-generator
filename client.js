// client.js

const fork = require('child_process').fork

console.log('hi')

const imageScraper = fork('./scraperServer.js')
imageScraper.on('message', (m) => {
  // send urls to download cluster
  console.log('sending scraped images to the download cluster')
  downloadCluster.send(m)
})

const downloadCluster = fork('./cluster.js')
downloadCluster.on('message', (m) => {
  if (m.done) {
    console.log('all downloads have been completed')
    process.exit(0)
  }
})

imageScraper.send({ searchTerm: 'pug puppy' })

// const child = fork('./server.js')
// child.on('message', (m) => {
//   console.log('parent got message', m)
// })

// child.send({
//   urls: [
//     'google.com',
//     'youtube.com'
//   ]
// })
