import { motion } from 'framer-motion';
import { AlertTriangle, Calendar, Droplets, Shield } from 'lucide-react';

function CycleInfo({ cycleData }) {
  const nextPeriod = cycleData.predictions[0];
  const nextOvulation = new Date(nextPeriod.ovulationDate);
  const today = new Date();
  const daysUntilPeriod = Math.ceil((new Date(nextPeriod.periodStart) - today) / (1000 * 60 * 60 * 24));
  const daysUntilOvulation = Math.ceil((nextOvulation - today) / (1000 * 60 * 60 * 24));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <motion.div 
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-red-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.03, y: -5 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Droplets className="w-6 h-6 text-red-500" />
          </motion.div>
          <h3 className="font-semibold text-gray-800">Next Period</h3>
        </div>
        <motion.p 
          className="text-2xl font-bold text-red-500"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {daysUntilPeriod > 0 ? `${daysUntilPeriod} days` : 'Today'} 🔴
        </motion.p>
        <p className="text-sm text-gray-500 mt-1">
          {new Date(nextPeriod.periodStart).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </motion.div>

      <motion.div 
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-amber-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.03, y: -5 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Calendar className="w-6 h-6 text-amber-500" />
          </motion.div>
          <h3 className="font-semibold text-gray-800">Ovulation</h3>
        </div>
        <motion.p 
          className="text-2xl font-bold text-amber-500"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          {daysUntilOvulation > 0 ? `${daysUntilOvulation} days` : 'Today'} 🟡
        </motion.p>
        <p className="text-sm text-gray-500 mt-1">
          {nextOvulation.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </motion.div>

      <motion.div 
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-orange-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.03, y: -5 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <AlertTriangle className="w-6 h-6 text-orange-500" />
          </motion.div>
          <h3 className="font-semibold text-gray-800">Fertile Window</h3>
        </div>
        <motion.p 
          className="text-lg font-bold text-orange-500"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        >
          {new Date(nextPeriod.fertileWindowStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(nextPeriod.fertileWindowEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </motion.p>
        <p className="text-sm text-gray-500 mt-1">High pregnancy risk zone ⚠️</p>
      </motion.div>
    </div>
  );
}

export default CycleInfo;
