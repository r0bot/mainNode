const winston = require('winston');

const LOGS_PATH = './storage';

function init() {
  return new winston.Logger({
    level: 'info',
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: `${LOGS_PATH}/debug.log` })
    ]
  });
}

module.exports = init();
