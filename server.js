// server.js

console.log('forked process started')

process.on('message', (m) => {
  console.log('forked process got message', m)

  process.send({
    filenames: [
      'google',
      'youtube'
    ]
  })
})
