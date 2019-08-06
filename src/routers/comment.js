const express = require('express');
const router = express.Router();
const {
  Comment: Comment,
} = require('../controllers');

/**
 * @swagger
 * definitions:
 *   CommentCreateDTO:
 *     properties:
 *       userId:
 *         type: string
 *       classificationId:
 *         type: string
 *       content:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   CommentUpdateDTO:
 *     properties:
 *       userId:
 *         type: string
 *       classificationId:
 *         type: string
 *       attitude:
 *         type: string
 */

/**
 * @swagger
 * /comment/addContent:
 *   post:
 *     tags:
 *       - Comments
 *     description: Creates a new comment
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: comment
 *         description: Comment object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/CommentCreateDTO'
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.post('/addContent', Comment.addContent);


/**
 * @swagger
 * /comment/addAttitude:
 *   post:
 *     tags:
 *       - Comments
 *     description: Creates a new comment
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: comment
 *         description: Comment object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/CommentUpdateDTO'
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.post('/addAttitude', Comment.addAttitude);


module.exports = router;
