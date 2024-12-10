const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

// Define SessionStatus enum within the same file
const SessionStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

const sessionSchema = mongoose.Schema(
  {
    sessionId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
    },
    sessionTimeAndDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => validator.isDate(value),
        message: 'Invalid sessionTimeAndDate',
      },
    },
    sessionStartedTime: {
      type: Date,
      validate: {
        validator: (value) => !value || validator.isDate(value),
        message: 'Invalid sessionStartedTime',
      },
    },
    sessionEndedTime: {
      type: Date,
      validate: {
        validator: (value) => !value || validator.isDate(value),
        message: 'Invalid sessionEndedTime',
      },
    },
    grade: {
      type: String,
      validate: {
        validator: (value) => validator.isLength(value, { min: 1 }),
        message: 'Grade must not be empty',
      },
    },
    sessionStatus: {
      type: String,
      enum: Object.values(SessionStatus),
      default: SessionStatus.PENDING,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    feedback: {
      type: String,
    },
    sessionDuration: {
      type: Number,
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
sessionSchema.plugin(toJSON);
sessionSchema.plugin(paginate);

/**
 * @typedef Session
 */
const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
