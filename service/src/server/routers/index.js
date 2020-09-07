const _ = require('lodash');
const combineRouters = require('koa-combine-routers');
const oauthServer = require('./v1/oauth/server');
const home = require('./v1/home');
const users = require('./v1/users');
const access = require('./v1/access');

let routers = [oauthServer, home, users, access];

let entries = [];

_.each(routers, router => {
  _.each(router.stack, s => {
    _.each(s.methods, m => {
      if (['GET', 'POST', 'PUT', 'DELETE'].includes(m.toUpperCase())) {
        entries.push(`${m} ${s.path}`);
      }
    })
  });
});

exports.entries = entries;
exports.routers = combineRouters(...routers);