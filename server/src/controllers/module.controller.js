const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { moduleService } = require('../services');

const createModule = catchAsync(async (req, res) => {
  const module = await moduleService.createModule(req.body);
  res.status(httpStatus.CREATED).send(module);
});

const getModules = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await moduleService.queryModules(filter, options);
  res.send(result);
});

const getModule = catchAsync(async (req, res) => {
  const module = await moduleService.getModuleById(req.params.moduleId);
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }
  res.send(module);
});

const updateModule = catchAsync(async (req, res) => {
  const module = await moduleService.updateModuleById(req.params.moduleId, req.body);
  res.send(module);
});

const deleteModule = catchAsync(async (req, res) => {
  await moduleService.deleteModuleById(req.params.moduleId);
  res.status(httpStatus.NO_CONTENT).send();
});

const addChapter = catchAsync(async (req, res) => {
  const module = await moduleService.addChapterToModule(req.params.moduleId, req.body);
  res.status(httpStatus.CREATED).send(module);
});

const updateChapter = catchAsync(async (req, res) => {
  const module = await moduleService.updateChapterInModule(req.params.moduleId, req.params.chapterId, req.body);
  res.send(module);
});

const deleteChapter = catchAsync(async (req, res) => {
  const module = await moduleService.deleteChapterFromModule(req.params.moduleId, req.params.chapterId);
  res.status(httpStatus.NO_CONTENT).send(module);
});

module.exports = {
  createModule,
  getModules,
  getModule,
  updateModule,
  deleteModule,
  addChapter,
  updateChapter,
  deleteChapter,
};
