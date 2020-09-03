require('should');
const WebServer = require('./WebServer');
const debug = require('debug')('test');
const config = require('config');
const axios = require('axios').create({ baseURL: `http://localhost:${config.port}`, maxRedirects: 0 });


describe('WebServer', async () => {
  let webServer = new WebServer();

  before(async () => {
    await webServer.open();
  });

  after(async () => {
    await webServer.close();
  });

  it('GET /', async () => {
    let response = await axios.get('/api/');
    // debug(response.data);
  });
});