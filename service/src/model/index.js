const mongoose  = require('mongoose');

mongoose.plugin(require('../misc/mongoose-plugins/timestamp'));
mongoose.plugin(require('../misc/mongoose-plugins/toJSON'));
mongoose.plugin(require('mongoose-delete'), { overrideMethods: 'all' });
mongoose.plugin(require('mongoose-paginate-v2'));

require('./User');
require('./Access');