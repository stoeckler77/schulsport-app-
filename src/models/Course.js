const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  emoji: {
    type: String,
    default: '🏃‍♂️'
  },
  targetGroup: {
    type: String,
    required: true
  },
  schedule: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  maxParticipants: {
    type: Number,
    required: true
  },
  notes: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', CourseSchema); 