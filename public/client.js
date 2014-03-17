var socket = io.connect('http://localhost');

var process = function(data) {
    data = $.parseJSON(data);
    $('#tags').html('');
    var size = data[0].counter;
    $.each(data, function (index, t) {
        $('#tags').append(
            $('<li>').append(
                $('<a>', {html: t.text + t.counter, href: "https://twitter.com/search?q="+ t.text, target: '_blank', "data-weight": 100 * t.counter / size })
            )
        );
    });
};

socket.on('update', function(data){
    process(data);
    $('#myCanvas').tagcanvas('reload');
});

socket.on('create', function(data) {
    process(data);
    if (!$('#myCanvas').tagcanvas({
        textColour: '#000',
        outlineColour: '#f0f0f0',
        reverse: true,
        depth: 0.5,
        maxSpeed: 0.1,
        weight: true,
        shuffleTags: false,
        zoom: 0.8,
        weightFrom: 'data-weight'
    }, 'tags')) {
        $('#myCanvasContainer').hide();
    }
});

$(document).ready(function(){

});