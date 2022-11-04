const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
// https://www.npmjs.com/package/ffmpeg-static
var pathToFfmpeg = require('ffmpeg-static')
console.log(pathToFfmpeg)

// exec(`${pathToFfmpeg} -i video.mp4 video.mp3`, (error, stdout, stderr) => {
//   console.log(error, stdout, stderr)
// })

// exec(`${pathToFfmpeg} -framerate 1 -pattern_type glob -i './output/cats/*.jpg' -i ./output/cats/audio -map 0:v -map 1:a -c:v libx264 -c:a aac -pix_fmt yuv420p -profile:v baseline -level 3 -r 30 -t 60.0 "cats.mp4"`,
// (error, stdout, stderr) => {
//   console.log(error, stdout, stderr)
// })

// const topic = 'cats'
// exec(`${pathToFfmpeg} -y -framerate 1 -pattern_type glob -i './output/${topic}/*.jpg' -i ./output/${topic}/audio -map 0:v -map 1:a -c:v libx264 -c:a aac -pix_fmt yuv420p -profile:v baseline -level 3 -r 30 -t 60.0 "./output/${topic}/${topic}.mp4"`,
// (error, stdout, stderr) => {
//   console.log(error, stdout, stderr)
// })

module.exports = async function (args) {
  return new Promise((resolve, reject) => {
    console.log(`${pathToFfmpeg} ${args}`)
    exec(`${pathToFfmpeg} ${args}`,
    (error, stdout, stderr) => {
      if (error) {
        reject(stderr)
      } else {
        resolve(stdout)
      }
    })
  //   const generate = spawn(pathToFfmpeg, args)

  //   generate.stdout.on('data', data => {
  //     console.log(`${data}`)
  //   })

  //   generate.stderr.on('data', data => {
  //     console.log(`${data}`)
  //   })

  //   generate.on('close', code => {
  //     console.log(`generate finished with code ${code}`)
  //     if (code !== 0) {
  //       reject(code)
  //     } else {
  //       resolve()
  //     }
  //   })
  })
}
