const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const AccessSchema = new Schema({
  // method+path: GET /hello
  key: { type: String, required: true, index: true },
  ip: { type: String, required: false, index: true },
  method: { type: String, required: true },
  path: { type: String, required: true },
  originalUrl: { type: String, required: true },
  status: { type: Number, required: false, index: true },
  time: { type: Number, required: false },
  length: { type: Number, required: false }
});

module.exports = mongoose.model('Access', AccessSchema, 'access');