const express = require('express');
const router = express.Router();
const {
  User,
} = require('../controllers');


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


module.exports = router;
