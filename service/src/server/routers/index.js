const Router = require('koa-router');

const router = new Router({ prefix: '/api' });

router.get('/', ctx => {
  // logger.info(`processid: ${process.pid}`, { pid: process.pid });
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

module.exports = router;