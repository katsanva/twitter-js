var mongoose = require('lib/mongoose');

var schema = new mongoose.Schema({
    value: {
        type: String,
        required: true,
        unique: true
    },
    counter: Number
});

schema.statics.increaseCounter = function (text) {
    var words = text.split(/[, ()!?]/);
    var len = words.length;

    for (var i = 0; i < len; i++) {
        var word = words[i];
        // TODO write better regexp
       word =  word.toLowerCase().replace(/(\.+)$|(:+)$|[0-9].*/, '');
        if (word.length  > 3 && !word.match(/(@|http:)/)) {
            console.log(words[i]);
        }
    }
    console.log();
}

exports.Word = mongoose.model('Word', schema);
