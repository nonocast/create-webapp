const Router = require('koa-router');
const debug = require('debug')('app');
const md5 = require('md5');
const _ = require('lodash');

const router = new Router({ prefix: '/api/v1/accessRecords' });

router.get('/', async ctx => {
  let records = await ctx.model.Access.find();
  ctx.body = records;
});

router.get('/summary', async ctx => {
  let result = {};
  const App = require('../../../App');
  let entries = App.instance.webServer.entries;
  _.each(entries, e => result[e] = 0);

  let groups = await ctx.model.Access.aggregate([
    { $group: { _id: '$key', count: { $sum: 1 } } }
  ]);

  _.each(groups, group => result[group._id] = group.count);
  result = _.map(Object.keys(result), k => { return { route: k, hit: result[k] } });
  ctx.body = result;
});

module.exports = router;