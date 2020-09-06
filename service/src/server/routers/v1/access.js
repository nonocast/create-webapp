const Router = require('koa-router');
const debug = require('debug')('app');
const md5 = require('md5');

const router = new Router({ prefix: '/api/v1/access' });

router.get('/', async ctx => {
  let entries = await ctx.model.Access.find();
  ctx.body = entries;
});

module.exports = router;