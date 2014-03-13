var config = require('config');
var mongoose = require('lib/mongoose');
require('lib/engine')();
var http = require('http');
var Word = require('models/word').Word;

var server = http.createServer().listen(config.get("port"), function () {
    console.log("server started");
});

server.on('request', function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8'
    });

    Word.find({}, 'counter text', {limit: 10, sort: {'counter': -1}}).exec(function (err, words) {
        if (err) throw err;

        res.write(JSON.stringify(words));
        res.end();
    });
});
