var Word = require("models/word").Word;

describe('Word', function(){
    describe('#increaseCounter()', function(){
        it('should path without error', function(){
           Word.increaseCounter('test');
           Word.increaseCounter('test');
           Word.increaseCounter('test');
        })
    })
});
