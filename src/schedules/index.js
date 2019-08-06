const schedule = require('node-schedule');
const { logger } = require('../middleware/logFactory');
const { write, read } = require('../utils/cacheUtil');
const settings = require('../../config/settings');
const ClassificationModel = require('../models').Classification;
const request = require('request');
const { asyncForEach } = require('../utils/helpers');
const moment = require('moment');
const { createU3 } = require('u3.js');

async function rankStatistic() {
  var rule = new schedule.RecurrenceRule();
  rule.minute = new schedule.Range(0, 59, 1);
  schedule.scheduleJob(rule, async () => {

/*    const statistics = await PredictModel.aggregate([
      //{ '$match': { 'isFinished': true } },
      {
        '$group': {
          _id: { userId: '$userId' },
          predictTimes: { $sum: 1 },
          winTimes: {
            $sum: { '$cond': [{ '$eq': ['$isWin', true] }, 1, 0] },
          },
        },
      },
      {
        '$project': {
          'predictTimes': '$predictTimes',
          'winTimes': '$winTimes',
          'winRatio': { '$divide': ['$winTimes', '$predictTimes'] },
        },
      },
      //{ '$sort': { 'predictTimes': -1 } },
    ]);

    await asyncForEach(statistics, async s => {
      let userId = s._id.userId;
      const rank = {
        userId,
        predictTimes: s.predictTimes,
        winTimes: s.winTimes,
        winRatio: s.winRatio,
      };

      await RankModel.findOneAndUpdate({ userId }, { $set: rank }, { upsert: true });
    });*/
  });
}

module.exports = {
  rankStatistic,
};
