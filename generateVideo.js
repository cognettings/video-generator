const thumbnailImageDownloader = require('./thumbnailImageDownloader.js')
const resizeImages = require('./resizeImages.js')
const ffmpeg = require('./ffmpeg')
const downloadSong = require('./SongDownloader/downloadSong.js')
const fs = require('node:fs/promises')

module.exports = generateVideo

// if script is directly run
if (!module.parent) {
  const [node, script, topic] = process.argv
  generateVideo(topic)
}

async function generateVideo (topic, numberOfImages = 10, duration = 60) {
  await thumbnailImageDownloader(topic, numberOfImages)

  console.log('converting the images')
  await resizeImages(topic)

  console.log('downloading the audio')
  await downloadSong(topic, `./output/${topic}/`)

  await generateInputFile(topic, numberOfImages, duration)

  console.log('creating the video')
  try {
    // console.log(await ffmpeg(`-framerate 1 -pattern_type glob -i './output/${topic}/*.jpg' -i './output/${topic}/${topic}.mp3' -map 0:v -map 1:a -c:v libx264 -c:a aac -pix_fmt yuv420p -profile:v baseline -level 3 -r 30 -t 60.0 './output/${topic}/${topic}.mp4'`))
    console.log(await ffmpeg(`-y -f concat -safe 0 -i './output/${topic}/input.txt' -i './output/${topic}/${topic}.mp3' -map 0:v -map 1:a -c:v libx264 -c:a aac -pix_fmt yuv420p -profile:v baseline -level 3 -r 30 -t ${duration}.0 './output/${topic}/${topic}.mp4'`))
  } catch (e) {
    console.log(e)
  }
}

async function generateInputFile (topic, numberOfImages, duration) {
  const fileLines = []
  let currentFrame = 0
  let imageNumber = 0
  while (currentFrame < duration) {
    fileLines.push(`file 'image${imageNumber}.jpg'`)
    fileLines.push(`duration 1`)
    currentFrame++
    imageNumber = ++imageNumber % numberOfImages
  }

  await fs.writeFile(`./output/${topic}/input.txt`, fileLines.join('\n'))
}
