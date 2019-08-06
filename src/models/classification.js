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
    contents: [{
      desc: String,
      image: String,
      sort: String,
    }],
    published: { type: Boolean, default: true },
    available: { type: Boolean, default: true },
    free: { type: Boolean, default: true },
    price: Number,
    score: Number,
    readTimes: Number,
    shareTimes: Number,
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
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

