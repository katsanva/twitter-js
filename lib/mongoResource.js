var util = require("util");
var async = require('async');
var events = require("events");
var Word = require('models/word').Word;
var winston = require('lib/winston')(module);
var mongoResource = new events.EventEmitter();

mongoResource.on('save', function (word) {
    word = word.toLowerCase().replace(/(\.+)$|(:+)$|[0-9].*|[#]/, '');

    if (word.length > 3 && !word.match(/(@|http(s)?:)/)) {
        Word.findOne({text: word}, function (err, adventure) {
            if (err) throw err;

            var dWord = adventure;

            if (dWord == null) {
                dWord = new Word({text: word});
            }

            dWord.counter = dWord.counter + 1 || 1;

            dWord.save(function (err, product, numberAffected) {
                if (err) winston.error(err.message);
//                    console.log(product.text + " : "+ product.counter);
            });
        });
    }
});

mongoResource.on('parse', function (text) {
    var words = text.split(/[, ()!\?\-+"«»\n…']/);

    async.each(words, function (word) {
        mongoResource.emit('save', word)
    });
});


module.exports = mongoResource;