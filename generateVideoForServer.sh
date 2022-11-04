#!/bin/bash

# scrape image urls then download the files
node thumbnailImageDownloader.js "$1" $2 &&

# resize the images
echo converting the images &&
# node imageMagick.js "mogrify -format jpg -resize 1280x720 -gravity center -background black -extent 1280x720 ./output/\"$1\"/*.image" &&
node resizeImages.js "$1/" &&

# download audio
# node downloadAudio.js "$1" &&
echo downloading the audio &&
curl -d "{\"query\":\"$1\"}" -H "Content-Type: application/json" -X POST http://localhost:3000/main -o $DATADIR"$1"/audio &&
# curl -d "{\"query\":\"cat\"}" -H "Content-Type: application/json" -X POST http://localhost:3000/main -o audio

# create video
cd output/"$1" &&
$(node ../../ffmpeg.js) -framerate 1 -pattern_type glob -i '*.jpg' -i audio -map 0:v -map 1:a -c:v libx264 -c:a aac -pix_fmt yuv420p -profile:v baseline -level 3 -r 30 -t 60.0 "$1".mp4
# cd - &&
cd -

# play the video
# open output/"$1"/"$1".mp4

# curl -d '{"query":"eve"}' -H "Content-Type: application/json" -X POST http://10.0.0.34:3000/main -o "dog"/audio
