const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const moduleValidation = require('../../validations/module.validation');
const moduleController = require('../../controllers/module.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageModules'), validate(moduleValidation.createModule), moduleController.createModule)
  .get(auth('getModules'), validate(moduleValidation.getModules), moduleController.getModules);

router
  .route('/:moduleId')
  .get(auth('getModules'), validate(moduleValidation.getModule), moduleController.getModule)
  .patch(auth('manageModules'), validate(moduleValidation.updateModule), moduleController.updateModule)
  .delete(auth('manageModules'), validate(moduleValidation.deleteModule), moduleController.deleteModule);

router
  .route('/:moduleId/chapters')
  .post(auth('manageModules'), validate(moduleValidation.addChapter), moduleController.addChapter);

router
  .route('/:moduleId/chapters/:chapterId')
  .patch(auth('manageModules'), validate(moduleValidation.updateChapter), moduleController.updateChapter)
  .delete(auth('manageModules'), validate(moduleValidation.deleteChapter), moduleController.deleteChapter);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Modules
 *   description: Module management and retrieval for Fire Safety VR Training
 */

/**
 * @swagger
 * /modules:
 *   post:
 *     summary: Create a new module
 *     description: Creates a new training module with chapters.
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     operationId: createModule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - videoId
 *               - duration
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the module.
 *                 example: "Fire Safety Training"
 *               description:
 *                 type: string
 *                 description: Description of the module.
 *                 example: "This module covers essential fire safety protocols and training for emergency response."
 *               videoId:
 *                 type: string
 *                 description: Video ID associated with the module.
 *                 example: "fs-12345"
 *               duration:
 *                 type: integer
 *                 description: Duration of the module in seconds.
 *                 example: 3000
 *               chapters:
 *                 type: array
 *                 description: Array of chapters within the module.
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Introduction to Fire Safety"
 *                     startTime:
 *                       type: integer
 *                       example: 0
 *                     endTime:
 *                       type: integer
 *                       example: 600
 *                     order:
 *                       type: integer
 *                       example: 1
 *               isActive:
 *                 type: boolean
 *                 description: Indicates if the module is active.
 *                 example: true
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all Fire Safety training modules
 *     description: Only admins can retrieve all fire safety training modules.
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Module name (e.g., Fire Safety)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Module type (e.g., practical, theory)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort modules by field (e.g., name:asc, description:desc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of modules to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 1
 *         description: Page number for pagination
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Module'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /modules/{moduleId}:
 *   get:
 *     summary: Get a specific Fire Safety training module
 *     description: Retrieve a specific fire safety training module by its ID.
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Fire Safety training module ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Module'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update an existing module
 *     description: Updates the details of an existing module.
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     operationId: updateModule
 *     parameters:
 *       - name: moduleId
 *         in: path
 *         required: true
 *         description: The ID of the module to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the module.
 *                 example: "Updated Fire Safety Training"
 *               description:
 *                 type: string
 *                 description: Description of the module.
 *                 example: "This updated module covers advanced fire safety protocols."
 *               videoId:
 *                 type: string
 *                 description: Video ID associated with the module.
 *                 example: "fs-12345-updated"
 *               duration:
 *                 type: integer
 *                 description: Duration of the module in seconds.
 *                 example: 3500
 *               chapters:
 *                 type: array
 *                 description: Array of chapters within the module.
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Fire Extinguisher Operation"
 *                     startTime:
 *                       type: integer
 *                       example: 600
 *                     endTime:
 *                       type: integer
 *                       example: 1200
 *                     order:
 *                       type: integer
 *                       example: 1
 *               isActive:
 *                 type: boolean
 *                 description: Indicates if the module is active.
 *                 example: true
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Module'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a Fire Safety training module
 *     description: Delete a fire safety training module by its ID.
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Fire Safety module ID
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /modules/{moduleId}/chapters:
 *   post:
 *     summary: Add a chapter to a Fire Safety module
 *     description: Only admins can add chapters to fire safety training modules.
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               startTime:
 *                 type: integer
 *               endTime:
 *                 type: integer
 *               order:
 *                 type: integer
 *             example:
 *               title: "Updated Fire Safety Protocols"
 *               startTime: 0
 *               endTime: 600
 *               order: 1
 *     responses:
 *       "201":
 *         description: Created
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /modules/{moduleId}/chapters/{chapterId}:
 *   patch:
 *     summary: Update a chapter in the Fire Safety module
 *     description: Update a chapter within a Fire Safety module.
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *       - in: path
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: string
 *         description: Chapter ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               startTime:
 *                 type: integer
 *               endTime:
 *                 type: integer
 *               order:
 *                 type: integer
 *             example:
 *               title: "Updated Fire Safety Protocols"
 *               startTime: 0
 *               endTime: 600
 *               order: 1
 *     responses:
 *       "200":
 *         description: OK
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a chapter from a Fire Safety module
 *     description: Delete a chapter within the fire safety module by its ID.
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *       - in: path
 *         name: chapterId
 *         required: true
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
