const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, colorize, simple, json } = format;
const chalk = require("chalk");
const debug = require('debug')('app');
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

let logger = createLogger({
  transports: [
    new transports.DailyRotateFile({
      level: 'info',
      json: true,
      dirname: '/var/log/create-webapp',
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '14d',
      handleExceptions: true,
      format: combine(
        timestamp(),
        app({ app: 'create-webapp' }),
        json()
      )
    })
  ]
});

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  logger.add(
    new transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      format: combine(
        colorize(),
        simple(),
        format.printf(info => {
          let level = info.level;
          switch (level) {
            case "info":
              level = chalk.cyan(level);
              break;
            case "warn":
              level = chalk.yellow(level);
              break;
            case "error":
              level = chalk.red(level);
              break;
            default:
              break;
          }

          return `${level}: ${info.message}`;
        })
      )
    })
  );
}

module.exports = logger;