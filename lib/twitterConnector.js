var util = require("util");
var config = require('config');
var events = require("events");
var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI(config.get('twitter:settings'));
var winston = require('lib/winston')(module);

twitterConnector = new events.EventEmitter();

twitterConnector.on('start', function(resource) {
    twitter.getStream("filter", {"track": "#Россия"}, config.get("twitter:accessToken").public, config.get("twitter:accessToken").private, function (err, json) {
        if (!err) {
            winston.debug(json.text);
            resource.emit('parse', json.text);
        } else {
            throw err;
        }
    }, function () {
        winston.info("End of input");
    });
});

module.exports = twitterConnector;