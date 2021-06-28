const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const ytdl = require('ytdl-core');
const filterObject = require('filter-obj');
const ffmpeg = require('ffmpeg-static');
const cp = require('child_process');

// middleware for getting post data from the body in req
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.use(express.static('public'))
app.set('view engine', 'pug');

// render root page
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/search', (req, res) => {
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

            // check if it is mp4
            if (filtered.mimeType.includes('video/mp4')) {
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

app.post('/save', (req, res) => {
    const url = req.body.videoURL;
    const itag = req.body.videoItag;
    const title = encodeURI(req.body.videoTitle);

    const video = ytdl(url, {quality: itag});
    //video.pipe(fs.createWriteStream('video.mp4'));

    const audio = ytdl(url, {quality: 'highestaudio', filter: 'audioonly'});
    //audio.pipe(fs.createWriteStream('audio.mp4'));

    const ffmpegProcess = cp.spawn(ffmpeg, [
        // Remove ffmpeg's console spamming
        '-loglevel', '8', '-hide_banner',
        // Redirect/Enable progress messages
        '-progress', 'pipe:3',
        // Set inputs
        '-i', 'pipe:4',
        '-i', 'pipe:5',
        // Map audio & video from streams
        '-map', '0:a',
        '-map', '1:v',
        // Keep encoding
        '-c:v', 'copy',
        // Define output file
        //'out.mkv',
        `${title}.mkv`
    ], {
        windowsHide: true,
        stdio: [
            /* Standard: stdin, stdout, stderr */
            'inherit', 'inherit', 'inherit',
            /* Custom: pipe:3, pipe:4, pipe:5 */
            'pipe', 'pipe', 'pipe',
        ],
    });

    ffmpegProcess.stdio[3].on('data', chunk => {
        const lines = chunk.toString().trim().split('\n');
        const args = {};
        for (const l of lines) {
            const [key, value] = l.split('=');
            args[key.trim()] = value.trim();
        }

        console.log(args);
    })

    audio.pipe(ffmpegProcess.stdio[4]);
    video.pipe(ffmpegProcess.stdio[5]);

    ffmpegProcess.on('close', () => {
        res.json({successfulDownload: true});
    });

    // audio.on('end', () => {
    //     // send response to browser to know that the download has finished
    //     res.json({successfulDownload: true});
    // });

})

app.listen(3000);