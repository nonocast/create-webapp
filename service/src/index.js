const Koa = require('koa');
const http = require('http');
const Router = require('koa-router');
const cors = require('@koa/cors');
const koaWinstonLogger = require('./koa-winston-logger');
const morgan = require('koa-morgan')
const config = require('config');
const moment = require('moment');
const logger = require('./logger');
const debug = require('debug')('app');
const _ = require('lodash');

const app = new Koa();

const router = new Router({ prefix: '/api' });

router.get('/', ctx => {
  logger.info(`processid: ${process.pid}`, { pid: process.pid });
  ctx.body = {
    status: 'running',
    pid: process.pid
  };
});

router.get('/message', ctx => {
  logger.info('/message ' + ctx.query.id);
  ctx.body = { message: `ruby, ${moment().format('HH:mm:ss')}` };
})

router.post('/message', ctx => {
  logger.warn('will throw 401');
  ctx.throw(401);
});

app.proxy = true;

app
  .use(koaWinstonLogger(logger))
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(config.port, '0.0.0.0', () => {
  logger.info('server started.');
});

// console.log(_.flatten(router.stack.map(i => _.map(i.methods, m => { return { method: m, path: i.path } }))));
// console.log(router.stack.map(i => i));