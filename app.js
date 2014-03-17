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

app.engine('jade', require('jade').__express);

app.set('views', __dirname + '/template');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var data = new DataStorage();
var source = new Connector();

source.start(config.get('query'));
data.start(config.get('query'), app);
engine(source, data);

var server = http.createServer(app).listen(config.get("port"), function () {
    winston.log("info", "Server has started on ");
});

var io = require('socket.io').listen(server);

app.get('/', function (req, res, next) {
    res.render('template');
});

io.set('logger', winston);

io.sockets.on('connection', function (socket) {
    data.emit('get', socket, 'create');
});

app.set('io', io);
