/**
 * Module dependencies.
 */
'use strict'

const Counter = require('passthrough-counter')
const humanize = require('humanize-number')
const bytes = require('bytes')
const chalk = require('chalk')
const util = require('util')
const debug = require('debug')('app');

/**
 * Expose logger.
 */

module.exports = dev

/**
 * Development logger.
 */

function dev(winston, opts) {
  return async function logger(ctx, next) {
    // request
    const start = ctx[Symbol.for('request-received.startTime')] ? ctx[Symbol.for('request-received.startTime')].getTime() : Date.now()

    try {
      await next()
    } catch (err) {
      // log uncaught downstream errors
      log(winston, ctx, start, null, err)
      throw err
    }

    // calculate the length of a streaming response
    // by intercepting the stream with a counter.
    // only necessary if a content-length header is currently not set.
    const length = ctx.response.length
    const body = ctx.body
    let counter
    if (length == null && body && body.readable) {
      ctx.body = body
        .pipe(counter = Counter())
        .on('error', ctx.onerror)
    }

    // log when the response is finished or closed,
    // whichever happens first.
    const res = ctx.res

    const onfinish = done.bind(null, 'finish')
    const onclose = done.bind(null, 'close')

    res.once('finish', onfinish)
    res.once('close', onclose)

    function done(event) {
      res.removeListener('finish', onfinish)
      res.removeListener('close', onclose)
      log(winston, ctx, start, counter ? counter.length : length, null, event)
    }
  }
}

/**
 * Log helper.
 */

function log(winston, ctx, start, len, err, event) {
  // get the status code of the response
  const status = err
    ? (err.isBoom ? err.output.statusCode : err.status || 500)
    : (ctx.status || 404);

  // get the human readable response length
  let length;
  if (~[204, 205, 304].indexOf(status)) {
    length = 0;
  } else if (len == null) {
    length = null;
  } else {
    length = len;
  }

  let context = {
    req: {
      ip: ctx.ip,
      method: ctx.method,
      path: ctx.path,
      originalUrl: ctx.originalUrl,
    },
    res: {
      status,
      time: time(start),
      length
    }
  };

  console.log(`${err || status >= 400 ? chalk.yellow('warn') : chalk.green('info')}: ${ctx.method} ${ctx.originalUrl} ${status} ${context.res.time} ${length ? bytes(length).toLowerCase() : '-'}`);
  // save to mongodb
  // winston.log(err || status >= 400 ? 'warn' : 'info', `${ctx.method} ${ctx.originalUrl} ${status} ${context.res.time} ${length ? bytes(length).toLowerCase() : '-'}`, context);
}

/**
 * Show the response time in a human readable format.
 * In milliseconds if less than 10 seconds,
 * in seconds otherwise.
 */

function time(start) {
  const delta = Date.now() - start
  return humanize(delta < 10000
    ? delta + 'ms'
    : Math.round(delta / 1000) + 's')
}