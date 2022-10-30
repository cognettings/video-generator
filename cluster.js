const cluster = require('cluster')
const download = require('./synchronousFileDownloader.js')

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  const children = []
  let completedCounter = 0
  const numWorkers = 10

  // Fork workers.
  for (let i = 0; i < numWorkers; i++) {
    const child = cluster.fork();
    // child.send({
    //   url: `url ${i}`
    // })

    child.on('message', (m) => {
      // console.log('cluster from child', m.url)
      if (m.done) {
        completedCounter += 1
        if (completedCounter === numWorkers) {
          process.send({ done: true })
        }
      }
    })

    children.push(child)
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });

  process.on('message', (m) => {
    if (m.urls) {
      console.log('download cluster received a request to download urls', m.urls.length)
      completedCounter = 0

      const numberForEachChild = Math.floor(m.urls.length / numWorkers)
      children.forEach(child => {
        child.send({ urls: m.urls.splice(0, numberForEachChild) })
      })
    }
  })
} else {
  const id = cluster.worker.id
  // worker / child code
  process.on('message', async (m) => {
    console.log('worker needs to download urls', m.urls.length)

    await download(m.urls, 'clusterDownloads', `image-${id}-`, '.jpg')

    console.log('worker finished downloading urls', m.urls.length)

    process.send({ done: true })
  })

  // setTimeout(() => {
  //   process.send({
  //     url: url
  //   })
  // }, 1000)
}
