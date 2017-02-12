var winston = require('winston');
var fs = require('fs');

if (!fs.existsSync('logs')) {
    fs.mkdirSync("logs");
}

module.exports = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            name: "info-log",
            filename: "logs/payfast-info.log",
            maxsize: 10240,
            maxFiles: 5
        }),
        new winston.transports.File({
            level: 'error',
            name: "error-log",
            filename: "logs/payfast-error.log",
            handleExceptions: true,
            maxsize: 10240,
            maxFiles: 5
        })
    ]
})
