// click handler for search button
$('#search').submit((e) => {
    e.preventDefault();

    let formData = {
        'videoURL': $('#search').serializeArray()[0].value
    };

    // ajax post request for video info
    $.ajax({
        type: 'POST',
        data: JSON.stringify(formData),
        contentType: 'application/json',
        dataType: 'json',
        url: '/search',
        beforeSend: whileLoading,
        success: renderReceivedData
    }).done(() => {
        // removes loading gif once data is received
        $('#loadingGif').remove();
    });
});

$(document).ajaxError((e) => {
    console.log('Error encountered');
    console.log(e);
})

function whileLoading() {
    // remove previous rendered data if it exists
    if ($('#successfulDownload')) {
        $('#results').empty();
        $('#qualityList').empty();
        $('#options').empty();

        const ul = document.createElement('ul');
        ul.id = 'qualityList';
        $('#options').append(ul);
    }

    // hides search button
    $('#searchButton').hide();

    // renders loading gif while video info is loading
    const loadingGif = new Image(220.5, 145.5);
    loadingGif.src = 'loading.gif';
    loadingGif.setAttribute('id', 'loadingGif');

    $("#results").append(loadingGif);
}

// renders received data from server
function renderReceivedData(data) {
    // show search button
    $('#searchButton').show();

    if (data.videoThumbnail) {

        const img = new Image(640, 360)
        img.src = data.videoThumbnail;
        const title = document.createElement('h3');
        title.textContent = data.videoTitle;
        const author = document.createElement('p');
        author.textContent = `Video by ${data.videoAuthor}`;
        $("#results").append(img, title, author);

        const br = document.createElement('br');

        // add horizontal line and download options paragraph
        $("#results").append(document.createElement('hr'));
        $("#qualityList").append(document.createElement('p').textContent = "Download Options", br);

        // loop to output download options
        for (let i = 0; i < data.videoQualityOptions.length; i++) {
            const button = document.createElement('button');
            button.textContent = data.videoQualityOptions[i].qualityLabel;
            button.id = data.videoQualityOptions[i].itag;
            $('#qualityList').append(button);
        }

        addButtonClickHandlers(data);
    }
}

function addButtonClickHandlers(data) {
    for (let i = 0; i < data.videoQualityOptions.length; i++) {
        const itag = data.videoQualityOptions[i].itag;
        $(`#${itag}`).click(() => {
            // randomly generate a 10 digit string for the video name
            // had issues with giving the video title as the file name
            const videoName = Math.random().toString(20).substr(2, 10);

            const saveData = {
                videoURL: data.videoURL,
                videoItag: itag,
                videoName
            };

            $.ajax({
                type: 'POST',
                data: JSON.stringify(saveData),
                contentType: 'application/json',
                dataType: 'json',
                url: '/save',
                beforeSend: () => {
                    const videoNameLine = document.createElement('p');
                    videoNameLine.textContent = `Downloading ${videoName}.mkv`;

                    const loadingGif = new Image(220.5, 145.5);
                    loadingGif.src = 'loading.gif';
                    loadingGif.setAttribute('id', 'loadingGif');

                    $("#options").append(videoNameLine, loadingGif);
                    $("#qualityList").remove();
                },
                success: (data) => {
                    $('#options').empty();

                    const successfulDownload = document.createElement('p');
                    successfulDownload.textContent = `${videoName}.mkv downloaded successfully`;
                    successfulDownload.id = 'successfulDownload';

                    $('#options').append(successfulDownload);
                    console.log('Download successful');
                    console.log(data);
                },
                error: (xhr, status, error) => {
                    console.log(error);
                }
            })
        })
    }
}