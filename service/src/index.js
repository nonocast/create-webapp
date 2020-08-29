const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const koaLogger = require('koa-logger');
const config = require('config');
const moment = require('moment');
const app = new Koa();
const logger = require('./logger');
const debug = require('debug')('app');

const router = new Router({ prefix: '/api' });

router.get('/', ctx => {
  ctx.body = 'running';
});

router.get('/message', ctx => {
  logger.info('foobar, /message');
  ctx.body = { message: `foobar, ${moment().format('HH:mm:ss')}` };
})

app
  .use(koaLogger())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(config.port, '0.0.0.0');