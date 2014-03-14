var config = require('config'),
    mongoose = require('lib/mongoose'),
    url = require('url'),
    jade = require('jade'),
    winston = require('lib/winston')(module),
    connector = require('lib/twitterConnector'),
    storage = require('lib/mongoResource'),
    http = require('http'),
    Word = require('models/word').Word,
    engine = require('lib/engine');
var data = new storage();
var source = new connector();

source.start('#doge');
data.start();
engine(source, data);

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

            Word.findOne({text: {$ne: "doge"}, query: "#doge"}, 'counter text', {sort: {'counter': -1}}).exec(function (err, word) {
                if (err) throw err;
                Word.find({counter: { $gte: word.counter / 10 }, text: {$ne: "doge"}, query: "#doge"}, 'counter text', {sort: {'counter': -1}}).exec(function (err, words) {
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
