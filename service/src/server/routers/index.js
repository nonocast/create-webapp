const combineRouters = require('koa-combine-routers');
const home = require('./v1/home');
const foo = require('./v1/foo');

module.exports = combineRouters(
  home,
  foo
);