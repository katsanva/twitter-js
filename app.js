var config = require('config');
var mongoose = require('lib/mongoose');
var url = require('url');
var jade = require('jade');
var winston = require('lib/winston')(module);
require('lib/engine')(require('lib/twitterConnector'), require('lib/mongoResource'));
var http = require('http');
var Word = require('models/word').Word;

var server = http.createServer().listen(config.get("port"), function () {
    winston.log("info", "Server has started on ");
});

server.on('request', function (req, res) {
    winston.log('info', "Request: " + req.method + ": " + req.headers.host + req.url);
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

            Word.findOne({text: {$ne: "россия"}}, 'counter text', {sort: {'counter': -1}}).exec(function (err, word) {
                if (err) throw err;
                Word.find({counter: { $gte: word.counter / 10 }, text: {$ne: "россия"}}, 'counter text', {sort: {'counter': -1}}).exec(function (err, words) {
                    if (err) throw err;

                    res.write(JSON.stringify(words));
                    res.end();
                });

            });


            break;
        default:
            winston.log('error', "Not found: " + req.method + ": " + req.headers.host + req.url);
            res.statusCode = 404;
            res.end("Not found");
    }

});


