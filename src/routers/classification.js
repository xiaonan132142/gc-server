const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
var upload = multer({ dest: '../public' });

const {
  Classification: Classification,
} = require('../controllers');

/**
 * @swagger
 * definitions:
 *   Classification:
 *     properties:
 *       id:
 *         type: string
 *       userId:
 *         type: string
 *       username:
 *         type: string
 *       avatar:
 *         type: string
 *       accountName:
 *         type: string
 *       title:
 *         type: string
 *       contents:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *            desc:
 *              type: string
 *            image:
 *              type: string
 *            sort:
 *              type: string
 *       published:
 *         type: boolean
 *       available:
 *         type: boolean
 *       free:
 *         type: boolean
 *       price:
 *         type: integer
 *       score:
 *         type: integer
 */

/**
 * @swagger
 * definitions:
 *   ClassificationCreateDTO:
 *     properties:
 *       userId:
 *         type: string
 *       title:
 *         type: string
 *       contents:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *            desc:
 *              type: string
 *            image:
 *              type: string
 *            sort:
 *              type: string
 *       free:
 *         type: boolean
 *       price:
 *         type: integer
 */

/**
 * @swagger
 * definitions:
 *   ClassificationUpdateDTO:
 *     properties:
 *       id:
 *         type: string
 */

/**
 * @swagger
 * /classification/getAll:
 *   get:
 *     tags:
 *       - Classifications
 *     description: Returns classifications list
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: keyword
 *         in: query
 *         required: true
 *         type: string
 *       - name: readerId
 *         in: query
 *         required: false
 *         type: string
 *       - name: current
 *         in: query
 *         type: integer
 *       - name: pageSize
 *         in: query
 *         type: integer
 *     responses:
 *       200:
 *         description: An Object contains array of awards
 *         schema:
 *           $ref: '#/definitions/Classification'
 */
router.get('/getAll', Classification.getAll);


/**
 * @swagger
 * /classification/getTodayRecommend:
 *   get:
 *     tags:
 *       - Classifications
 *     description: Returns classifications list
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: readerId
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: An Object contains array of awards
 *         schema:
 *           $ref: '#/definitions/Classification'
 */
router.get('/getTodayRecommend', Classification.getTodayRecommend);

/**
 * @swagger
 * /classification/getPublishedByUser:
 *   get:
 *     tags:
 *       - Classifications
 *     description: Returns one classifications list
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         type: string
 *       - name: current
 *         in: query
 *         type: integer
 *       - name: pageSize
 *         in: query
 *         type: integer
 *     responses:
 *       200:
 *         description: An Object contains array of classifications
 *         schema:
 *           $ref: '#/definitions/Classification'
 */
router.get('/getPublishedByUser', Classification.getAllByUserId);


/**
 * @swagger
 * /classification/getById:
 *   get:
 *     tags:
 *       - Classifications
 *     description: Returns one classification
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: An Object classification
 *         schema:
 *           $ref: '#/definitions/Classification'
 */
router.get('/getById', Classification.getById);

/**
 * @swagger
 * /classification/publish:
 *   post:
 *     tags:
 *       - Classifications
 *     description: Publish a Classification
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: classification
 *         description: Classification object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/ClassificationCreateDTO'
 *     responses:
 *       200:
 *         description: Successfully updated
 */
router.post('/publish', Classification.addOne);

/**
 * @swagger
 * /classification/takeOff:
 *   post:
 *     tags:
 *       - Classifications
 *     description: Update a Classification as takeOff
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Classification id
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/ClassificationUpdateDTO'
 *     responses:
 *       200:
 *         description: Successfully updated
 */
router.post('/takeOff', Classification.takeOff);

router.post('/upload', upload.any(), function(req, res, next) {
  if (req.files && req.files.length > 0) {
    console.log(req.body, 'Body');
    console.log(req.files, 'files');

    const img = req.files[0];
    const newImgName = new Date().getTime() + path.extname(img.originalname);

    fs.rename(img.path, newImgName, function(err) {
      if (err) {
        res.status(500);
        res.send({
          state: 'error',
          stack: err && err.stack,
        });
        return;
      }
    });


    res.send({ state: 'success', filePath: path.join('img', newImgName) });
  } else {
    res.send({ state: 'error' });
  }

});

module.exports = router;
