const _ = require('lodash');
const settings = require('../../config/settings');
const ClassificationModel = require('../models').Classification;
const { getUserBasicInfo } = require('../utils/dataAsync');
const moment = require('moment');
const { read } = require('../utils/cacheUtil');

class Classification {
  constructor() {
    // super()
  }

  async getAll(req, res, next) {
    try {
      let current = req.query.current || 1;
      let pageSize = req.query.pageSize || 10;
      let keyword = req.query.keyword || '';

      let query = { available: true };
      if (keyword) {
        query.title = { $regex: keyword, $options: 'i' };
      }

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
        message: '获取classifications失败',
      });
    }
  }

  async getTodayRecommend(req, res, next) {
    try {
      let query = { available: true };

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
        { $limit: 5 },
        { $skip: 0 },
        { $sort: { score: -1 } },
      ]);

      res.send({
        state: 'success',
        data: classifications,
      });
    } catch (err) {
      res.status(500);
      res.send({
        state: 'error',
        stack: err && err.stack,
        message: '获取classifications失败',
      });
    }
  }

  async getAllByUserId(req, res, next) {
    try {
      let userId = req.query.userId;
      let current = req.query.current || 1;
      let pageSize = req.query.pageSize || 10;

      if (!userId || userId == 'undefined') {
        res.send({
          state: 'error',
          message: 'userId 不能为空',
        });
        return;
      }

      const classifications = await ClassificationModel.find({ userId }, {
        'userId': 1,
        'title': 1,
        'contents': 1,
        'published': 1,
        'available': 1,
        'free': 1,
        'price': 1,
        'score': 1,
        'readTimes': 1,
        'shareTimes': 1,
      }).sort({
        createdAt: -1,
      }).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize)).populate([
        {
          path: 'userId',
          select: 'username avatar accountName phoneNum',
        }]).exec();

      const totalItems = await ClassificationModel.countDocuments();

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
        message: '获取个人classifications失败',
      });
    }
  }

  async addOne(req, res, next) {
    const userId = req.body.userId;
    const title = req.body.title;
    const contents = req.body.contents;
    const free = req.body.free;
    const price = req.body.price;

    if (!userId) {
      res.status(500);
      res.send({
        state: 'error',
        message: 'userId 不能为空',
      });
      return;
    }
    try {
      const classificationObj = {
        userId,
        title,
        contents,
        free,
        price,
      };

      const newClassification = new ClassificationModel(classificationObj);
      await newClassification.save();
      res.send({
        state: 'success',
        id: newClassification._id,
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

  async takeOff(req, res, next) {
    const _id = req.body.id;

    if (!_id) {
      res.status(500);
      res.send({
        state: 'error',
        message: 'id 不能为空',
      });
      return;
    }

    try {
      const classification = {
        published: false,
      };
      await ClassificationModel.findOneAndUpdate({ _id }, classification, { upsert: true });
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

module.exports = new Classification();
