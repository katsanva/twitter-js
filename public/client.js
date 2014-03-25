var socket = io.connect('http://localhost');

var process = function (data) {
    data = $.parseJSON(data);
    $('#tags').html('');
    var size = data[0].counter;
    $.each(data, function (index, t) {
        $('#tags').append(
            $('<li>').append(
                $('<a>', {html: t.text + t.counter, href: "https://twitter.com/search?q=" + t.text, target: '_blank', "data-weight": 100 * t.counter / size })
            )
        );
    });
};

socket.on('update', function (data) {
    process(data);
    $('#canvas').tagcanvas('reload');
});

socket.on('trends', function (data) {
    var trends =  $('#trends');
    trends.html("");
    $.each(data, function (index, data) {
       trends.append($('<li>', {html: data.name, 'data-query': data.query}));
    });
});

socket.on('create', function (data) {
    process(data);

    if (!resizeCanvas($('#canvas')).tagcanvas({
        textColour: '#000',
        outlineColour: '#f0f0f0',
        reverse: true,
        depth: 0.5,
        maxSpeed: 0.1,
        weight: true,
        noSelect: true,
        shuffleTags: false,
        zoom: 0.8,
        wheelZoom: false,
        weightFrom: 'data-weight'
    }, 'tags')) {
        $('#canvasContainer').hide();
    }
});

var resizeCanvas = function (canvas) {
    var doc = $(document);
    var size = doc.height() < doc.width() ? doc.height() : doc.width();

    canvas.attr('width', size).attr('height', size);

    return canvas;
}

$(window).resize(function () {
    resizeCanvas($('#canvas'));
});

$('a[data-weight]').on('click', function () {
    console.log('ososos');
})

$(document).on('click', '#trends li', function(){
   socket.emit('change', $(this).attr('data-query'));
});