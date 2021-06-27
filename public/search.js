$('#search').submit((e) => {
    e.preventDefault();

    let formData = {
        'videoURL': $('#search').serializeArray()[0].value
    };

    console.log(formData)
    $.ajax({
        type: 'POST',
        data: JSON.stringify(formData),
        contentType: 'application/json',
        dataType: 'json',
        url: '/search',
        beforeSend: () => {
            console.log('hello!');
        },
        success: renderReceivedData
    })
});

function renderReceivedData(data) {
    const img = new Image(640, 360)
    img.src = data.videoThumbnail;

    const title = document.createElement('p');
    title.textContent = data.videoTitle;

    const author = document.createElement('p');
    author.textContent = data.videoAuthor;

    $("#results").append(img, title, author);
}

function addLoadingGif() {

}