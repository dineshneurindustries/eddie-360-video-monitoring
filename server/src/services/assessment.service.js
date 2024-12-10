const httpStatus = require('http-status');
const { Assessment, Module } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a assessment
 * @param {Object} assessmentBody
 * @param {ObjectId} teacherId
 * @returns {Promise<Assessment>}
 */
const createAssessment = async (assessmentBodies, moduleId) => {

  const module = await Module.findById(moduleId);
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }

  if (typeof module.totalMcq !== 'number') {
    module.totalMcq = 0;
  }

  const assessments = await Promise.all(
    assessmentBodies.map(async (assessmentBody) => {
      const assessment = new Assessment({
        ...assessmentBody,
        moduleId,
      });
      return assessment.save();
    })
  );

  module.totalMcq += assessments.length;
  await module.save();

  return assessments;
};



/**
 * Query for assessment
 * @returns {Promise<QueryResult>}
 */
const queryAssessment = async () => {
  const assessments = await Assessment.find()
    .populate({
      path: 'moduleId',
      select: 'title',
    })
    .exec();

  return assessments;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<Assessment>}
 */
const getAssessmentById = async (id) => {
  return Assessment.findById(id);
};

/**
 * Update user by id
 * @param {ObjectId} assessmentId
 * @param {Object} updateBody
 * @returns {Promise<Assessment>}
 */
/**
 * Update assessments by IDs
 * @param {Array} assessmentIds
 * @param {Array} updateBodies
 * @returns {Promise<Array>}
 */
const updateAssessmentById = async (moduleId, updateBody) => {
  if (!updateBody || typeof updateBody !== 'object') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid update body');
  }

  const { assessmentId, question, options } = updateBody;

  if (!assessmentId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Assessment ID is required for updating');
  }

  const assessment = await Assessment.findById(assessmentId);
  if (!assessment) {
    throw new ApiError(httpStatus.NOT_FOUND, `Assessment with ID ${assessmentId} not found`);
  }

  if (question !== undefined) {
    assessment.question = question;
  }
  if (options !== undefined) {
    assessment.options = options;
  }
  if (moduleId !== undefined) {
    assessment.moduleId = moduleId;
  }

  await assessment.save();

  return assessment;
};

/**
 * Delete user by id
 * @param {ObjectId} assessmentId
 * @returns {Promise<Assessment>}
 */
const deleteAssessmentById = async (assessmentId) => {
  const assessment = await Assessment.findById(assessmentId);
  if (!assessment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Assessment not found');
  }

  await Assessment.findByIdAndDelete(assessmentId);

  const module = await Module.findById(assessment.moduleId);
  if (module) {
    if (typeof module.totalMcq !== 'number') {
      module.totalMcq = 0;
    }

    module.totalMcq = Math.max(0, module.totalMcq - 1);
    await module.save();
  }
};



module.exports = {
  createAssessment,
  queryAssessment,
  getAssessmentById,
  updateAssessmentById,
  deleteAssessmentById,
};
