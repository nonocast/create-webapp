const debug = require('debug')('app');
const logger = require('./service/logger');
const App = require('./App');

if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = 'development';
}

app = App.instance;

let main = async () => {
	await app.open();
};

let cleanup = async () => {
	await app.close();
	process.exit();
};

main().then().catch(err => {
	logger.error(err.stack);
});

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
