const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const chapterSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: Number,
      required: true,
    },
    endTime: {
      type: Number,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const moduleSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    videoId: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    chapters: {
      type: [chapterSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    totalMcq: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
moduleSchema.plugin(toJSON);
moduleSchema.plugin(paginate);

/**
 * @typedef Module
 */
const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
