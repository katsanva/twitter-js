var EventEmitter = require('events').EventEmitter;
var engine = require('../lib/engine');
var assert = require('chai').assert;

describe('engine', function () {
    describe('#parser()', function () {
        it('should save without error', function (done) {
            words = {
                "hello": 1,
                "world": 1
            };
            var connector = new EventEmitter();
            var dataResource = new EventEmitter();

            dataResource.on("save", function (tag, word) {

                assert.equal("test", tag);

                assert(words[word]);

                if (--words[word] === 0) {
                    delete words[word];
                }

                if (Object.keys(words).length == 0) {
                    done();
                }

            });

            engine(connector, dataResource);
            connector.emit("parse", "test", "hello world");
        });
    });
});
