const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createModule = {
  body: Joi.object().keys({
    title: Joi.string().required().trim(),
    description: Joi.string().trim(),
    videoId: Joi.string().required(),
    duration: Joi.number().required(),
    chapters: Joi.array().items(
      Joi.object().keys({
        title: Joi.string().required().trim(),
        startTime: Joi.number().required(),
        endTime: Joi.number().required(),
        order: Joi.number().required(),
      })
    ),
    isActive: Joi.boolean().default(true),
  }),
};

const getModules = {
  query: Joi.object().keys({
    title: Joi.string().trim(),
    videoId: Joi.string().trim(),
    isActive: Joi.boolean(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getModule = {
  params: Joi.object().keys({
    moduleId: Joi.string().custom(objectId).required(),
  }),
};

const updateModule = {
  params: Joi.object().keys({
    moduleId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().trim(),
      description: Joi.string().trim(),
      videoId: Joi.string().trim(),
      duration: Joi.number(),
      chapters: Joi.array().items(
        Joi.object().keys({
          title: Joi.string().trim(),
          startTime: Joi.number(),
          endTime: Joi.number(),
          order: Joi.number(),
        })
      ),
      isActive: Joi.boolean(),
    })
    .min(1),
};

const updateChapter = {
  params: Joi.object().keys({
    moduleId: Joi.string().custom(objectId).required(),
    chapterId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().trim(),
      startTime: Joi.number(),
      endTime: Joi.number(),
      order: Joi.number(),
    })
    .min(1),
};

const deleteModule = {
  params: Joi.object().keys({
    moduleId: Joi.string().custom(objectId).required(),
  }),
};

const deleteChapter = {
  params: Joi.object().keys({
    moduleId: Joi.string().custom(objectId).required(),
    chapterId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createModule,
  getModules,
  getModule,
  updateModule,
  updateChapter,
  deleteModule,
  deleteChapter,
};
