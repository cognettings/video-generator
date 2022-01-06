// https://www.npmjs.com/package/image-magick-js
const magick = require('image-magick-js')

const options = process.argv[2]

magick
  .custom(options)
  .then(response => console.log(response))
  .catch(e => {
    console.log(e)
  })
