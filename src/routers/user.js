const express = require('express');
const router = express.Router();
const {
  User,
} = require('../controllers');

/**
 * @swagger
 * definitions:
 *   Rank:
 *     properties:
 *       _id:
 *         type: string
 *       userId:
 *         type: string
 *       username:
 *         type: string
 *       avatar:
 *         type: string
 *       winTimes:
 *         type: integer
 *       predictTimes:
 *         type: integer
 *       winRatio:
 *         type: integer
 *       winRank:
 *         type: integer
 *       predictRank:
 *         type: integer
 *       awardTimes:
 *         type: integer
 */

/**
 * @swagger
 * definitions:
 *   UserCreateDTO:
 *     properties:
 *       phoneNum:
 *         type: string
 *       predictResult:
 *         type: integer
 *       predictValue:
 *         type: integer
 */

/**
 * @swagger
 * definitions:
 *   Predict:
 *     properties:
 *       userId:
 *         type: string
 *       username:
 *         type: string
 *       avatar:
 *         type: string
 *       date:
 *         type: string
 *       predictResult:
 *         type: integer
 *       actualResult:
 *         type: integer
 *       predictValue:
 *         type: integer
 *       actualValue:
 *         type: integer
 *       isFinished:
 *         type: boolean
 *       isWin:
 *         type: boolean
 *       hasRead:
 *         type: boolean
 */


/**
 * @swagger
 * definitions:
 *   PersonalInfo:
 *     properties:
 *       rank:
 *          $ref: '#/definitions/Rank'
 *       latestPredict:
 *          $ref: '#/definitions/Predict'
 */

/**
 * @swagger
 * /user/add:
 *   post:
 *     tags:
 *       - Users
 *     description: Creates a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: predict
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/UserCreateDTO'
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.post('/add', User.addOne);


/**
 * @swagger
 * /user/personalInfo:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns one rank and latestPredict
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An Object contains one rank and latestPredict
 *         schema:
 *           $ref: '#/definitions/PersonalInfo'
 */
router.get('/personalInfo', User.personalInfo);

module.exports = router;
