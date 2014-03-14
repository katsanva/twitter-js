var EventEmitter = require('events').EventEmitter;
var engine = require('lib/engine');

describe('engine', function(){
    describe('#parser()', function(){
        it('should save without error', function(done){

            var connector = new EventEmitter();
            var dataResource = new EventEmitter();

            engine(connector, dataResource);

            words = {
                "hello": 1,
                "world": 1
            };

            connector.emit("parser", "test","hello world");
            dataResource.on("save", function(tag, word) {
                assert.equal("test",tag);
                assert(words[word]);
                if (--words[word] === 0) {
                    delete words[word];
                }
                if (Object.keys(words).length == 0) {
                    done();
                }

            });
        });
    });
});
