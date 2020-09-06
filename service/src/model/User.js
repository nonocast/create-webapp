const mongoose = require('mongoose');
const hidden = require('mongoose-hidden');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

/** @class */
let UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: false, hideJSON: true }
});

UserSchema.plugin(hidden({
  defaultHidden: {
    createdAt: false,
    updatedAt: false
  }
}));
module.exports = mongoose.model('User', UserSchema);