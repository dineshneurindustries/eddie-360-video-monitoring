const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const traineeSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    languagePreference: {
      type: String,
      default: 'en',
    },
    lastActivity: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
traineeSchema.plugin(toJSON);
traineeSchema.plugin(paginate);

/**
 * @typedef Trainee
 */
const Trainee = mongoose.model('Trainee', traineeSchema);

module.exports = Trainee;
