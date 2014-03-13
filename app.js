var config = require('config');
var mongoose = require('lib/mongoose');
var url = require('url');
var jade = require('jade');
require('lib/engine')();
var http = require('http');
var Word = require('models/word').Word;

var server = http.createServer().listen(config.get("port"), function () {
    console.log("server started");
});

server.on('request', function (req, res) {
    var urlParsed = url.parse(req.url);

    switch (urlParsed.pathname) {
        case '/':
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            });

            res.write(jade.renderFile('template.jade'));
            res.end();

            break;
        case '/getData':
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });

            Word.find({counter: { $gt: 20 }}, 'counter text', {sort: {'counter': -1}}).exec(function (err, words) {
                if (err) throw err;

                res.write(JSON.stringify(words));
                res.end();
            });
            break;
        default:
            res.statusCode = 404;
            res.end("Not found");
    }

});


