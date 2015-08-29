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
    var _this = this;
    var findWord = function (callback) {
        Word.findOne({text: word, query: "#" + query}, callback);
    };
    var updateWord = function (dWord, callback) {
        if (!dWord) {
            dWord = new Word({text: word});
        }

        dWord.query = '#' + query;
        dWord.counter = dWord.counter ? (dWord.counter + 1) : 1;

        dWord.save(callback);
    };
    var handler = function (err) {
        if (err) {
            winston.error(err.message);
        }
    };
    _this.query = query;
    _this.counter = 0;

    _this.on('save', function (query, word) {
        _this.query = query;

        word = word.toLowerCase().replace(/(\.+)$|(:+)$|[0-9].*|[#]/, '');

        if (word.length > 3 && !word.match(/(@|http(s)?:)/)) {


            async.waterfall([
                findWord,
                updateWord
            ], handler);

            if (_this.counter % 10 == 0) {
                _this.emit('get', app.get('io').sockets);
            }

            _this.counter += 1;
        }
    });

    _this.on('get', function (eventEmitter, action) {
        var findTop = function (callback) {
            Word.findOne({
                text: {$ne: _this.query},
                query: "#" + _this.query
            }, 'counter text', {sort: {'counter': -1}}).exec(callback);
        };
        var findOther = function (word, callback) {
            Word.find({
                counter: {$gte: word.counter / 10},
                text: {$ne: _this.query},
                query: "#" + _this.query
            }, 'counter text', {sort: {'counter': -1}}).exec(callback);
        };
        var handler = function (err, words) {
            if (err) {
                winston.error(err.message);
                eventEmitter.emit('error', err);
            }

            eventEmitter.emit(action || 'update', JSON.stringify(words));
        };

        async.waterfall([
            findTop,
            findOther
        ], handler);
    });
};

module.exports = MongoResource;
