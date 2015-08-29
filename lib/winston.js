var winston = require('winston');

module.exports = function (module) {
    var path = module.filename.split('/').slice(-2).join('/');

    return new winston.Logger({
        transports: [
            new winston.transports.Console({timestamp: true, level: 'debug', colorize: true, label: path}),
            new winston.transports.File({timestamp: true, filename: 'events.log', level: 'info', label: path})
        ]
    });
};
