require('should');
const debug = require('debug')('test');
const config = require('config');
const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');

describe.only('OAuth', async () => {
  it('jwt with hs256', async () => {
    let secret = 'f1d9cc21-13ee-47fc-b318-c4927fc35d19';
    let wrong = '0000';
    let token = jwt.sign({ user: { username: 'nonocast' } }, secret, { expiresIn: '1h' });
    debug(token);
    let decoded = jwt.verify(token, secret);
    debug(decoded);

    (() => jwt.verify(token, wrong)).should.throw(jwt.JsonWebTokenError);
  });

  it('jwt with rs256', async () => {
    let publicKey = fs.readFileSync(config.security.publicKey, 'utf8');
    let privateKey = fs.readFileSync(config.security.privateKey, 'utf8');

    let token = jwt.sign({ user: { username: 'nonocast' } }, privateKey, { algorithm: 'RS256' });
    debug(token);
    let decoded = jwt.verify(token, publicKey);
    debug(decoded);
  });
});