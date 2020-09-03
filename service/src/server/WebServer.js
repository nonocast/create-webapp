const _ = require('lodash');
const config = require('config');
const logger = require('../service/logger');
const debug = require('debug')('app');
const moment = require('moment');
const path = require('path');
const Koa = require('koa');
const cors = require('@koa/cors');
const koaJson = require('koa-json');
const koaBodyParser = require('koa-bodyparser');
const koaWinstonLogger = require('./middleware/koa-winston-logger');
const router = require('./routers');

class WebServer {
	constructor() {
		this.koa = this.build();
	}

	build() {
		let koa = new Koa();
		koa.proxy = true;
		koa.use(cors())
			.use(koaWinstonLogger(logger))
			.use(koaJson())
			.use(koaBodyParser())
			// .use(koaMongoose())
			.use(router.routes())
			.use(router.allowedMethods());

		return koa;
	}

	async open() {
		return new Promise((resolve, reject) => {
			this.server = this.koa.listen(config.get('port'), '0.0.0.0', () => {
				// logger.info(`ver: ${AppContext.instance.version}, ${moment().format()}`);
				logger.info(`web server started, please visit: http://0.0.0.0:${config.port} (with ${process.env.NODE_ENV} mode)`);
				resolve(this.server);
			});
		});
	}

	async close() {
		await this.server.close();
		logger.info('web server closed');
	}
}

module.exports = WebServer;