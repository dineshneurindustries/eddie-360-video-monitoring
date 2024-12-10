const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const assessmentValidation = require('../../validations/assessment.validation');
const assessmentController = require('../../controllers/assessment.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageAssessment'), validate(assessmentValidation.createAssessment), assessmentController.createAssessment)
  .get(auth('manageAssessment'), validate(assessmentValidation.getAssessments), assessmentController.getAssessments);

router
  .route('/:assessmentId')
  .get(auth('manageAssessment'), validate(assessmentValidation.getAssessment), assessmentController.getAssessment)
  .delete(auth('manageAssessment'), validate(assessmentValidation.deleteAssessment), assessmentController.deleteAssessment);

router
  .route('/:moduleId')
  .patch(auth('manageAssessment'), validate(assessmentValidation.updateAssessment), assessmentController.updateAssessment)
  .post(auth('manageAssessment'), validate(assessmentValidation.createAssessment), assessmentController.createAssessment);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Assessment
 *   description: Assessment management and retrieval
 */

/**
 * @swagger
 * /assessments:
 *   get:
 *     summary: Get all assessments questions & options
 *     description:  all authorized users can retrieve all assessments question & option.
 *     tags:
 *       - Assessment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               assessments:
 *                 - _id: assessmentId1
 *                   question: "Sample Question 1"
 *                   options:
 *                     - text: "Option 1"
 *                       isCorrect: true
 *                     - text: "Option 2"
 *                       isCorrect: false
 *                 - _id: assessmentId2
 *                   question: "Sample Question 2"
 *                   options:
 *                     - text: "Option A"
 *                       isCorrect: true
 *                     - text: "Option B"
 *                       isCorrect: false
 *       '401':
 *          $ref: '#/components/responses/Unauthorized'
 *       '403':
 *          $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /assessments/{assessmentId}:
 *   get:
 *     summary: Retrieve an assessment question with options by ID
 *     description: Retrieve specific assessment questions by providing the assessment ObjectId
 *     tags: [Assessment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assessmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Assessment ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Assessment'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete an assessment by ID
 *     description: Delete specific assessment by providing the assessment ObjectId
 *     tags: [Assessment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assessmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Assessment ID
 *     responses:
 *       "204":
 *         description: No Content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /assessments/{moduleId}:
 *   post:
 *     summary: Create an assessment question with option
 *     description: Only teachers can create assessments.
 *     tags: [Assessment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: moduleId
 *         schema:
 *           type: string
 *         description: The ID of the session to which the assessments belong
 *         required: true
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                     type: array
 *                     items:
 *                         type: object
 *                         properties:
 *                             question:
 *                                 type: string
 *                             options:
 *                                 type: array
 *                                 items:
 *                                     type: object
 *                                     properties:
 *                                         text:
 *                                             type: string
 *                                             description: The option text
 *                                         isCorrect:
 *                                             type: boolean
 *                                             description: Indicates if the option is correct
 *                     description: The array of assessments
 *                 example:
 *                     - question: "What is the capital of France?"
 *                       options:
 *                           - text: "Berlin"
 *                             isCorrect: false
 *                           - text: "Paris"
 *                             isCorrect: true
 *                           - text: "Madrid"
 *                             isCorrect: false
 *                           - text: "Rome"
 *                             isCorrect: false
 *                     - question: "Another question?"
 *                       options:
 *                           - text: "Option 1"
 *                             isCorrect: true
 *                           - text: "Option 2"
 *                             isCorrect: false
 *                           - text: "Option 3"
 *                             isCorrect: false
 *                           - text: "Option 4"
 *                             isCorrect: false
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assessment'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   patch:
 *     summary: Update a specific assessment by ID
 *     description: Update a specific assessment by providing its ID and new values for the question or options.
 *     tags:
 *       - Assessment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: moduleId
 *         schema:
 *           type: string
 *         description: The ID of the module to which the assessment belongs
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assessmentId:
 *                 type: string
 *                 description: The ID of the assessment to be updated
 *               question:
 *                 type: string
 *                 description: The updated question
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                       description: The option text
 *                     isCorrect:
 *                       type: boolean
 *                       description: Indicates if the option is correct
 *             required:
 *               - assessmentId
 *               - question
 *           examples:
 *             example1:
 *               value:
 *                 assessmentId: "6607124ca93d3a47a53ec230"
 *                 question: "Updated Question"
 *                 options:
 *                   - text: "Updated Option 1"
 *                     isCorrect: true
 *                   - text: "Updated Option 2"
 *                     isCorrect: false
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assessment'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
