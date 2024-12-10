const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAssessment = {
  body: Joi.array()
    .items(
      Joi.object().keys({
        question: Joi.string().required(),
        options: Joi.array()
          .items(
            Joi.object({
              text: Joi.string().required(),
              isCorrect: Joi.boolean().required(),
            })
          )
          .required(),
        createdBy: Joi.string().custom(objectId),
        moduleId: Joi.string().custom(objectId),
      })
    )
    .required(),
};

const getAssessments = {
  query: Joi.object().keys({
    question: Joi.string(),
    options: Joi.array().items(
      Joi.object({
        text: Joi.string(),
        isCorrect: Joi.boolean(),
      })
    ),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAssessment = {
  params: Joi.object().keys({
    assessmentId: Joi.string().custom(objectId),
  }),
};

const updateAssessment = {
  query: Joi.object({
    moduleId: Joi.string().optional().required(),
  }),
  body: Joi.object({
    assessmentId: Joi.string(),
    question: Joi.string().required(),
    options: Joi.array()
      .items(
        Joi.object({
          text: Joi.string().required(),
          isCorrect: Joi.boolean().required(),
        })
      )
      .min(1)
      .required(),
  }).required(),
};

const deleteAssessment = {
  params: Joi.object().keys({
    assessmentId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createAssessment,
  getAssessments,
  getAssessment,
  updateAssessment,
  deleteAssessment,
};
