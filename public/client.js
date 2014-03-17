var socket = io.connect('http://localhost');

socket.on('update', function(data) {
    console.log(data);
    data = $.parseJSON(data);
    var size = data[0].counter;
    $.each(data, function (index, t) {
        $('#tags').append(
            $('<li>').append(
                $('<a>', {html: t.text, href: "https://twitter.com/search?q="+ t.text, target: '_blank', "data-weight": 100 * t.counter / size })
            )
        );
    });

    if (!$('#myCanvas').tagcanvas({
        textColour: '#000',
        outlineColour: '#f0f0f0',
        reverse: true,
        depth: 0.5,
        maxSpeed: 0.1,
        weight: true,
        shuffleTags: true,
        zoom: 0.8,
        weightFrom: 'data-weight'
    }, 'tags')) {
        $('#myCanvasContainer').hide();
    }

});

$(document).ready(function(){

});