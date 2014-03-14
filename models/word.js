var mongoose = require('lib/mongoose');
var async = require('async');
var winston = require('lib/winston')(module);

var schema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        unique: true
    },
    counter: Number
});

schema.statics.increaseCounter = function (text) {
    var Word = this;
    var words = text.split(/[, ()!\?\-+"«»\n…']/);

    async.each(words, function (word) {
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
};

exports.Word = mongoose.model('Word', schema);
