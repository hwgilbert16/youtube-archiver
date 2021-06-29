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
        $('#loadingGif').remove();
    });
});

/*------------------------*/

function whileLoading() {
    // remove previous rendered data if it exists
    if ($('#successfulDownload')) {
        $('#results').empty();
        $('#qualityList').empty();
        $('#options').empty();

        const ul = createSetAttributes('ul', {id: 'qualityList'});
        $('#options').append(ul);
    }

    // hides search button
    $('#searchButton').hide();

    // renders loading gif while video info is loading
    const loadingGif = new Image(220, 145);
    setAttributes(loadingGif, {src: 'loading.gif', id: 'loadingGif'});

    $("#results").append(loadingGif);
}

/*------------------------*/

// renders received data from server
function renderReceivedData(data) {
    $('#searchButton').show();

    // checks whether the response back succeeded
    if (data.videoThumbnail) {
        const img = new Image(640, 360);
        setAttributes(img, {src: data.videoThumbnail});
        const title = createSetAttributes('h3', {textContent: data.videoTitle})
        const author = createSetAttributes('p', {textContent: `Video by ${data.videoAuthor}`});
        $("#results").append(img, title, author);

        const br = document.createElement('br');

        // add horizontal line and download options paragraph
        $("#results").append(document.createElement('hr'));
        $("#qualityList").append(document.createElement('p').textContent = "Download Options", br);

        // loop to output download options
        for (let i = 0; i < data.videoQualityOptions.length; i++) {
            const button = createSetAttributes('button', {
                textContent: data.videoQualityOptions[i].qualityLabel,
                id: data.videoQualityOptions[i].itag
            });
            $('#qualityList').append(button);
        }

        addButtonClickHandlers(data);
    } else {
        handleError();
    }
}

/*------------------------*/

function addButtonClickHandlers(data) {
    // randomly generate a 10 digit string for the video name
    // had issues with giving the video title as the file name
    const videoName = Math.random().toString(20).substr(2, 10);

    // add click handler to all of the added buttons
    for (let i = 0; i < data.videoQualityOptions.length; i++) {
        const itag = data.videoQualityOptions[i].itag;
        $(`#${itag}`).click(() => {
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

                    const videoNameLine = createSetAttributes('p', {textContent: `Downloading ${videoName}.mkv`});

                    const loadingGif = new Image(220, 145);
                    setAttributes(loadingGif, {src: 'loading.Gif', id: 'loadingGif'})

                    $("#options").append(videoNameLine, loadingGif);
                    $("#qualityList").remove();
                },
                success: (data) => {
                    $('#options').empty();

                    const successfulDownload = createSetAttributes('p', {
                        textContent: `${videoName}.mkv downloaded successfully`,
                        id: 'successfulDownload'
                    })

                    $('#options').append(successfulDownload);
                },
                error: () => {
                    handleError();
                }
            })
        })
    }
}

/*------------------------*/
// Helper functions

function setAttributes(element, attributes) {
    for(const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

function createSetAttributes(element, attributes) {
    element = document.createElement(element);

    for(const key in attributes) {
        if (key === 'textContent') {
            element.textContent = attributes[key];
            continue;
        }

        element.setAttribute(key, attributes[key]);
    }

    return element;
}

function handleError() {
    const errorLine = createSetAttributes('p', {
        textContent: "We weren't able to find the video or something went wrong. Make sure the video public, the URL is correct, and the URL has an https:// in front of it"
    });

    $("#options").append(errorLine);
}

$(document).ajaxError(() => {
    handleError();
});