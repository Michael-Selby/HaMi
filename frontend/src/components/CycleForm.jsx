import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Heart } from 'lucide-react';

function CycleForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    lastPeriodDate: initialData?.lastPeriodDate ? initialData.lastPeriodDate.split('T')[0] : '',
    cycleLength: initialData?.cycleLength || 28,
    periodLength: initialData?.periodLength || 5,
    notes: initialData?.notes || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
            className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-pink-50/50"
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
            onChange={(e) => setFormData({ ...formData, cycleLength: parseInt(e.target.value) || 28 })}
            min="21"
            max="35"
            placeholder="28"
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-purple-50/50"
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
            onChange={(e) => setFormData({ ...formData, periodLength: parseInt(e.target.value) || 5 })}
            min="2"
            max="7"
            placeholder="5"
            className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-pink-50/50"
            whileFocus={{ scale: 1.02 }}
          />
          <p className="text-xs text-gray-500 mt-1">We'll use 5 days if you don't know 💕</p>
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
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all bg-gray-50/50"
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
