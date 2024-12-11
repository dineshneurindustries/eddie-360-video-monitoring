const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { sessionService } = require('../services');

const createSession = catchAsync(async (req, res) => {
  const session = await sessionService.createSession(req.body);
  res.status(httpStatus.CREATED).send(session);
});

const getSessions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['moduleId', 'userId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { timeRange = 'today' } = req.query;

  const result = await sessionService.querySessions(filter, options, timeRange);
  res.send(result);
});

const updateSession = catchAsync(async (req, res) => {
  const session = await sessionService.updateSessionById(req.params.sessionId, req.body);
  res.send(session);
});

const deleteSession = catchAsync(async (req, res) => {
  await sessionService.deleteSessionById(req.params.sessionId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSession,
  getSessions,
  updateSession,
  deleteSession,
};
