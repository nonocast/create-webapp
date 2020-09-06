const moment = require('moment');

function timestamp(schema) {
	schema.add({
		createdAt: { type: Number },
		updatedAt: { type: Number }
	});

	// Add hooks to save timestamps of creation and modification
	schema.pre('save', createdAtTimestamp);
	schema.pre('findOneAndUpdate', updatedAtTimestamp);
	schema.pre('update', updatedAtTimestamp);

	function createdAtTimestamp(next) {
		this.createdAt = moment().unix();
		this.updatedAt = moment().unix();
		next();
	}

	function updatedAtTimestamp(next) {
		this._update.updatedAt = moment().unix();
		next();
	}
}

module.exports = timestamp;