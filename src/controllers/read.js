const _ = require('lodash');
const ReadModel = require('../models').Read;

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

      let query = {userId};

      let reads = await ReadModel.aggregate([
        {
          $match: query,
        },
        {
          $lookup: {
            from: 'classifications',
            localField: 'classificationId',
            foreignField: '_id',
            as: 'classification',
          },
        },
        {
          $project: {
            userId: 1,
            classificationId: 1,
            readTimes: 1,
            'classification.title': 1,
            'classification.contents': 1,
            'classification.published': 1,
            'classification.free': 1,
            'classification.price': 1,
            'classification.score': 1,
            'classification.commentCount': 1,
            'classification.createdAt': 1,
          },
        },
        { $limit: Number(pageSize) },
        { $skip: Number(pageSize) * (Number(current) - 1) },
        { $sort: { createdAt: -1 } },
      ]);

      const totalItems = await ReadModel.countDocuments(query);

      res.send({
        state: 'success',
        data: reads,
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
