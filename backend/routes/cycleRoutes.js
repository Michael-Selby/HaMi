const express = require('express');
const router = express.Router();
const Cycle = require('../models/Cycle');
const { calculateCycle } = require('../utils/cycle');

// Get user's cycle data
router.get('/:userId', async (req, res) => {
  try {
    const cycle = await Cycle.findOne({ userId: req.params.userId });
    if (!cycle) {
      return res.status(404).json({ message: 'Cycle data not found' });
    }
    
    const predictions = calculateCycle(cycle.lastPeriodDate, cycle.cycleLength, cycle.periodLength);
    
    res.json({
      ...cycle.toObject(),
      predictions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update cycle data
router.post('/', async (req, res) => {
  try {
    const { userId, lastPeriodDate, cycleLength, periodLength, notes } = req.body;
    
    const cycle = await Cycle.findOneAndUpdate(
      { userId },
      { lastPeriodDate, cycleLength, periodLength, notes },
      { new: true, upsert: true }
    );
    
    const predictions = calculateCycle(cycle.lastPeriodDate, cycle.cycleLength, cycle.periodLength);
    
    res.json({
      ...cycle.toObject(),
      predictions
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update cycle data
router.put('/:userId', async (req, res) => {
  try {
    const cycle = await Cycle.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true }
    );
    
    if (!cycle) {
      return res.status(404).json({ message: 'Cycle data not found' });
    }
    
    const predictions = calculateCycle(cycle.lastPeriodDate, cycle.cycleLength, cycle.periodLength);
    
    res.json({
      ...cycle.toObject(),
      predictions
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete cycle data
router.delete('/:userId', async (req, res) => {
  try {
    const cycle = await Cycle.findOneAndDelete({ userId: req.params.userId });
    if (!cycle) {
      return res.status(404).json({ message: 'Cycle data not found' });
    }
    res.json({ message: 'Cycle data deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
