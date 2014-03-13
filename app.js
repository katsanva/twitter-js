var config = require('config');
var mongoose = require('lib/mongoose');
require('lib/engine')();
var http = require('http');

var server = http.createServer().listen(config.get("port"), function () {
    console.log("server started");
});

server.on('request', function (req, res) {

    res.write("OK");

    res.end();
});
