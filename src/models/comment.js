var mongoose = require('mongoose');
var shortid = require('shortid');
var moment = require('moment');
var User = require('./user');
var Classification = require('./classification');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    _id: {
      type: String,
      'default': shortid.generate,
    },
    userId: String,
    classificationId: String,
    attitude: String,// 1,0,-1
    contents: [{
      desc: String,
      time: { type: String, default: moment().format('YYYY-MM-DD hh:mm:ss') },
    }],
    rewarded: Boolean,
    available: Boolean,
  },
  {
    timestamps: true,
  });


CommentSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: 'userId',
  justOne: true, // for many-to-1 relationships
});

CommentSchema.virtual('classification', {
  ref: 'Classification',
  localField: 'classificationId',
  foreignField: 'classificationId',
  justOne: true, // for many-to-1 relationships
});

CommentSchema.index({
  userId: 1,
  classificationId: 1,
}, {
  unique: true,
});

var Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;

