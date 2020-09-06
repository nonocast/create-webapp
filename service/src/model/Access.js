const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const AccessSchema = new Schema({
  ip: { type: String, required: false },
  method: { type: String, required: true },
  path: { type: String, required: true, indexed: true },
  originalUrl: { type: String, required: true },
  status: { type: Number, required: false },
  time: { type: Number, required: false },
  length: { type: Number, required: false }
});

module.exports = mongoose.model('Access', AccessSchema, 'access');