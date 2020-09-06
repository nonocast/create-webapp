import axios from 'axios';
import _ from 'lodash';
import Debug from 'debug';
import Cookies from 'js-cookie';
const debug = Debug('app:request');

class Request {
	set token(value) {
		this.client = axios.create();
		this.client.interceptors.request.use(cfg => {
			cfg.headers = _.assign(cfg.headers, { Authorization: `Bearer ${value}` });
			return cfg;
		});

		this.client.interceptors.response.use(response => response, error => {
			debug(error);
			if (error.response && error.response.status === 401) {
				Cookies.remove('token');
				window.location.reload();
			}
			return Promise.reject(error);
		});
	}

	async message() {
		let response = await this.client.get('/api/v1/message');
		return response.data.message;
	}

	async accessRecords() {
		let response = await this.client.get('/api/v1/accessRecords');
		return response.data;
	}

	async accessRecordSummary() {
		let response = await this.client.get('/api/v1/accessRecords/summary');
		return response.data;
	}
}

export default new Request();