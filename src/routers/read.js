const express = require('express');
const router = express.Router();
const {
  Read: Read,
} = require('../controllers');

/**
 * @swagger
 * definitions:
 *   Read:
 *     properties:
 *       _id:
 *         type: string
 *       userId:
 *         type: string
 *       classificationId:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   ReadCreateDTO:
 *     properties:
 *       userId:
 *         type: string
 *       classificationId:
 *         type: string
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
 * /read/add:
 *   post:
 *     tags:
 *       - Reads
 *     description: Publish a read
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: read
 *         description: Read object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/ReadCreateDTO'
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.post('/add', Read.addOne);

module.exports = router;
