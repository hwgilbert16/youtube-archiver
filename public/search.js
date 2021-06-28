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
        beforeSend: addLoadingGif,
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

// renders received data from server
function renderReceivedData(data) {
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
        $("#qualityList").append(document.createElement('hr'), document.createElement('p').textContent = "Download Options", br);

        console.dir(data);

        // loop to output download options
        for (let i = 0; i < data.videoQualityOptions.length; i++) {
            const button = document.createElement('button');
            button.textContent = data.videoQualityOptions[i].qualityLabel;
            button.id = data.videoQualityOptions[i].itag;
            $('#qualityList').append(button);
        }

        addButtonClickHandlers(data);
    } else {

    }
}

// renders loading gif while video info is loading
function addLoadingGif() {
    const loadingGif = new Image();
    loadingGif.src = 'loading.gif';
    loadingGif.setAttribute('id', 'loadingGif');

    $("#results").append(loadingGif);
}