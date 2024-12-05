const httpStatus = require('http-status');
const { Module } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a module
 * @param {Object} moduleBody
 * @returns {Promise<Module>}
 */
const createModule = async (moduleBody) => {
  // Validate the chapters in the module if provided
  if (moduleBody.chapters && moduleBody.chapters.length) {
    for (let chapter of moduleBody.chapters) {
      const { startTime, endTime } = chapter;
      if (startTime >= endTime) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Start time must be less than end time');
      }
    }
  }

  return Module.create(moduleBody);
};

/**
 * Query for modules
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryModules = async (filter, options) => {
  const modules = await Module.paginate(filter, options);
  return modules;
};

/**
 * Get module by id
 * @param {ObjectId} moduleId
 * @returns {Promise<Module>}
 */
const getModuleById = async (moduleId) => {
  const module = await Module.findById(moduleId);
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }
  return module;
};

/**
 * Update a module by id
 * @param {ObjectId} moduleId
 * @param {Object} updateBody
 * @returns {Promise<Module>}
 */
const updateModuleById = async (moduleId, updateBody) => {
  const module = await getModuleById(moduleId);

  // If chapters are being updated, validate the start and end times
  if (updateBody.chapters) {
    for (let chapter of updateBody.chapters) {
      const { startTime, endTime } = chapter;
      if (startTime >= endTime) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Start time must be less than end time');
      }
    }
  }

  Object.assign(module, updateBody);
  await module.save();
  return module;
};

/**
 * Delete a module by id
 * @param {ObjectId} moduleId
 * @returns {Promise<Module>}
 */
const deleteModuleById = async (moduleId) => {
  const module = await getModuleById(moduleId);
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }
  await module.deleteOne();
  return module;
};

/**
 * Add a chapter to a module
 * @param {ObjectId} moduleId
 * @param {Object} chapterBody
 * @returns {Promise<Module>}
 */
const addChapterToModule = async (moduleId, chapterBody) => {
  const module = await getModuleById(moduleId);

  // Validate chapter data
  const { startTime, endTime } = chapterBody;
  if (startTime >= endTime) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Start time must be less than end time');
  }

  module.chapters.push(chapterBody);
  await module.save();
  return module;
};

/**
 * Update a chapter in a module
 * @param {ObjectId} moduleId
 * @param {ObjectId} chapterId
 * @param {Object} chapterBody
 * @returns {Promise<Module>}
 */
const updateChapterInModule = async (moduleId, chapterId, chapterBody) => {
  const module = await getModuleById(moduleId);
  const chapter = module.chapters.id(chapterId);

  if (!chapter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chapter not found');
  }

  // Validate chapter data
  const { startTime, endTime } = chapterBody;
  if (startTime >= endTime) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Start time must be less than end time');
  }

  Object.assign(chapter, chapterBody);
  await module.save();
  return module;
};

/**
 * Delete a chapter from a module
 * @param {ObjectId} moduleId
 * @param {ObjectId} chapterId
 * @returns {Promise<Module>}
 */
const deleteChapterFromModule = async (moduleId, chapterId) => {
  const module = await getModuleById(moduleId);

  const chapter = module.chapters.id(chapterId);

  if (!chapter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chapter not found');
  }

  module.chapters.pull(chapterId);

  await module.save();

  return module;
};

module.exports = {
  createModule,
  queryModules,
  getModuleById,
  updateModuleById,
  deleteModuleById,
  addChapterToModule,
  updateChapterInModule,
  deleteChapterFromModule,
};
