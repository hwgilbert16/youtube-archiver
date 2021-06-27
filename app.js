const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const ytdl = require('ytdl-core');
const filterObject = require('filter-obj');

// middleware for getting post data from the body in req
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.use(express.static('public'))
app.set('view engine', 'pug');

// render root page
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/save', (req, res) => {
    const url = req.body.videoURL;
    console.dir(req.body);

    ytdl.getBasicInfo(url).then((info) => {
        // get the adaptiveFormats section from the getBasicInfo response
        let qualityOptionsRaw = info.player_response.streamingData.adaptiveFormats;
        const videoDetails = info.player_response.videoDetails;
        let qualityOptions = [];

        // loop through each quality option to filter
        for (let i = 0; i < qualityOptionsRaw.length; i++) {
            // filter response to only include mimeType and qualityLabel
            const filtered = filterObject(qualityOptionsRaw[i], ['mimeType', 'qualityLabel', 'itag']);

            // check if it is mp4
            if (filtered.mimeType.includes('video/mp4')) {
                // add quality to qualityOptions array if matches filter
                qualityOptions.push({"itag": filtered.itag, "qualityLabel": filtered.qualityLabel});
            }

        }

        // pack together all of the video info
        const videoInfo = {
            videoTitle: videoDetails.title,
            videoAuthor: videoDetails.author,
            videoThumbnail: videoDetails.thumbnail.thumbnails[videoDetails.thumbnail.thumbnails.length - 1].url,
            videoQualityOptions: qualityOptions
        };

        // temporary response to prevent browser from hanging
        //res.send('successful');

        res.json(videoInfo);
    });

})

app.listen(3000);