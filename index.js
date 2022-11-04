const generateVideo = require('generateVideo.js')
const S3 = require('aws-sdk/clients/s3')
const fsp = require('fs/promises')

const s3Client = new S3()

exports.handler = async (event) => {
    const { topic, numberOfImages, duration } = event.queryStringParameters ?? {}

    const readStream = await generateVideo(topic ?? 'everquest', numberOfImages ?? 15, duration ?? 30)

    // const filename = '/tmp/temp.txt'
    // await fsp.writeFile(filename, 'generated text file')

    // const s3Name = `${topic.replaceAll(' ', '+')}.mp4` // getting a 403 error when I have spaces in my name...weird
    const s3Name = topic
    const params = {
         Body: readStream,
         Bucket: "cogs-asset-uploads-resized",
         Key: s3Name
    };
    console.log('storing object in s3', params)
    const results = await s3Client.putObject(params).promise()
    console.log('finished putting object')
    console.log(results)

    const response = {
        statusCode: 200,
        // body: JSON.stringify(generateVideo(topic, numberOfImages, duration)),
        body: videoTag(`https://cogs-asset-uploads-resized.s3.amazonaws.com/${s3Name}`),
        headers: {"Content-Type": "text/html"}
    };
    return response;
};

function videoTag (generatedVideoUrl) {
    return `<video autoplay controls loop src='${generatedVideoUrl}'></video>`
}
