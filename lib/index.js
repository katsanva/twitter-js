var config = require('./config'),
    express = require('express'),
    winston = require('./lib/winston')(module),
    Connector = require('./lib/twitterConnector'),
    EventEmitter = require("events").EventEmitter,
    DataStorage = require('./lib/mongoResource'),
    http = require('http'),
    path = require('path'),
    engine = require('./lib/engine');
var app = express();

app.engine('jade', require('jade').__express)
    .set('views', __dirname + '/template')
    .set('view engine', 'jade')
    .use(express.favicon())
    .use(express.bodyParser())
    .use(express.cookieParser())
    .use(app.router)
    .use(express.static(path.join(__dirname, 'public')));

var data = new DataStorage();
data.start(config.get('query'), app);

var source = new Connector();
var tengine = new engine(source, data);

source.start(config.get('query'));

var server = http.createServer(app)
    .listen(config.get("port"), function () {
        winston.log("info", "Server has started on ");
    });

var io = require('socket.io').listen(server);

io.set('logger', winston);
io.sockets.on('connection', function (socket) {
    data.emit('get', socket, 'create');
    tengine.trends(socket);

    socket.on('change', function (data) {
        source.start(data.replace(/%23/, ''));
    });
});

app.get('/', function (req, res) {
    res.render('template');
});

app.set('io', io);
