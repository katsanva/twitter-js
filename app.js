var config = require('config'),
    express = require('express'),
    mongoose = require('lib/mongoose'),
    url = require('url'),
    winston = require('lib/winston')(module),
    Connector = require('lib/twitterConnector'),
    EventEmitter = require("events").EventEmitter,
    Storage = require('lib/mongoResource'),
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

var data = new Storage();
var source = new Connector();

source.start('#doge');
data.start();
engine(source, data);

var server = http.createServer(app).listen(config.get("port"), function () {
    winston.log("info", "Server has started on ");
});
var io = require('socket.io').listen(server);


app.get('/', function (req, res, next) {
    res.render('template');
});

app.get('/getData', function (req, res, next) {
    var ee = new EventEmitter();

    ee.on('loadText', function (data) {
        res.write(data);
        res.end();
    });

    data.emit('get', ee);

});

io.set('logger', winston);
io.sockets.on('connection', function (socket) {

    data.emit('get', socket);

    socket.on('getData', function () {
        var ee = new EventEmitter();

        ee.on('loadText', function (data) {
            socket.emit('update', data);
        });

        data.emit('get', ee);
    });
});
app.set('io', io);