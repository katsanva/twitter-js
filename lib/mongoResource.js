var util = require("util");
var async = require('async');
var eventEmitter = require("events").EventEmitter;
var Word = require('models/word').Word;
var winston = require('lib/winston')(module);
var MongoResource = function () {
    eventEmitter.call(this);
};

util.inherits(MongoResource, eventEmitter);

MongoResource.prototype.start = function () {
    var self = this;

    self.on('save', function (query, word) {
        word = word.toLowerCase().replace(/(\.+)$|(:+)$|[0-9].*|[#]/, '');

        if (word.length > 3 && !word.match(/(@|http(s)?:)/)) {
            Word.findOne({text: word, query: query}, function (err, adventure) {
                if (err) throw err;

                var dWord = adventure;

                if (dWord == null) {
                    dWord = new Word({text: word});
                }

                dWord.query = query;
                dWord.counter = dWord.counter + 1 || 1;

                dWord.save(function (err, product, numberAffected) {
                    if (err) winston.error(err.message);
                });
            });

            self.emit('get', app.get('io').sockets);
        }
    });

    self.on('get', function (eventEmitter) {
        Word.findOne({text: {$ne: "doge"}, query: "#doge"}, 'counter text', {sort: {'counter': -1}}).exec(function (err, word) {
            if (err) throw err;
            Word.find({counter: { $gte: word.counter / 10 }, text: {$ne: "doge"}, query: "#doge"}, 'counter text', {sort: {'counter': -1}}).exec(function (err, words) {
                if (err) throw err;

                eventEmitter.emit('update', JSON.stringify(words));
            });

        });
    });
};

module.exports = MongoResource;
