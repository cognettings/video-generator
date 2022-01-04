const SoundCloud = require("soundcloud-scraper");
const client = new SoundCloud.Client();
const fs = require("fs");
let server // call close() on this to end the program (assigned by app.listen() below)

async function downloadSong( url = "", query = "errorQuery",res)
{
  console.log("Downloading... " + url )
  return await client.getSongInfo(url)
      .then(async song => {
          const stream = await song.downloadProgressive();
          // fs.mkdir(`./${query}`, { recursive: true }, (err) => {
          //   if (err) throw err;
          // });
          //const writer = stream.pipe(fs.createWriteStream(`./${query}/audio.mp3`));
          const writer = await stream.pipe(fs.createWriteStream(`./audio.mp3`));
          // const writer = stream.pipe(fs.createWriteStream(`./${song.title}.mp3`));
          writer.on("finish", () => {
            console.log("Finished writing song!")
            res.sendFile(path.join(__dirname+'/audio.mp3'), undefined, () => {
              server.close()
            });
          });
          return true
      })
      .catch((err)=> {return false});
  console.log("Download done!")
}

async function searchSong( query = "")
{
  console.log("Searching....")
  return await client.search(query,"track")
    .then(async results => {
      console.log("Searching Completed!")
      // console.log(results)
      return await results
    })
    .catch(console.error);
  console.log("Searching Error!")
}

async function main(query = "",res)
{
  console.log(query)
  var ret = await searchSong(query)
  for (var i = 0; i < ret.length; i++) {
    var dl = await downloadSong(ret[i].url,query,res)
    console.log(dl)
    if(dl)
      break
  }
}

const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
app.use(express.static(__dirname + '/public'));

var bodyParser = require('body-parser')

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

router.get('/songDownload',function(req,res){
  res.sendFile(path.join(__dirname+'/audio.mp3'));
  //__dirname : It will resolve to your project folder.
});

router.post('/main',jsonParser,async function(req,res){
  await main(req.body.query,res)

});

router.post('/song',function(req,res){
  // downloadSong("https://soundcloud.com/dogesounds/alan-walker-feat-k-391-ignite")
  downloadSong(req.body.url)
});

app.post('/songSearch',jsonParser, async function(req,res){
  console.log(req.body)
  var ret = await searchSong(req.body.query)
  console.log("AWAITED")
  // downloadSong("https://soundcloud.com/dogesounds/alan-walker-feat-k-391-ignite",req.body.query)
  for (var i = 0; i < ret.length; i++) {
    var dl = await downloadSong(ret[i].url,req.body.query)
    if(dl)
      break
  }

  res.send(ret)
});

//add the router

app.use('/', router);
server = app.listen(process.env.port || 3000);

console.log('Running at Port 3000');
