const debug = require('debug')('app');
const WebServer = require('./server/WebServer');
const logger = require('./service/logger');
const config = require('config');
const moment = require('moment');
const version = require('../../package.json').version;
const mongoose = require('mongoose');

require('./model');

class App {
  static get instance() {
    if (!this._instance) { this._instance = new App(); }
    return this._instance;
  }

  // do not call new App(), use App.instance instead
  constructor() {
    if (App._instance) { return App._instance; }
    this.webServer = new WebServer();
  }

  async open() {
    logger.info(`application starting ... ver: ${version}, pid: ${process.pid}`);

    await this.openDatabase();
    await this.openWebServer();
  }

  async close() {
    await this.closeWebServer();
    await this.closeDatabase();
    logger.info('application closed.');
  }

  async openDatabase() {
    try {
      await mongoose.connect(config.db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      });
      logger.info(`mongodb connected OK: ${config.db}`);
    } catch (err) {
      logger.error(`mongodb connected FAILED: ${config.db}`)
    }
  }

  async closeDatabase() {
    await mongoose.connection.close();
    logger.info('mongodb closed.');
  }

  async openWebServer() {
    await this.webServer.open();
  }

  async closeWebServer() {
    await this.webServer.close();
  }
}

module.exports = App;