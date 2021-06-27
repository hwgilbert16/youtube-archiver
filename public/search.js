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
        url: '/save',
        success: renderReceivedData
    })
});

function renderReceivedData(data) {

}