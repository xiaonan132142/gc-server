const mongoose = require('mongoose');
const isProd = process.env.NODE_ENV === 'production';
const settings = require('../../config/settings');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

if (!isProd) {
  mongoose.connect(settings.DB_URL, { useNewUrlParser: true });
} else {
  mongoose.connect('mongodb://' + settings.USERNAME + ':' + settings.PASSWORD + '@' + settings.HOST + ':' + settings.PORT + '/' + settings.DB, { useNewUrlParser: true });
}

mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.once('open', () => {
  console.log('连接数据成功');
});

db.on('error', function(error) {
  console.error('Error in MongoDb connection: ' + error);
  mongoose.disconnect();
});

db.on('close', function() {
  console.log('数据库断开，重新连接数据库');
  // mongoose.connect(config.url, {server:{auto_reconnect:true}});
});

exports.Classification = require('./classification');
exports.Comment = require('./comment');
exports.Read = require('./read');
exports.User = require('./user');
