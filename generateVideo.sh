#!/bin/bash

# scrape image urls then download the files
node imageDownloader.js "$1" $2 &&

# resize the images
node imageMagick.js "mogrify -format jpg -resize 1280x720 -gravity center -background black -extent 1280x720 ./output/\"$1\"/*" &&

# download audio
# node downloadAudio.js "$1" &&
curl -d "{\"query\":\"$1\"}" -H "Content-Type: application/json" -X POST http://localhost:3000/main -o output/"$1"/audio &&
# curl -d "{\"query\":\"cat\"}" -H "Content-Type: application/json" -X POST http://localhost:3000/main -o audio

# create video
cd output/"$1" &&
$(node ../../ffmpeg.js) -framerate 1 -pattern_type glob -i '*.jpg' -i audio -map 0:v -map 1:a -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2" -c:v libx264 -r 30 "$1".mp4 &&
cd - &&

# play the video
open output/"$1"/"$1".mp4

# curl -d '{"query":"eve"}' -H "Content-Type: application/json" -X POST http://10.0.0.34:3000/main -o "dog"/audio
