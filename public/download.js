function addButtonClickHandlers(data) {
    for (let i = 0; i < data.videoQualityOptions.length; i++) {
        const itag = data.videoQualityOptions[i].itag;
        $(`#${itag}`).click(() => {
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