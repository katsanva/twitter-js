var util = require("util");
var config = require('../config');
var eventEmitter = require("events").EventEmitter;
var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI(config.get('twitter:settings'));
var winston = require('../lib/winston')(module);

TwitterConnector = function () {
    self = this;

    self.source = twitter;
    eventEmitter.call(this);
};

util.inherits(TwitterConnector, eventEmitter);

TwitterConnector.prototype.start = function (query) {
    var self = this;

    /*  if (self.stream) {
     self.stream.removeListener;
     }*/

    self.query = query;
    console.log(query);
    self.on('error', function (err) {
    });

    self.emit('start');


    self.stream = self.source.getStream("filter", {"track": "#" + query}, config.get("twitter:accessToken").public, config.get("twitter:accessToken").private, function (err, json) {
        if (!err) {
            console.log(self.query);
//            winston.debug(json.text);
            self.emit('parse', self.query, json.text);
        } else {
            self.emit('error', err);
        }
    }, function () {
        winston.info("End of input");
        self.emit('end');
    });
};

module.exports = TwitterConnector;
