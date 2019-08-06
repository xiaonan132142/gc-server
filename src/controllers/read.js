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

      const reads = await ReadModel.find({ userId }, {
        'userId': 1,
        'classificationId': 1,
        'readTimes': 1,
      }).sort({
        createdAt: -1,
      }).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize)).populate([
        {
          path: 'classificationId',
          select: 'title free score',
        }]).exec();

      const totalItems = await ReadModel.countDocuments({ userId });

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

    let userId = req.query.userId;
    let classificationId = req.query.classificationId;

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

      res.send({
        state: 'success',
        message: '',
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
