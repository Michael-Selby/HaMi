import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Calendar({ predictions, currentMonth, onMonthChange }) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const leadingBlankCount = monthStart.getDay();
  const totalCells = Math.ceil((leadingBlankCount + calendarDays.length) / 7) * 7;
  const trailingBlankCount = totalCells - leadingBlankCount - calendarDays.length;

  const getDayStatus = (date) => {
    const dateStr = date.toISOString();
    
    for (const prediction of predictions) {
      const periodStart = new Date(prediction.periodStart);
      const periodEnd = new Date(prediction.periodEnd);
      const fertileStart = new Date(prediction.fertileWindowStart);
      const fertileEnd = new Date(prediction.fertileWindowEnd);

      if (date >= periodStart && date <= periodEnd) {
        return 'period';
      }
      if (date >= fertileStart && date <= fertileEnd) {
        return 'fertile';
      }
    }
    
    return 'safe';
  };

  const getDayClass = (date) => {
    const status = getDayStatus(date);
    const baseClass = 'h-12 w-12 flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer';
    
    if (!isSameMonth(date, currentMonth)) {
      return `${baseClass} text-gray-300`;
    }
    
    if (isToday(date)) {
      return `${baseClass} bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-lg`;
    }
    
    switch (status) {
      case 'period':
        return `${baseClass} bg-gradient-to-br from-red-100 to-red-200 text-red-700 hover:from-red-200 hover:to-red-300 shadow-md`;
      case 'fertile':
        return `${baseClass} bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 hover:from-amber-200 hover:to-amber-300 shadow-md`;
      case 'safe':
        return `${baseClass} bg-gradient-to-br from-green-100 to-green-200 text-green-700 hover:from-green-200 hover:to-green-300 shadow-md`;
      default:
        return `${baseClass} text-gray-700 hover:bg-gray-100`;
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.div 
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-pink-100"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <motion.button
          onClick={() => onMonthChange(subMonths(currentMonth, 1))}
          className="p-3 hover:bg-pink-100 rounded-xl transition-colors text-gray-600 hover:text-pink-500"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        <motion.h2 
          className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"
          key={format(currentMonth, 'MMMM yyyy')}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {format(currentMonth, 'MMMM yyyy')}
        </motion.h2>
        <motion.button
          onClick={() => onMonthChange(addMonths(currentMonth, 1))}
          className="p-3 hover:bg-pink-100 rounded-xl transition-colors text-gray-600 hover:text-pink-500"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day, index) => (
          <motion.div 
            key={day} 
            className="text-center text-sm font-semibold text-gray-500"
            initial={{ opacity: 0,y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {day}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: leadingBlankCount }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {calendarDays.map((day, index) => (
          <motion.div 
            key={`day-${day.toISOString()}`} 
            className={getDayClass(day)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
          >
            {format(day, 'd')}
          </motion.div>
        ))}
        {Array.from({ length: trailingBlankCount }).map((_, i) => (
          <div key={`trailing-${i}`} />
        ))}
      </div>

      <motion.div 
        className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-500 shadow-sm"></div>
          <span className="text-sm text-gray-600 font-medium">Period 🔴</span>
        </motion.div>
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-500 shadow-sm"></div>
          <span className="text-sm text-gray-600 font-medium">Fertile Window 🟡</span>
        </motion.div>
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-500 shadow-sm"></div>
          <span className="text-sm text-gray-600 font-medium">Safe Days 🟢</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Calendar;
