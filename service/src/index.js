const debug = require('debug')('app');
const logger = require('./service/logger');
const App = require('./App');

if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = 'development';
}

let app = new App(logger);

// global不容易测试
global.logger = logger;
global.app = app;
global.foo = { bar: '123' }

let main = async () => {
	await app.open();
};

let cleanup = async () => {
	await app.close();
	process.exit();
};

main().then().catch(err => {
	logger.error(err);
});

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
