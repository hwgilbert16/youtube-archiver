const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const ytdl = require('ytdl-core');
const filterObject = require('filter-obj');

app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/save', (req, res) => {
    const url = req.body.videoURL;

    ytdl.getBasicInfo(url).then((info) => {
        let qualityOptionsRaw = info.player_response.streamingData.adaptiveFormats;
        let qualityOptions = [];

        for (let i = 0; i < qualityOptionsRaw.length; i++) {
            const filtered = filterObject(qualityOptionsRaw[i], ['mimeType', 'qualityLabel']);

            if (filtered.mimeType.includes('video/mp4')) {
                qualityOptions.push(filtered.qualityLabel);
            }

        }
        console.dir(qualityOptions);

        res.send('successful');
    });

})

app.listen(3000);