var mongoose = require('mongoose');
var shortid = require('shortid');
var User = require('./user');
var Schema = mongoose.Schema;

var ClassificationSchema = new Schema({
    _id: {
      type: String,
      'default': shortid.generate,
    },
    userId: String,

    title: String,
    desc: String,
    sort: String,
    image: String,

    published: { type: Boolean, default: true },
    available: { type: Boolean, default: true },

    free: { type: Boolean, default: true },
    price: { type: Number, default: 0 },
    upCount: { type: Number, default: 0 },
    downCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    readTimes: { type: Number, default: 0 },
    shareTimes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  });

ClassificationSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: 'userId',
  justOne: true, // for many-to-1 relationships
});

var Classification = mongoose.model('Classification', ClassificationSchema);
module.exports = Classification;

