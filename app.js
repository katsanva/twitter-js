var config = require('config'),
    express = require('express'),
    mongoose = require('lib/mongoose'),
    url = require('url'),
    winston = require('lib/winston')(module),
    connector = require('lib/twitterConnector'),
    storage = require('lib/mongoResource'),
    http = require('http'),
    path = require('path'),
    Word = require('models/word').Word,
    engine = require('lib/engine');
var app = express();

app.engine('jade', require('jade').__express);

app.set('views', __dirname + '/template');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var data = new storage();
var source = new connector();
var io = require('socket.io').listen(8080);

source.start('#doge');
data.start();
engine(source, data);

var server = http.createServer(app).listen(config.get("port"), function () {
    winston.log("info", "Server has started on ");
});

app.get('/', function(req, res, next) {
    res.render('template');
});

app.get('/getData', function(req, res, next){
    Word.findOne({text: {$ne: "doge"}, query: "#doge"}, 'counter text', {sort: {'counter': -1}}).exec(function (err, word) {
        if (err) throw err;
        Word.find({counter: { $gte: word.counter / 10 }, text: {$ne: "doge"}, query: "#doge"}, 'counter text', {sort: {'counter': -1}}).exec(function (err, words) {
            if (err) throw err;

            res.write(JSON.stringify(words));
            res.end();
        });

    });
});

/*server.on('request', function (req, res) {
    winston.log('info', "Request: " + req.method + ": " + req.headers.host + req.url);
    var urlParsed = url.parse(req.url);

    switch (urlParsed.pathname) {
        case '/':
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            });

            res.write(jade.renderFile('template.jade'));
            res.end();

            break;
        case '/getData':
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });

            Word.findOne({text: {$ne: "doge"}, query: "#doge"}, 'counter text', {sort: {'counter': -1}}).exec(function (err, word) {
                if (err) throw err;
                Word.find({counter: { $gte: word.counter / 10 }, text: {$ne: "doge"}, query: "#doge"}, 'counter text', {sort: {'counter': -1}}).exec(function (err, words) {
                    if (err) throw err;

                    res.write(JSON.stringify(words));
                    res.end();
                });

            });


            break;
        default:
            winston.log('error', "Not found: " + req.method + ": " + req.headers.host + req.url);
            res.statusCode = 404;
            res.end("Not found");
    }

});*/
io.set('logger', winston);
io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});