const _ = require('lodash');
const settings = require('../../config/settings');
const CommentModel = require('../models').Comment;
const ClassificationModel = require('../models').Classification;

class Comment {
  constructor() {
    // super()
  }

  async addContent(req, res, next) {

    const userId = req.body.userId;
    let classificationId = req.body.classificationId;
    const content = req.body.content;

    if (!userId) {
      res.status(500);
      res.send({
        state: 'error',
        message: 'userId 不能为空',
      });
      return;
    }

    if (!classificationId) {
      res.status(500);
      res.send({
        state: 'error',
        message: 'classificationId 不能为空',
      });
      return;
    }

    if (!content) {
      res.status(500);
      res.send({
        state: 'error',
        message: 'content 不能为空',
      });
      return;
    }

    try {
      let comment = await CommentModel.findOne({ userId, classificationId });
      if (comment) {
        let contents_ = comment.contents.concat({
          desc: content,
        });
        await CommentModel.findOneAndUpdate({ userId, classificationId }, { contents: contents_ }, { upsert: true });
      } else {
        const commentObj = {
          userId,
          classificationId,
          contents: [{ desc: content }],
        };
        comment = new CommentModel(commentObj);
        await comment.save();
      }

      await ClassificationModel.findOneAndUpdate({ _id: classificationId }, { $inc: { commentCount: 1 } }, { upsert: true });

      res.send({
        state: 'success',
        id: comment._id,
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

  async addAttitude(req, res, next) {

    const userId = req.body.userId;
    let classificationId = req.body.classificationId;
    const attitude = req.body.attitude;

    if (!userId) {
      res.status(500);
      res.send({
        state: 'error',
        message: 'userId 不能为空',
      });
      return;
    }

    if (!classificationId) {
      res.status(500);
      res.send({
        state: 'error',
        message: 'classificationId 不能为空',
      });
      return;
    }

    if (!['1', '-1'].includes(attitude)) {
      res.status(500);
      res.send({
        state: 'error',
        message: 'attitude 不能是1或-1以外的值',
      });
      return;
    }

    try {
      await CommentModel.findOneAndUpdate({ userId, classificationId }, { attitude }, { upsert: true });
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

module.exports = new Comment();
