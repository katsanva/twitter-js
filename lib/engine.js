var config = require('config');
var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI(config.get('twitter:settings'));
var Word = require('models/word').Word;


module.exports = function () {
    twitter.getStream("filter", {"track": "#Россия"}, config.get("twitter:accessToken").public, config.get("twitter:accessToken").private, function (err, json) {
        if (!err) {

            console.log(json.text);
            Word.increaseCounter(json.text);
        }
    }, function () {
        console.log("EOI");
    });

}