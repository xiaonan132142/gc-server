var mongoose = require('mongoose');
var shortid = require('shortid');
var moment = require('moment');
var User = require('./user');
var Classification = require('./classification');
var Schema = mongoose.Schema;

var ReadSchema = new Schema({
    _id: {
      type: String,
      'default': shortid.generate,
    },
    userId: String,
    classificationId: String,
    readTimes: Number,
  },
  {
    timestamps: true,
  });


ReadSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: 'userId',
  justOne: true, // for many-to-1 relationships
});

ReadSchema.virtual('classification', {
  ref: 'Classification',
  localField: 'classificationId',
  foreignField: 'classificationId',
  justOne: true, // for many-to-1 relationships
});

var Read = mongoose.model('Read', ReadSchema);
module.exports = Read;

