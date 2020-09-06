const combineRouters = require('koa-combine-routers');
const oauthServer = require('./v1/oauth/server');
// const oauthClient = require('./v1/oauth/client');
const home = require('./v1/home');
const users = require('./v1/users');
const access = require('./v1/access');

module.exports = combineRouters(
  oauthServer,
  home,
  users,
  access,
);