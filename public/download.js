function addButtonClickHandlers(data) {
    for (let i = 0; i < data.videoQualityOptions.length; i++) {
        const itag = data.videoQualityOptions[i].itag;
        $(`#${itag}`).click(() => {

            const saveData = {
                videoURL: data.videoURL,
                videoItag: itag,
                videoTitle: data.videoTitle
            };

            $.ajax({
                type: 'POST',
                data: JSON.stringify(saveData),
                contentType: 'application/json',
                dataType: 'json',
                url: '/save',
                beforeSend: () => {
                    const loadingGif = new Image();
                    loadingGif.src = 'loading.gif';
                    loadingGif.setAttribute('id', 'loadingGif');

                    $("#options").append(loadingGif);
                    $("#qualityList").remove();
                },
                success: (data) => {
                    $('#loadingGif').remove();

                    const successfulDownload = document.createElement('h3');
                    successfulDownload.textContent = 'Video downloaded successfully';

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