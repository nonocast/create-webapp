const Router = require('koa-router');

const router = new Router({ prefix: '/api/foo' });

router.get('/', async ctx => {
  ctx.body = '/foo...';
});

module.exports = router;