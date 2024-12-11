const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const sessionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    sessionDuration: {
      type: Number, // Duration in seconds or milliseconds
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
    },
    // New Fields
    moduleCompletionRate: {
      type: Number, // Completion percentage for the module (0-100)
      default: 0,
    },
    moduleCompletionTimestamp: {
      type: Date, // Timestamp of module completion
    },
    questionResponse: [
      {
        assessmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Assessment',
        },
        selectedOption: {
          type: String,
        },
        responseTime: {
          type: Number, // Response time in seconds
        }
      },
    ],
    assessmentResults: {
      totalScore: {
        type: Number,
      },
      maxScore: {
        type: Number,
      },
      percentageScore: {
        type: Number,
      },
      passFailStatus: {
        enum: ['Pass', 'Fail'],
      },
      totalQuestions: {
        type: Number,
      },
      correctAnswers: {
        type: Number,
      },
      incorrectAnswers: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
sessionSchema.plugin(toJSON);
sessionSchema.plugin(paginate);

/**
 * @typedef Session
 */
const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
