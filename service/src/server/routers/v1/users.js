const Router = require('koa-router');
const debug = require('debug')('app');
const md5 = require('md5');

const router = new Router({ prefix: '/api/v1/users' });

router.get('/', async ctx => {
  let users = await ctx.model.User.find();
  ctx.body = users;
});


module.exports = router;