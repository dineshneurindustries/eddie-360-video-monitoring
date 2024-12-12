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
 *   /sessions:
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
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Session'
 *           example:
 *             - userId: "6759a973797fc8102b5cfa8a"
 *               sessionTimeAndDate: "2024-12-05T08:30:00.000Z"
 *               sessionStartedTime: "2024-12-05T08:35:00.000Z"
 *               sessionEndedTime: "2024-12-05T09:00:00.000Z"
 *               sessionDuration: 1500
 *               adminId: "674db721a03283639eb31e09"
 *               moduleId: "67583ab2543d4157748bf11a"
 *               moduleCompletionRate: 75
 *               moduleCompletionTimestamp: "2024-12-05T08:55:00.000Z"
 *               questionResponse:
 *                 - assessmentId: "6758503dc74ead8f40639825"
 *                   selectedOption: "Option 1"
 *                   responseTime: 30
 *                 - assessmentId: "6758507b132f2722bdb1e809"
 *                   selectedOption: "Berlin"
 *                   responseTime: 30
 *             - userId: "6759a973797fc8102b5cfa8a"
 *               sessionTimeAndDate: "2024-12-05T08:30:00.000Z"
 *               sessionStartedTime: "2024-12-05T08:35:00.000Z"
 *               sessionEndedTime: "2024-12-05T09:00:00.000Z"
 *               sessionDuration: 1500
 *               adminId: "674db721a03283639eb31e09"
 *               moduleId: "67583ab2543d4157748bf11a"
 *               moduleCompletionRate: 75
 *               moduleCompletionTimestamp: "2024-12-05T08:55:00.000Z"
 *               questionResponse:
 *                 - assessmentId: "6758503dc74ead8f40639825"
 *                   selectedOption: "Option 1"
 *                   responseTime: 30
 *                 - assessmentId: "6758507b132f2722bdb1e809"
 *                   selectedOption: "Paris"
 *                   responseTime: 30
 *     responses:
 *       "201":
 *         description: Created
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *       $ref: '#/components/responses/Forbidden'
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
