const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const sessionValidation = require('../../validations/session.validation');
const sessionController = require('../../controllers/session.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageSessions'), validate(sessionValidation.createSession), sessionController.createSession)
  .get(auth('getSessions'), validate(sessionValidation.getSessions), sessionController.getSessions);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Session management and retrieval for training sessions
 */

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Create a new session
 *     description: Creates a new session with associated assessments and user responses.
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     operationId: createSession
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Session'
 *     responses:
 *       "201":
 *         description: Created
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get a list of sessions
 *     description: Fetches a list of sessions with optional filtering, pagination, and sorting.
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     operationId: getSessions
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter sessions by user ID.
 *         example: "60d21b4667d0d8992e610c85"
 *       - in: query
 *         name: moduleId
 *         schema:
 *           type: string
 *         description: Filter sessions by module ID.
 *         example: "60d21b4667d0d8992e610c84"
 *       - in: query
 *         name: timeRange
 *         schema:
 *           type: string
 *           enum: [today, weekly, monthly, all-time]
 *         description: Filter sessions based on time range.
 *         example: "today"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: The maximum number of sessions to return.
 *         example: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: The page number for pagination.
 *         example: 1
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: The field to sort by.
 *         example: "sessionTimeAndDate:desc"
 *     responses:
 *       "200":
 *         description: List of sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Session'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
