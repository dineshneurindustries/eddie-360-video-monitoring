const httpStatus = require('http-status');
const { Session, Assessment, Module } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a session
 * @param {Object|Array} sessionBody - Single session object or an array of session objects
 * @returns {Promise<Session|Session[]>} - Returns created session(s)
 */
const createSession = async (sessionBody) => {
  const processSession = async (session) => {
    // Validate session duration
    if (
      session.sessionStartedTime &&
      session.sessionEndedTime &&
      new Date(session.sessionStartedTime) >= new Date(session.sessionEndedTime)
    ) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Session start time must be before end time');
    }

    // Calculate session duration
    if (session.sessionStartedTime && session.sessionEndedTime) {
      const startTime = new Date(session.sessionStartedTime);
      const endTime = new Date(session.sessionEndedTime);
      session.sessionDuration = (endTime - startTime) / 1000; // in seconds
    }

    // Fetch module details
    const module = await Module.findById(session.moduleId);
    if (!module) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
    }

    // Initialize assessment result variables
    let totalScore = 0;
    const maxScore = module.totalMcq;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    const totalQuestions = session.questionResponse.length;

    // Process each question response
    for (const question of session.questionResponse) {
      const assessment = await Assessment.findById(question.assessmentId);
      if (!assessment) {
        throw new ApiError(httpStatus.NOT_FOUND, `Assessment with ID ${question.assessmentId} not found`);
      }

      // Find the correct option in the assessment
      const correctOption = assessment.options.find((option) => option.isCorrect);

      // Compare user's selected option with the correct option
      if (question.selectedOption && correctOption && question.selectedOption === correctOption.text) {
        totalScore++;
        correctAnswers++;
      } else {
        incorrectAnswers++;
      }
    }

    // Calculate percentage score
    const percentageScore = ((totalScore / maxScore) * 100).toFixed(2);

    // Determine pass/fail status (assuming a passing threshold of 50%)
    const passFailStatus = percentageScore >= 50 ? 'Pass' : 'Fail';

    // Add assessment results to the session
    session.sessionTimeAndDate = new Date();
    session.assessmentResults = {
      totalScore,
      maxScore,
      percentageScore,
      passFailStatus,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
    };

    // Save the session
    return Session.create(session);
  };

  if (Array.isArray(sessionBody)) {
    // Handle multiple sessions
    const sessions = await Promise.all(sessionBody.map(processSession));
    return sessions;
  } else {
    // Handle a single session
    return processSession(sessionBody);
  }
};

/**
 * Query for sessions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySessions = async (filter, options, timeRange) => {
  const currentDate = new Date();
  let startDate = null, endDate = null;

  switch (timeRange) {
    case 'weekly':
      startDate = new Date();
      startDate.setDate(currentDate.getDate() - 7);
      break;

    case 'monthly':
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      break;

    case 'all-time':
      startDate = null;
      endDate = null;
      break;

    case 'today':
    default:
      startDate = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate()));
      endDate = new Date(startDate);
      endDate.setUTCDate(startDate.getUTCDate() + 1);
      break;
  }

  if (startDate || endDate) {
    const dateQuery = {};
    if (startDate) dateQuery.$gte = startDate;
    if (endDate) dateQuery.$lt = endDate;

    const sessionsInRange = await Session.find({ sessionStartedTime: dateQuery });

    // Apply the date filter to the main query
    filter.sessionStartedTime = dateQuery;
  }

  // Define populate fields
  const populateFields = [
    'userId',
    'adminId',
    'moduleId',
  ];

  options.populate = populateFields.join(',');

  const sessions = await Session.paginate(filter, options);

  return sessions;
};



/**
 * Get session by id
 * @param {ObjectId} sessionId
 * @returns {Promise<Session>}
 */
const getSessionById = async (sessionId) => {
  const session = await Session.findById(sessionId);
  if (!session) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Session not found');
  }
  return session;
};

/**
 * Update a session by id
 * @param {ObjectId} sessionId
 * @param {Object} updateBody
 * @returns {Promise<Session>}
 */
const updateSessionById = async (sessionId, updateBody) => {
  const session = await getSessionById(sessionId);

  // Validate session duration if any time fields are being updated
  if (
    updateBody.sessionStartedTime &&
    updateBody.sessionEndedTime &&
    new Date(updateBody.sessionStartedTime) >= new Date(updateBody.sessionEndedTime)
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Session start time must be before end time');
  }

  Object.assign(session, updateBody);
  await session.save();
  return session;
};

/**
 * Delete a session by id
 * @param {ObjectId} sessionId
 * @returns {Promise<Session>}
 */
const deleteSessionById = async (sessionId) => {
  const session = await getSessionById(sessionId);
  if (!session) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Session not found');
  }
  await session.deleteOne();
  return session;
};

module.exports = {
  createSession,
  querySessions,
  getSessionById,
  updateSessionById,
  deleteSessionById,
};
