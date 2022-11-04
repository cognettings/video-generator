const soundCloudScraper = require('soundcloud-scraper')
const client = new soundCloudScraper.Client()
const fs = require('fs')

module.exports = downloadSong

// allow script to by directly run. e.g.
// node downloadSong.js everquest
if (!module.parent) {
  downloadSong(process.argv[2], process.argv[3])
}

async function downloadSong (topic, dir = './') {
  const searchResults = await client.search(topic, 'track')

  // get info for all songs so we can determine which ones are downloadable
  const urls = searchResults.map(song => song.url)
  const songs = await Promise.all(urls.map(url => client.getSongInfo(url)))

  // sort by most played
  songs.sort((a, b) => parseInt(b.playCount) - parseInt(a.playCount))

  // remove songs that don't have a progressive download url
  const downloadableSongs = songs.filter(song => !!song.streams.progressive && song.streams.progressive.endsWith('/progressive'))

  // download the song
  const song = downloadableSongs[0]
  console.log(`Downloading ${song}`)
  const stream = await song.downloadProgressive()
  const writer = stream.pipe(fs.createWriteStream(`${dir}${topic}.mp3`));

  return new Promise(resolve => {
    writer.on('finish', () => {
      console.log('Finished writing song!')
      resolve()
    })
  })
}
