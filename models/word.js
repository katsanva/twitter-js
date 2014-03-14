var mongoose = require('lib/mongoose');

var schema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        unique: true
    },
    'query': {
        type: String,
        required: true
    },
    counter: Number
});

exports.Word = mongoose.model('Word', schema);
