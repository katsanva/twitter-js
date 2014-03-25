var async = require('async');
var config = require('../config');


var engine = function (connector, dataResource) {
    var self = this;

    self.connector = connector;
    self.resourse = dataResource;

    connector.on("parse", function (query, text) {
        var words = text.split(/[, ()!\?\-+"«»\n…']/);

        async.each(words, function (word) {
            dataResource.emit('save', query, word)
        });
    });

    return self;
};

engine.prototype.trends = function (socket) {
    self = this;

    self.connector.on('trends', function () {
        self.connector.source.trends('place', {id: 23424976}, config.get("twitter:accessToken").public, config.get("twitter:accessToken").private, function (err, data, response) {
            if (err) {
                console.log(err);
                return;
            }

            socket.emit('trends', data[0].trends);
        });
    });
    self.connector.emit('trends');

//    setInterval(function () {
//    }, 10000)


}

module.exports = engine;