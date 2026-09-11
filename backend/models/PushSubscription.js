const mongoose = require('mongoose');

const pushSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  endpoint: {
    type: String,
    required: true,
    unique: true
  },
  keys: {
    p256dh: {
      type: String,
      required: true
    },
    auth: {
      type: String,
      required: true
    }
  },
  enabled: {
    type: Boolean,
    default: true
  },
  remindPeriod: {
    type: Boolean,
    default: true
  },
  remindFertile: {
    type: Boolean,
    default: false
  },
  daysBefore: {
    type: Number,
    default: 1,
    min: 0,
    max: 7
  },
  notifiedDates: {
    type: [String],
    default: []
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

pushSubscriptionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('PushSubscription', pushSubscriptionSchema);