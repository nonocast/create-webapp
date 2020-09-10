const Router = require('koa-router');
const config = require('config');
const debug = require('debug')('app');
const md5 = require('md5');
const { nanoid } = require('nanoid');
const jwt = require('jsonwebtoken');
const { logger } = require('../../../../service/logger');

const router = new Router({ prefix: '/api/v1/oauth' });

/**
 * 第三方网页程序从浏览器发起单点登录请求
 * 
 * - 支持response_type: code, token
 * - 如果cookie包含user则callback回redirectUri
 * - 否则给出登录页面
 * 
 * code和token的区别: code适用于跨域登录, token适用于同域, 直接给页面注入cookie, 这里token和标准implict方式有些区别,标准implict采用#token=xxx
 * 
 * @api public
 */
router.get('/authorize', async ctx => {
  let { response_type, client_id, redirect_uri } = ctx.query;

  // STEP1: 参数检查
  if (!(response_type === 'code' || response_type === 'token')) { ctx.throw(400, 'Please specify `response_type`'); }
  if (!redirect_uri) { ctx.throw(400, 'Please specify `redirect_uri`'); }

  let token = ctx.cookies.get('token');

  // STEP2: cookie中没有发现token, 登录页
  if (!token) {
    let viewdata = { redirect_uri, response_type };
    await renderLoginPage(ctx, viewdata);
    return;
  }

  // STEP3: 根据jwt确定user, 根据code/token指示进行跳转
  try {
    let decoded = await jwt.verify(token, config.security.jwtSecret);
    let url = new URL(redirect_uri);
    if (response_type === 'code') {
      // url.searchParams.set('code', await generateAuthorizationCode(ctx, user));
    }
    if (response_type === 'token') {
      // nothing to do
    }
    ctx.redirect(url.href);
  } catch (error) {
    debug(error.stack);
    logger.debug('delete client token');
    ctx.cookies.set('token', '', { maxAge: 0 });
    ctx.redirect(ctx.request.header.referer);
  }
});

router.post('/authorize', async ctx => {
  let { response_type, username, password, redirect_uri, client_id } = ctx.request.body;

  // STEP1: 根据username, password确定user
  try {
    let user = await ctx.model.User.findOne({ username, password: md5(password) });
    if (!user) throw new Error('user not found or password not match');

    let url = new URL(redirect_uri);
    if (response_type === 'code') {
      let payload = { user: { username: user.username } };
      let code = jwt.sign(payload, config.security.jwtSecret, { expiresIn: '1h' });
      logger.info(`oauth code: generate jwt for user - ${user.username}`);
      url.searchParams.set('code', code);
    }

    if (response_type === 'token') {
      let payload = { user: { username: user.username } };
      let access_token = jwt.sign(payload, config.security.jwtSecret, { expiresIn: '1h' });
      logger.info(`oauth token: generate jwt for user - ${user.username}`);
      ctx.cookies.set('token', access_token, { httpOnly: false });
    }

    ctx.redirect(url.href);
  } catch (error) {
    let flash = { username, message: error.message }
    ctx.cookies.set('flash', new Buffer.from(JSON.stringify(flash)).toString('base64'));
    ctx.redirect(ctx.request.header.referer);
  }
})

/**
 * grant_type
 * - authorization_code
 * - password
 * - client_credentials
 * - refresh_token
 * - device
 * 
 * grant_type=password&username=foo&password=bar&scope=&client_id=xxx&client_secret=xxx
 * 
 * @api public
 */
router.post('/token', async ctx => {
  let { grant_type } = ctx.request.body;

  if (grant_type === 'authorization_code') {
    ctx.body = { access_token: ctx.request.body.code };

  } else if (grant_type === 'password') {
    let { username, password } = ctx.request.body;

    try {
      let user = await ctx.model.User.findOne({ username });
      if (!user) throw new Error('user not found');
      if (user.password !== md5(password)) throw new Error('password not match');

      let payload = { user: { username: user.username } };
      let access_token = jwt.sign(payload, config.security.jwtSecret, { expiresIn: '1h' });
      logger.info(`oauth password: generate jwt for user - ${user.username}`);
      ctx.body = { access_token };
    } catch (error) {
      logger.warn(error);
      ctx.throw(400, error.message);
    }
  } else if (grant_type === 'client_credentials') {
    let { client_id, client_secret } = ctx.request.body;

    if (!client_id) { ctx.throw(400, 'Please specify `client_id`'); }
    if (!client_secret) { ctx.throw(400, 'Please specify `client_secret`'); }

    // mock client
    if (client_id === 'app' && client_secret === 'P@ssw0rd') {
      let payload = { client: { username: 'app' } };
      let access_token = jwt.sign(payload, config.security.jwtSecret, { expiresIn: '1h' });
      logger.info(`oauth client credentials: generate jwt for client - ${payload.client.username}`);
      ctx.body = { access_token };
    }
  } else {
    ctx.throw(400, 'Please specify `grant_type`');
  }
});

/**
 * @api private
 */
let renderLoginPage = async (ctx, viewdata) => {
  if (ctx.cookies.get('flash')) {
    let flash = JSON.parse(new Buffer.from(ctx.cookies.get('flash'), 'base64').toString());
    viewdata.username = flash.username;
    viewdata.message = flash.message;
    ctx.cookies.set('flash', null);
  }
  await ctx.render('login', viewdata);
};

module.exports = router;