const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');
const filterObject = require('filter-obj');

router.post('/', (req, res) => {
    const url = req.body.videoURL;

    ytdl.getBasicInfo(url, {filter: 'videoonly'}).then((info) => {
        // get the adaptiveFormats section from the getBasicInfo response
        let qualityOptionsRaw = info.player_response.streamingData.adaptiveFormats;
        const videoDetails = info.player_response.videoDetails;
        let qualityOptions = [];

        // loop through each quality option to filter
        for (let i = 0; i < qualityOptionsRaw.length; i++) {
            // filter response to only include mimeType and qualityLabel
            const filtered = filterObject(qualityOptionsRaw[i], ['mimeType', 'qualityLabel', 'itag']);
            console.log(filtered.mimeType);

            // check if it is mp4
            if (filtered.mimeType.includes('video/mp4') || filtered.mimeType.includes('av01')) {
                // add quality to qualityOptions array if matches filter
                qualityOptions.push({"itag": filtered.itag, "qualityLabel": filtered.qualityLabel, "mimeType": filtered.mimeType});
            }
        }

        // pack together all of the video info
        const videoInfo = {
            videoTitle: videoDetails.title,
            videoAuthor: videoDetails.author,
            videoThumbnail: videoDetails.thumbnail.thumbnails[videoDetails.thumbnail.thumbnails.length - 1].url,
            videoQualityOptions: qualityOptions,
            videoURL: url
        };

        res.json(videoInfo);
    }).catch(() => {
        const eMessage = {
            "error": "error_encountered"
        };

        res.json(eMessage);
    });

})

module.exports = router;