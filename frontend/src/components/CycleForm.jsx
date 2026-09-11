import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Heart, Bell } from 'lucide-react';
import { subscribeToPush, sendSubscriptionToServer, unsubscribeFromPush } from '../utils/push';

function CycleForm({ initialData, onSave, onCancel, userId }) {
  const [formData, setFormData] = useState({
    lastPeriodDate: initialData?.lastPeriodDate ? initialData.lastPeriodDate.split('T')[0] : '',
    cycleLength: initialData?.cycleLength || 28,
    periodLength: initialData?.periodLength || 5,
    notes: initialData?.notes || ''
  });

  const [reminders, setReminders] = useState({
    enabled: false,
    remindPeriod: true,
    remindFertile: false,
    daysBefore: 1
  });

  const [reminderStatus, setReminderStatus] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || '/api';

  const normalizeData = (data) => ({
    ...data,
    cycleLength: data.cycleLength === '' || isNaN(data.cycleLength) ? 28 : Number(data.cycleLength),
    periodLength: data.periodLength === '' || isNaN(data.periodLength) ? 5 : Number(data.periodLength)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(normalizeData(formData));

    if (reminders.enabled) {
      const result = await subscribeToPush();
      if (!result.ok) {
        setReminderStatus(result.message);
        return;
      }
      const saved = await sendSubscriptionToServer(apiUrl, userId, result.subscription, {
        enabled: true,
        remindPeriod: reminders.remindPeriod,
        remindFertile: reminders.remindFertile,
        daysBefore: Number(reminders.daysBefore) || 1
      });
      setReminderStatus(saved ? 'Reminders enabled ✅' : 'Reminders enabled but failed to save.');
    } else {
      await unsubscribeFromPush(apiUrl, userId);
      setReminderStatus('');
    }
  };

  const inputBaseClass = 'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all bg-white/50';
  const accentByKey = {
    date: 'border-pink-200 focus:ring-pink-500 focus:border-pink-500',
    cycle: 'border-purple-200 focus:ring-purple-500 focus:border-purple-500',
    period: 'border-pink-200 focus:ring-pink-500 focus:border-pink-500',
    notes: 'border-gray-200 focus:ring-gray-500 focus:border-gray-500'
  };

  return (
    <motion.div 
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-pink-100"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="flex items-center justify-between mb-6">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Heart className="w-6 h-6 text-pink-500" />
          </motion.div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Cycle Settings</h2>
        </motion.div>
        <motion.button 
          onClick={onCancel} 
          className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-6 h-6" />
        </motion.button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Period Date 📅
          </label>
          <motion.input
            type="date"
            value={formData.lastPeriodDate}
            onChange={(e) => setFormData({ ...formData, lastPeriodDate: e.target.value })}
            className={`${inputBaseClass} ${accentByKey.date}`}
            required
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cycle Length (days) <span className="text-gray-400 font-normal">- optional</span>
          </label>
          <motion.input
            type="number"
            value={formData.cycleLength}
            onChange={(e) => setFormData({ ...formData, cycleLength: e.target.value })}
            min="21"
            max="35"
            placeholder="28"
            className={`${inputBaseClass} ${accentByKey.cycle}`}
            whileFocus={{ scale: 1.02 }}
          />
          <p className="text-xs text-gray-500 mt-1">We'll use 28 days if you don't know your cycle length 🤔</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Period Length (days) <span className="text-gray-400 font-normal">- optional</span>
          </label>
          <motion.input
            type="number"
            value={formData.periodLength}
            onChange={(e) => setFormData({ ...formData, periodLength: e.target.value })}
            min="2"
            max="7"
            placeholder="5"
            className={`${inputBaseClass} ${accentByKey.period}`}
            whileFocus={{ scale: 1.02 }}
          />
          <p className="text-xs text-gray-500 mt-1">We'll use 5 days if you don't know 💕</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="border-2 border-gray-100 rounded-2xl p-4 bg-white/60"
        >
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Bell className="w-4 h-4 text-pink-500" />
              Reminders 🔔
            </label>
            <input
              type="checkbox"
              checked={reminders.enabled}
              onChange={(e) => setReminders({ ...reminders, enabled: e.target.checked })}
              className="w-5 h-5 accent-pink-500"
            />
          </div>

          {reminders.enabled && (
            <div className="space-y-3 mt-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600 flex items-center gap-2 cursor-pointer">
                  Period start
                  <input
                    type="checkbox"
                    checked={reminders.remindPeriod}
                    onChange={(e) => setReminders({ ...reminders, remindPeriod: e.target.checked })}
                    className="w-4 h-4 accent-pink-500"
                  />
                </label>
                <label className="text-sm text-gray-600 flex items-center gap-2 cursor-pointer">
                  Fertile window
                  <input
                    type="checkbox"
                    checked={reminders.remindFertile}
                    onChange={(e) => setReminders({ ...reminders, remindFertile: e.target.checked })}
                    className="w-4 h-4 accent-amber-500"
                  />
                </label>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600 shrink-0">Remind me</label>
                <input
                  type="number"
                  value={reminders.daysBefore}
                  min="0"
                  max="7"
                  onChange={(e) => setReminders({ ...reminders, daysBefore: e.target.value })}
                  className="w-20 px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white"
                />
                <label className="text-sm text-gray-600 shrink-0">day(s) before</label>
              </div>
              <p className="text-xs text-gray-500">You'll get a push notification on your device.</p>
              {reminderStatus && (
                <p className={`text-xs ${reminderStatus.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>{reminderStatus}</p>
              )}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (optional) 📝
          </label>
          <motion.textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className={`${inputBaseClass} ${accentByKey.notes}`}
            rows="3"
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>

        <motion.button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl text-lg font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Save className="w-5 h-5" />
          </motion.div>
          Save Settings ✨
        </motion.button>
      </form>
    </motion.div>
  );
}

export default CycleForm;