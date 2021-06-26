const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const ytdl = require('ytdl-core');
const filterObject = require('filter-obj');

app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'pug');

async function getVideoInfo(url) {
    const info = await ytdl.getBasicInfo(url);
    return info;
}

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/save', (req, res) => {
    const url = req.body.videoURL;

    getVideoInfo(url).then((info) => {
        let qualityOptions = info.player_response.streamingData.adaptiveFormats;

        for (let i = 0; i < qualityOptions.length; i++) {
            const filtered = filterObject(qualityOptions[i], ['mimeType']);
            console.log(filtered);
        }

        res.send('successful');
    });

})

app.listen(3000);