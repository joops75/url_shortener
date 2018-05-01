var handleEvent = function() {
    $.ajax({
        url: '/api/shorten',
        type: 'POST',
        dataType: 'JSON',
        data: {url: $('#inputUrl').val()},
        success: function(data) {
            if (data.shortUrl) {
                $('#link').html('{ "original url": ' + '<a href="' + data.longUrl + '">' + data.longUrl + '</a>' +
                ', "short url": ' + '<a href="' + data.shortUrl + '">' + data.shortUrl + '</a>' + ' }')
            }
            else {
                $('#link').text(`{ "error": "Invalid url. Url must begin with 'http://' or 'https://' and have at least one '.' to be valid." }`)
            }
            $('#link').hide().fadeIn(1000)
        }
    })
}

$('#urlButton').on('click', handleEvent)
$('#inputUrl').keypress(function(e) {
    if (e.which == 13) handleEvent()
})
