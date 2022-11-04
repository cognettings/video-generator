# video generator

## Description
Generates a video from a bunch of images and an audio file. The images and audio are downloaded and are based on a search term provided by the user.

## Installation
`npm install`

## Usage As Web App
`npm run startServer`

Navigate to http://localhost:3001 with a web browser and follow the instructions. Note: port 3000 is also required (by the song downloader service).

## Command Line Usage 1
Can also be used from the command line.

`npm start "search term" numberOfImages`

e.g. `npm start "french bulldog puppies" 10` Will create a slideshow-like video of "french bulldog puppies". It will contain 10 different images displayed 1 per second.

## Command Line Usage 2
I created a new monolithic version to be run on a single AWS Lambda Instance.

`node generateVideo.js 'search term' numberOfImages duration`

By default, files are saved with a base directory of './output'. A child dir is created for the video topic used. The base directory can be changed by setting the `DATADIR` environment variable.

e.g. `DATADIR='./vids/' node generateVideo.js everquest 30 60`

## Roadmap

- fix issue where downloading images never completes
- allow user to enter a target video length (number of images and audio files are automatically chosen)
