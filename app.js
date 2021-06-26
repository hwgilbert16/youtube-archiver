const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const ytdl = require('ytdl-core');
const filterObject = require('filter-obj');

// middleware for getting post data from the body in req
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'pug');

// render root page
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/save', (req, res) => {
    const url = req.body.videoURL;

    ytdl.getBasicInfo(url).then((info) => {
        // get the adaptiveformats section from the getBasicInfo response
        let qualityOptionsRaw = info.player_response.streamingData.adaptiveFormats;
        let qualityOptions = [];

        // loop through each quality option to filter
        for (let i = 0; i < qualityOptionsRaw.length; i++) {
            const filtered = filterObject(qualityOptionsRaw[i], ['mimeType', 'qualityLabel']);

            // check if it is mp4
            if (filtered.mimeType.includes('video/mp4')) {
                qualityOptions.push(filtered.qualityLabel);
            }

        }

        // temporary response to prevent browser from hanging
        res.send('successful');
    });

})

app.listen(3000);