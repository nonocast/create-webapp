const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, colorize, simple, json } = format;
require('winston-daily-rotate-file');

const config = require('config');
const moment = require('moment');
const strip = require('strip-color');

const app = format((info, opts) => {
  if (opts.app) {
    info.app = opts.app;
  }
  return info;
});

module.exports = createLogger({
  transports: [
    new transports.Console({
      format: combine(
        colorize(),
        simple(),
      )
    }),
    new transports.DailyRotateFile({
      level: 'debug',
      json: true,
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '14d',
      format: combine(
        timestamp(),
        app({ app: 'create-webapp' }),
        json()
      )
    })
  ]
});
