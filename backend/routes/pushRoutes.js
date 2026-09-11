const express = require('express');
const router = express.Router();
const PushSubscription = require('../models/PushSubscription');

// Save or update a push subscription
router.post('/', async (req, res) => {
  try {
    const { userId, subscription, settings } = req.body;

    if (!userId || !subscription || !subscription.endpoint) {
      return res.status(400).json({ message: 'userId and subscription are required' });
    }

    const sub = await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      {
        userId,
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys?.p256dh,
          auth: subscription.keys?.auth
        },
        enabled: settings?.enabled ?? true,
        remindPeriod: settings?.remindPeriod ?? true,
        remindFertile: settings?.remindFertile ?? false,
        daysBefore: settings?.daysBefore ?? 1
      },
      { new: true, upsert: true }
    );

    res.json(sub);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update reminder settings for a user's subscription
router.put('/:userId', async (req, res) => {
  try {
    const { enabled, remindPeriod, remindFertile, daysBefore } = req.body;
    const sub = await PushSubscription.findOneAndUpdate(
      { userId: req.params.userId },
      { enabled, remindPeriod, remindFertile, daysBefore },
      { new: true }
    );

    if (!sub) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.json(sub);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a push subscription (unsubscribe)
router.delete('/:userId', async (req, res) => {
  try {
    const sub = await PushSubscription.findOneAndDelete({ userId: req.params.userId });
    if (!sub) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json({ message: 'Subscription deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;