var mongoose = require('mongoose');
var shortid = require('shortid');
var moment = require('moment');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    _id: {
      type: String,
      'default': shortid.generate,
    },
    userId: String,
    username: String,
    avatar: String,
    phoneNum: String,
    accountName: String,
  },
  {
    timestamps: true,
  });


UserSchema.index({
  userId: 1,
}, {
  unique: true,
});

var User = mongoose.model('User', UserSchema);
module.exports = User;

