const debug = require('debug')('app');
const WebServer = require('./server/WebServer');

class App {
  constructor(logger) {
    this.logger = logger;
  }

  async open() {
    this.logger.info(`application starting... pid: ${process.pid}`);
    this.webServer = new WebServer();
    await this.webServer.open();
  }

  async close() {
    this.logger.info('application closing...');
    await this.webServer.close();
  }
}

module.exports = App;