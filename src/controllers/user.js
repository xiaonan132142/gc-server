const _ = require('lodash');
const UserModel = require('../models').User;
const RankModel = require('../models').Rank;
const PredictModel = require('../models').Predict;
const AwardModel = require('../models').Award;
const { getUserBasicInfo } = require('../utils/dataAsync');

class User {
  constructor() {
    // super()
  }

  async addOne(req, res, next) {
    const userId = req.body.userId;
    const phoneNum = req.body.phoneNum;
    const accountName = req.body.accountName;
    if (!phoneNum) {
      res.status(500);
      res.send({
        state: 'error',
        message: 'phoneNum 不能为空',
      });
      return;
    }
    try {
      let result = await getUserBasicInfo(phoneNum);
      if (!result || !result.data || result.data.state !== 'success') {
        res.status(500);
        res.send({
          state: 'error',
          message: '没有找到该手机号对应的用户',
        });
        return;
      }
      let userInfo = result.data.data;
      if (userId !== userInfo.id) {
        res.status(500);
        res.send({
          state: 'error',
          message: '传参userId与用户userId不匹配',
        });
        return;
      }

      const userObj = {
        userId: userInfo.id,
        username: userInfo.name,
        avatar: userInfo.logo,
        phoneNum,
        accountName,
      };
      await UserModel.findOneAndUpdate({ userId }, userObj, { upsert: true });

      res.send({
        state: 'success',
        data: userObj,
      });
    } catch (err) {
      res.status(500);
      res.send({
        state: 'error',
        stack: err && err.stack,
        message: '保存数据失败:',
      });
    }
  }

  // the is a composite api for one's rank and  latest predict
  async personalInfo(req, res, next) {
    try {
      let userId = req.query.userId;

      if (!userId || userId == 'undefined') {
        res.send({
          state: 'error',
          message: 'userId 不能为空',
        });
        return;
      }

      // rank
      const winUserIds = await RankModel.find({ winRatio: { $gt: 0 } }, { userId: 1 }).sort({
        winRatio: -1,
      });

      const predictUserIds = await RankModel.find({}, { userId: 1 }).sort({
        predictTimes: -1,
      });

      let winRank = _.findIndex(winUserIds, ['userId', userId]);
      let predictRank = _.findIndex(predictUserIds, ['userId', userId]);

      const rank = await RankModel.findOne({ userId }, {
        userId: 1,
        winTimes: 1,
        predictTimes: 1,
        winRatio: 1,
      });

      const awardTimes = await AwardModel.countDocuments({ userId });
      let rankResult = {
        awardTimes,
        winRatio: 0,
        winTimes: 0,
        predictTimes: 0,
        winRank: winRank + 1,
        predictRank: predictRank + 1,
      };
      if (rank) {
        rankResult = Object.assign({}, rankResult, rank._doc);
      }

      // predict
      let latestPredict = null;
      let latestPredicts = await PredictModel.find({ userId }, {
        userId: 1,
        date: 1,
        predictResult: 1,
        actualResult: 1,
        predictValue: 1,
        actualValue: 1,
        isWin: 1,
        isFinished: 1,
        hasRead: 1,
      }).sort({
        createdAt: -1,
      }).skip(0).limit(1);

      if (latestPredicts.length) {
        latestPredict = latestPredicts[0];
      }

      res.send({
        state: 'success',
        data: {
          rank: rankResult,
          latestPredict: latestPredict,
        },
      });
    } catch (err) {
      res.status(500);
      res.send({
        state: 'error',
        stack: err && err.stack,
        message: '获取个人统计信息失败',
      });
    }
  }

}

module.exports = new User();
