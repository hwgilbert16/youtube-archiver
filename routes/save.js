const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg-static');
const cp = require('child_process');

router.post('/', (req, res) => {
    const url = req.body.videoURL;
    const itag = req.body.videoItag;
    const fileName = req.body.videoName;

    // create video and audio streams
    const video = ytdl(url, {quality: itag});
    const audio = ytdl(url, {quality: 'highestaudio', filter: 'audioonly'});

    // spawn ffmpeg process
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
        `videos/${fileName}.mkv`
    ], {
        windowsHide: true,
        stdio: [
            /* Standard: stdin, stdout, stderr */
            'inherit', 'inherit', 'inherit',
            /* Custom: pipe:3, pipe:4, pipe:5 */
            'pipe', 'pipe', 'pipe',
        ],
    });

    // pipe audio and video streams to ffmpeg
    audio.pipe(ffmpegProcess.stdio[4]);
    video.pipe(ffmpegProcess.stdio[5]);

    // send response to client on successful video download
    ffmpegProcess.on('close', () => {
        res.json({successfulDownload: true});
    });

});

module.exports = router;