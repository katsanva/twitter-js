var config = require('config');
var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI(config.get('twitter:settings'));
var Word = require('models/word').Word;
var winston = require('lib/winston')(module);


module.exports = function () {
    twitter.getStream("filter", {"track": "#Россия"}, config.get("twitter:accessToken").public, config.get("twitter:accessToken").private, function (err, json) {
        if (!err) {
            winston.debug(json.text);
            Word.increaseCounter(json.text);
        } else {
            throw err;
        }
    }, function () {
        winston.info("End of input");
    });

};
