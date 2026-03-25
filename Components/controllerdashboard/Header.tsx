'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdDateRange, MdFileDownload, MdChevronLeft, MdChevronRight } from 'react-icons/md';

const Header = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-8"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <motion.div variants={itemVariants} className="flex-1">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900"
          >
            🎯 Controller Dashboard
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mt-2 sm:mt-3 text-gray-500 text-sm sm:text-base"
          >
            <MdDateRange size={18} className="text-green-600 flex-shrink-0" />
            <span className="font-medium">{monthName}</span>
            <span className="text-gray-400">•</span>
            <span className="text-xs sm:text-sm">
              {currentMonth.toLocaleDateString('en-US', { weekday: 'long' })}
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-2 w-full md:w-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1"
          >
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all"
            >
              <MdChevronLeft size={20} className="text-gray-600" />
            </motion.button>
            
            <motion.span
              key={monthName}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="px-3 py-2 font-medium text-sm text-gray-700 min-w-[120px] text-center"
            >
              {monthName}
            </motion.span>

            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all"
            >
              <MdChevronRight size={20} className="text-gray-600" />
            </motion.button>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.95 }}
            className="px-4 sm:px-6 py-2.5 bg-white rounded-xl hover:bg-gray-50 border border-gray-200 font-medium text-sm sm:text-base transition-all flex items-center justify-center gap-2"
          >
            <span>This Month</span>
            <motion.span
              animate={{ rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              📅
            </motion.span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
              backgroundColor: '#059669',
            }}
            whileTap={{ scale: 0.95 }}
            className="px-4 sm:px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium text-sm sm:text-base transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <MdFileDownload size={18} className="flex-shrink-0" />
            <span className="hidden sm:inline">Reports</span>
            <span className="sm:hidden">📊</span>
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-6 origin-left"
      />
    </motion.div>
  );
};

export default Header;