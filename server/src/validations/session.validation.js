const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSession = {
  body: Joi.alternatives().try(
    Joi.object().keys({
      userId: Joi.string().custom(objectId).required(),
      sessionTimeAndDate: Joi.date().required(),
      sessionStartedTime: Joi.date().optional(),
      sessionEndedTime: Joi.date().optional(),
      sessionDuration: Joi.number().optional(),
      adminId: Joi.string().custom(objectId).optional(),
      moduleId: Joi.string().custom(objectId).required(),
      moduleCompletionRate: Joi.number().min(0).max(100).default(0),
      moduleCompletionTimestamp: Joi.date().optional(),
      questionResponse: Joi.array().items(
        Joi.object().keys({
          assessmentId: Joi.string().custom(objectId).required(),
          responseTime: Joi.number().min(0).required(),
          selectedOption: Joi.string().trim().optional(),
        })
      )
    }),
    Joi.array().items(
      Joi.object().keys({
        userId: Joi.string().custom(objectId).required(),
        sessionTimeAndDate: Joi.date().required(),
        sessionStartedTime: Joi.date().optional(),
        sessionEndedTime: Joi.date().optional(),
        sessionDuration: Joi.number().optional(),
        adminId: Joi.string().custom(objectId).optional(),
        moduleId: Joi.string().custom(objectId).required(),
        moduleCompletionRate: Joi.number().min(0).max(100).default(0),
        moduleCompletionTimestamp: Joi.date().optional(),
        questionResponse: Joi.array().items(
          Joi.object().keys({
            assessmentId: Joi.string().custom(objectId).required(),
            responseTime: Joi.number().min(0).required(),
            selectedOption: Joi.string().trim().optional(),
          })
        )
      })
    )
  ),
};

const getSessions = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId).optional(),
    moduleId: Joi.string().custom(objectId).optional(),
    timeRange: Joi.string().valid('today', 'weekly', 'monthly', 'all-time').default('today'),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    sortBy: Joi.string(),
  }),
};

const getSession = {
  params: Joi.object().keys({
    sessionId: Joi.string().custom(objectId).required(),
  }),
};

const updateSession = {
  params: Joi.object().keys({
    sessionId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      sessionTimeAndDate: Joi.date().optional(),
      sessionStartedTime: Joi.date().optional(),
      sessionEndedTime: Joi.date().optional(),
      sessionDuration: Joi.number().optional(),
      moduleCompletionRate: Joi.number().min(0).max(100).optional(),
      moduleCompletionTimestamp: Joi.date().optional(),
      questionResponse: Joi.array().items(
        Joi.object().keys({
          assessmentId: Joi.string().custom(objectId).optional(),
          responseTime: Joi.number().min(0).optional(),
          selectedOption: Joi.string().trim().optional(),
        })
      )
    })
    .min(1),
};

const deleteSession = {
  params: Joi.object().keys({
    sessionId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
};
