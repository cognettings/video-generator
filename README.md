# video generator

## Description
Generates a video from a bunch of images and an audio file. The images and audio are downloaded and are based on a search term provided by the user.

## Installation
`npm install`

## Usage
`npm start "search term" numberOfImages`

e.g. `npm start "french bulldog puppies" 10` Will create a slideshow-like video of "french bulldog puppies". It will contain 10 different images displayed 1 per second.

## Roadmap

- fix issue where downloading images never completes
- allow user to enter a target video length (number of images and audio files are automatically chosen)
