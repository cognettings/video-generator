const sharp = require('sharp')
const fs = require('fs/promises')

main()

async function main () {
  const dir = process.argv[2]

  const files = await fs.readdir(dir)
  const images = files.filter(file => file.endsWith('.image'))

  images.forEach(image => {
    sharp(dir + image)
      .resize(1280, 720, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0 }
      })
      .toFile(dir + image.replace('.image', '.jpg'))
  })
}
