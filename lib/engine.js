var async = require('async');

module.exports = function (connector, dataResource) {
    connector.on("parse", function (query, text) {
        var words = text.split(/[, ()!\?\-+"«»\n…']/);

        async.each(words, function (word) {
            dataResource.emit('save', query, word)
        });
    });
};
