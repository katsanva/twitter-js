var util = require("util");
var async = require('async');
var eventEmitter = require("events").EventEmitter;
var Word = require('../models/word').Word;
var winston = require('../lib/winston')(module);
var MongoResource = function () {
    eventEmitter.call(this);
};

util.inherits(MongoResource, eventEmitter);

MongoResource.prototype.start = function (query, app) {
    var self = this;
    self.query = query;
    self.counter = 0;

    self.on('save', function (query, word) {
        self.query = query;

        word = word.toLowerCase().replace(/(\.+)$|(:+)$|[0-9].*|[#]/, '');

        if (word.length > 3 && !word.match(/(@|http(s)?:)/)) {
            Word.findOne({text: word, query: "#" + query}, function (err, adventure) {
                if (err) throw err;

                var dWord = adventure;

                if (dWord == null) {
                    dWord = new Word({text: word});
                }

                dWord.query = '#' + query;
                dWord.counter = dWord.counter + 1 || 1;

                dWord.save(function (err, product, numberAffected) {
                    if (err) winston.error(err.message);
                });
            });

            if (self.counter % 10 == 0)
                self.emit('get', app.get('io').sockets);
            self.counter += 1;

        }
    });

    self.on('get', function (eventEmitter, action) {
        Word.findOne({text: {$ne: self.query}, query: "#" + self.query}, 'counter text', {sort: {'counter': -1}}).exec(function (err, word) {
            if (err) throw err;
            Word.find({counter: { $gte: word.counter / 10 }, text: {$ne: self.query}, query: "#" + self.query}, 'counter text', {sort: {'counter': -1}}).exec(function (err, words) {
                if (err) throw err;

                eventEmitter.emit(action || 'update', JSON.stringify(words));
            });

        });
    });
};

module.exports = MongoResource;
