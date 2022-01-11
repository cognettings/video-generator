const express = require('express')
const cors = require('cors')
const spawn = require('child_process').spawn;
const app = express()
const fs = require('fs')
const port = 3001

// i don't think i need this anymore...i think it was just so i could make a localhost request in the browser
app.use(cors())
app.options('*', cors())

app.use(express.static('html'))

app.get('/video', (req, res) => {
  const searchTerm = req.query.q

  if (typeof searchTerm === 'undefined') {
    res.status(400).end()
  } else {
    res.sendFile(`./output/${searchTerm}/${searchTerm}.mp4`, { root: __dirname })
  }
})

app.get('/generateVideo', (req, res) => {
  const searchTerm = req.query.q
  const numberOfImages = req.query.n

  // limit number of images
  if (parseInt(numberOfImages) > 200) {
    numberOfImages = 200
  }

  if (typeof searchTerm === 'undefined' || typeof numberOfImages === 'undefined' || isNaN(numberOfImages)) {
    res.status(400).end()
  } else {
    console.log(searchTerm, numberOfImages)

    if (fs.existsSync(`./output/${searchTerm}/${searchTerm}.mp4`)) {
      res.sendFile(`./output/${searchTerm}/${searchTerm}.mp4`, { root: __dirname })
      console.log('sending old file')
      return
    } else {
      console.log('need to create')
    }

    const generate = spawn('npm', ['run', 'generateForServer', searchTerm, numberOfImages])

    generate.stdout.on('data', data => {
      console.log(`${data}`)
    })

    generate.stderr.on('data', data => {
      console.log(`${data}`)
    })

    generate.on('close', code => {
      console.log(`generate finished with code ${code}`)
      if (code !== 0) {
        res.status(500).end()
      } else {
        res.sendFile(`./output/${searchTerm}/${searchTerm}.mp4`, { root: __dirname })
      }
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
