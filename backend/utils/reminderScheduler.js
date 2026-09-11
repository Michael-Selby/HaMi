const webpush = require('web-push');
const Cycle = require('../models/Cycle');
const PushSubscription = require('../models/PushSubscription');
const { calculateCycle } = require('./cycle');

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@hami.app',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

const toDateOnly = (date) => {
  const d = new Date(date);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};

const addDaysUtc = (date, days) => {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
};

const checkReminders = async () => {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.warn('VAPID keys missing - web push reminders disabled');
    return;
  }

  const today = new Date();
  const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const subs = await PushSubscription.find({ enabled: true });

  for (const sub of subs) {
    const keysToAdd = [];
    try {
      const cycle = await Cycle.findOne({ userId: sub.userId });
      if (!cycle) continue;

      const predictions = calculateCycle(cycle.lastPeriodDate, cycle.cycleLength, cycle.periodLength);

      for (const p of predictions) {
        if (sub.remindPeriod) {
          const reminderDate = addDaysUtc(toDateOnly(p.periodStart), -sub.daysBefore).getTime();
          if (reminderDate === todayUTC) {
            const key = `period:${toDateOnly(p.periodStart).toISOString()}`;
            if (!sub.notifiedDates.includes(key)) {
              const inDays = sub.daysBefore === 0 ? 'today' : `in ${sub.daysBefore} day${sub.daysBefore > 1 ? 's' : ''}`;
              await sendPush(sub, { title: 'Period Reminder 🌸', body: `Your period is expected to start ${inDays}.` });
              keysToAdd.push(key);
            }
          }
        }

        if (sub.remindFertile) {
          const reminderDate = addDaysUtc(toDateOnly(p.fertileWindowStart), -sub.daysBefore).getTime();
          if (reminderDate === todayUTC) {
            const key = `fertile:${toDateOnly(p.fertileWindowStart).toISOString()}`;
            if (!sub.notifiedDates.includes(key)) {
              const inDays = sub.daysBefore === 0 ? 'today' : `in ${sub.daysBefore} day${sub.daysBefore > 1 ? 's' : ''}`;
              await sendPush(sub, { title: 'Fertile Window 🟡', body: `Your fertile window is expected to start ${inDays}.` });
              keysToAdd.push(key);
            }
          }
        }
      }

      if (keysToAdd.length > 0) {
        sub.notifiedDates.push(...keysToAdd);
        sub.markModified('notifiedDates');
        await sub.save();
      }
    } catch (error) {
      if (error.statusCode === 404 || error.statusCode === 410) {
        await PushSubscription.deleteOne({ _id: sub._id });
      } else {
        console.error(`Reminder send error for user ${sub.userId}:`, error.message);
      }
    }
  }
};

const sendPush = (sub, data) => {
  const payload = JSON.stringify({ ...data, url: '/', tag: data.title });
  return webpush.sendNotification(
    { endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth } },
    payload
  );
};

const startReminderScheduler = () => {
  const intervalMinutes = Number(process.env.REMINDER_CHECK_INTERVAL_MINUTES) || 60;
  setTimeout(checkReminders, 5000);
  setInterval(checkReminders, intervalMinutes * 60 * 1000);
};

module.exports = { checkReminders, startReminderScheduler };