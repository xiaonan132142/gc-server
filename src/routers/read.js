const express = require('express');
const router = express.Router();
const {
  Read: Read,
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
 *   AllRank:
 *     properties:
 *       active:
 *          $ref: '#/definitions/Rank'
 */

/**
 * @swagger
 * /read/getAllByUserId:
 *   get:
 *     tags:
 *       - Reads
 *     description: Returns all reads by user
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
 *         description: An Object contains all read by user
 *         schema:
 *           $ref: '#/definitions/Read'
 */
router.get('/getAllByUserId', Read.getAllByUserId);


/**
 * @swagger
 * /rank/personal:
 *   get:
 *     tags:
 *       - Ranks
 *     description: Returns one statistics
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An Object contains one statistics
 *         schema:
 *           $ref: '#/definitions/Rank'
 */
router.get('/add', Read.addOne);

module.exports = router;
