const mongoose = require('mongoose');

const cycleSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  lastPeriodDate: {
    type: Date,
    required: true
  },
  cycleLength: {
    type: Number,
    required: true,
    default: 28
  },
  periodLength: {
    type: Number,
    required: true,
    default: 5
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

cycleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Cycle', cycleSchema);
