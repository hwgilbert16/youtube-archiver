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
    })
});

// renders received data from server
function renderReceivedData(data) {
    const img = new Image(640, 360)
    img.src = data.videoThumbnail;
    const title = document.createElement('p');
    title.textContent = data.videoTitle;
    const author = document.createElement('p');
    author.textContent = data.videoAuthor;
    $("#results").append(img, title, author);

    console.dir(data);

    for (let i = 0; i < data.videoQualityOptions.length; i++) {
        const button = document.createElement('button');
        button.textContent = data.videoQualityOptions[i].qualityLabel;
        $('#qualityList').append(button);
    }
}

// renders loading gif while video info is loading
function addLoadingGif() {
    const loadingGif = new Image();
    loadingGif.src = 'loading.gif';
    loadingGif.setAttribute('id', 'loadingGif');

    $("#results").append(loadingGif);
}