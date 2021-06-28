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
                error: (xhr, status, error) => {
                    console.log(error);
                },
                success: (data) => {
                    console.log(data);
                }
            })
        })
    }

}