import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from './components/Calendar';
import CycleForm from './components/CycleForm';
import CycleInfo from './components/CycleInfo';
import InstallBanner from './components/InstallBanner';
import { Calendar as CalendarIcon, Moon, Sparkles } from 'lucide-react';

function App() {
  const [cycleData, setCycleData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const userId = 'user-1'; // In production, this would come from auth

  useEffect(() => {
    fetchCycleData();
  }, []);

  const fetchCycleData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/cycles/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setCycleData(data);
      }
    } catch (error) {
      console.error('Error fetching cycle data:', error);
    }
  };

  const handleSaveCycle = async (formData) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/cycles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId })
      });
      if (response.ok) {
        const data = await response.json();
        setCycleData(data);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving cycle data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <motion.header 
        className="bg-white/80 backdrop-blur-sm shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Moon className="w-8 h-8 text-pink-500" />
            </motion.div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">HaMi</h1>
          </motion.div>
          <motion.button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showForm ? 'Close' : 'Settings'}
          </motion.button>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence>
          {showForm && (
            <motion.div 
              className="mb-8 max-w-xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CycleForm 
                initialData={cycleData} 
                onSave={handleSaveCycle} 
                onCancel={() => setShowForm(false)} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {!cycleData && !showForm && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              <Sparkles className="w-16 h-16 mx-auto text-pink-400 mb-4" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Welcome to HaMi! 🌸</h2>
            <p className="text-gray-500 mb-6">Let's track your cycle together</p>
            <motion.button
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl text-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started ✨
            </motion.button>
          </motion.div>
        )}

        <AnimatePresence>
          {cycleData && !showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CycleInfo cycleData={cycleData} />
              <Calendar 
                predictions={cycleData.predictions} 
                currentMonth={currentMonth}
                onMonthChange={setCurrentMonth}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <InstallBanner />
    </div>
  );
}

export default App;
