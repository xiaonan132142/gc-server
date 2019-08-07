const _ = require('lodash');
const ReadModel = require('../models').Read;
const ClassificationModel = require('../models').Classification;

class Read {
  constructor() {
    // super()
  }

  async getAllByUserId(req, res, next) {
    try {
      let current = req.query.current || 1;
      let pageSize = req.query.pageSize || 10;
      let userId = req.query.userId;

      if (!userId || userId == 'undefined') {
        res.send({
          state: 'error',
          message: 'userId 不能为空',
        });
        return;
      }

      let readIdRes = await ReadModel.find({ userId }, { classificationId: 1 }).sort({
        createdAt: -1,
      });

      let readIds = readIdRes.map(r => {
        return r.classificationId;
      });

      let query = { available: true, _id: { $in: readIds } };
      let classifications = await ClassificationModel.aggregate([
        {
          $match: query,
        },
        {
          $lookup: {
            from: 'users', localField: 'userId', foreignField: 'userId', as: 'user',
          },
        },
        {
          $project: {
            userId: 1,
            title: 1,
            contents: 1,
            published: 1,
            free: 1,
            price: 1,
            score: 1,
            commentCount: 1,
            createdAt: 1,
            'user.avatar': 1,
            'user.accountName': 1,
          },
        },
        { $limit: Number(pageSize) },
        { $skip: Number(pageSize) * (Number(current) - 1) },
        { $sort: { score: -1 } },
      ]);

      const totalItems = await ClassificationModel.countDocuments(query);

      res.send({
        state: 'success',
        data: classifications,
        pagination: {
          totalItems,
          current: Number(current) || 1,
          pageSize: Number(pageSize) || 10,
        },
      });
    } catch (err) {
      res.status(500);
      res.send({
        state: 'error',
        stack: err && err.stack,
        message: '获取已读列表失败',
      });
    }
  }

  async addOne(req, res, next) {

    let userId = req.body.userId;
    let classificationId = req.body.classificationId;

    if (!userId || userId == 'undefined') {
      res.send({
        state: 'error',
        message: 'userId 不能为空',
      });
      return;
    }

    if (!classificationId || classificationId == 'undefined') {
      res.send({
        state: 'error',
        message: 'classificationId 不能为空',
      });
      return;
    }

    try {
      const read = {
        userId,
        classificationId,
        readTimes: 1,
      };

      const newRead = new ReadModel(read);
      await newRead.save();
      res.send({
        state: 'success',
        id: newRead._id,
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

}

module.exports = new Read();
