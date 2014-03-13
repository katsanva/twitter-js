var config = require('./config');
var mongoose = require('./lib/mongoose');
var twitterAPI = require('node-twitter-api');
var http = require('http');

var twitter = new twitterAPI(config.get('twitter:settings'));

var server = http.createServer().listen(config.get("port"), function () {

    console.log("server started");

});

twitter.getStream("filter", {"track":"#doge"}, config.get("twitter:accessToken").public, config.get("twitter:accessToken").private, function (err, json) {
    if (!err) {
        console.log(json.text);
    }
}, function () {
        console.log("EOI");
});

server.on('request', function (req, res) {

    res.write("OK");

    res.end();
});
