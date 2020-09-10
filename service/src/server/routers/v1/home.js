const Router = require('koa-router');
const debug = require('debug')('app');
const md5 = require('md5');
const auth = require('../../middleware/koa-auth');

const router = new Router({ prefix: '/api/v1' });

router.get('/', ctx => {
  ctx.body = {
    status: 'running',
    pid: process.pid
  };
});

router.get('/message', auth(), async ctx => {
  ctx.body = { message: 'hello world' }
})

router.get('/user', auth(), async ctx => {
  if (!ctx.state.user) ctx.throw(404);
  ctx.body = ctx.state.user;
});

router.post('/reset', async ctx => {
  let User = ctx.model.User;
  await User.deleteMany({});
  await User.create({
    username: 'nonocast',
    password: md5('P@ssw0rd')
  });
  ctx.status = 200;
});

module.exports = router;