// src/app/member/meals/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdChevronLeft, MdChevronRight, MdFileDownload } from 'react-icons/md';
import { FiCalendar, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

interface MealDay {
  date: string;
  day: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  totalMeals: number;
}

interface StatCard {
  label: string;
  value: number;
  icon: string;
  color: string;
}

const MealsPage: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [mealDays, setMealDays] = useState<MealDay[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      generateMealDays();
    }
  }, [currentMonth, isMounted]);

  const generateMealDays = (): void => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: MealDay[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      days.push({
        date: dateString,
        day: dayName,
        breakfast: Math.random() > 0.3,
        lunch: Math.random() > 0.3,
        dinner: Math.random() > 0.3,
        totalMeals: 0,
      });
    }

    days.forEach((day) => {
      day.totalMeals = (day.breakfast ? 1 : 0) + (day.lunch ? 1 : 0) + (day.dinner ? 1 : 0);
    });

    setMealDays(days);
  };

  const handlePrevMonth = (): void => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = (): void => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const toggleMeal = (dateString: string, mealType: 'breakfast' | 'lunch' | 'dinner'): void => {
    setMealDays((prevDays) =>
      prevDays.map((day) => {
        if (day.date === dateString) {
          const updatedDay = { ...day, [mealType]: !day[mealType] };
          updatedDay.totalMeals = (updatedDay.breakfast ? 1 : 0) + (updatedDay.lunch ? 1 : 0) + (updatedDay.dinner ? 1 : 0);
          return updatedDay;
        }
        return day;
      })
    );
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-blue-50 pt-6 pb-20 px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const totalMeals = mealDays.reduce((sum, day) => sum + day.totalMeals, 0);
  const breakfastCount = mealDays.filter((day) => day.breakfast).length;
  const lunchCount = mealDays.filter((day) => day.lunch).length;
  const dinnerCount = mealDays.filter((day) => day.dinner).length;

  const statCards: StatCard[] = [
    { label: 'Total Meals', value: totalMeals, icon: '🍽️', color: 'from-emerald-500 to-teal-500' },
    { label: 'Breakfast', value: breakfastCount, icon: '🍳', color: 'from-orange-500 to-yellow-500' },
    { label: 'Lunch', value: lunchCount, icon: '🥗', color: 'from-blue-500 to-cyan-500' },
    { label: 'Dinner', value: dinnerCount, icon: '🍲', color: 'from-purple-500 to-pink-500' },
  ];

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
    <div className="min-h-screen max-w-full lg:max-w-7xl mx-auto bg-gradient-to-br from-gray-50 via-emerald-50 to-blue-50 pt-6 pb-20 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="w-full">
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
            <motion.div variants={itemVariants} className="flex-1 min-w-0">
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 truncate"
              >
                My Meals 🍽️
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-2 mt-2 sm:mt-3 text-gray-500 text-sm sm:text-base"
              >
                <FiCalendar size={18} className="text-emerald-600 flex-shrink-0" />
                <span className="font-medium">{monthName}</span>
                <span className="text-gray-400 hidden sm:inline">•</span>
                <span className="text-xs sm:text-sm truncate">
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
                className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1 flex-shrink-0"
              >
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrevMonth}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-all flex-shrink-0"
                  aria-label="Previous month"
                >
                  <MdChevronLeft size={20} className="text-gray-600" />
                </motion.button>
                
                <motion.span
                  key={monthName}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-2 sm:px-3 py-2 font-medium text-xs sm:text-sm text-gray-700 min-w-[100px] sm:min-w-[120px] text-center whitespace-nowrap"
                >
                  {monthName}
                </motion.span>

                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextMonth}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-all flex-shrink-0"
                  aria-label="Next month"
                >
                  <MdChevronRight size={20} className="text-gray-600" />
                </motion.button>
              </motion.div>

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
                className="px-3 sm:px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-xs sm:text-base transition-all shadow-lg flex items-center justify-center gap-2 flex-shrink-0 whitespace-nowrap"
              >
                <MdFileDownload size={18} className="flex-shrink-0" />
                <span className="hidden sm:inline">Export</span>
                <span className="sm:hidden">📊</span>
              </motion.button>
            </motion.div>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-6 origin-left"
          />
        </motion.div>

        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 text-center hover:shadow-lg transition-all"
            >
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{stat.icon}</div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.label}</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <div className="border-b border-gray-200 p-4 sm:p-6 bg-gradient-to-r from-emerald-50 to-blue-50">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
              {monthName} - Meal Calendar
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Click on meals to toggle ON/OFF</p>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {mealDays.map((mealDay, index) => (
                <motion.div
                  key={mealDay.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="group border border-gray-200 rounded-lg hover:border-emerald-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-gray-900">
                          {new Date(mealDay.date).getDate()}
                        </p>
                        <p className="text-xs text-gray-600">{mealDay.day}</p>
                      </div>
                      <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold text-white ${
                        mealDay.totalMeals === 3 ? 'bg-emerald-600' :
                        mealDay.totalMeals === 2 ? 'bg-blue-600' :
                        mealDay.totalMeals === 1 ? 'bg-orange-600' :
                        'bg-red-600'
                      }`}>
                        {mealDay.totalMeals} meals
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleMeal(mealDay.date, 'breakfast')}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        mealDay.breakfast
                          ? 'bg-orange-100 border border-orange-300'
                          : 'bg-gray-100 border border-gray-300 opacity-50'
                      }`}
                    >
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <span>🍳</span>
                        <span className="hidden sm:inline">Breakfast</span>
                        <span className="sm:hidden">B</span>
                      </span>
                      {mealDay.breakfast ? (
                        <FiToggleRight size={20} className="text-orange-600 flex-shrink-0" />
                      ) : (
                        <FiToggleLeft size={20} className="text-gray-400 flex-shrink-0" />
                      )}
                    </motion.button>

                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleMeal(mealDay.date, 'lunch')}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        mealDay.lunch
                          ? 'bg-cyan-100 border border-cyan-300'
                          : 'bg-gray-100 border border-gray-300 opacity-50'
                      }`}
                    >
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <span>🥗</span>
                        <span className="hidden sm:inline">Lunch</span>
                        <span className="sm:hidden">L</span>
                      </span>
                      {mealDay.lunch ? (
                        <FiToggleRight size={20} className="text-cyan-600 flex-shrink-0" />
                      ) : (
                        <FiToggleLeft size={20} className="text-gray-400 flex-shrink-0" />
                      )}
                    </motion.button>

                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleMeal(mealDay.date, 'dinner')}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        mealDay.dinner
                          ? 'bg-emerald-100 border border-emerald-300'
                          : 'bg-gray-100 border border-gray-300 opacity-50'
                      }`}
                    >
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <span>🍲</span>
                        <span className="hidden sm:inline">Dinner</span>
                        <span className="sm:hidden">D</span>
                      </span>
                      {mealDay.dinner ? (
                        <FiToggleRight size={20} className="text-emerald-600 flex-shrink-0" />
                      ) : (
                        <FiToggleLeft size={20} className="text-gray-400 flex-shrink-0" />
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
        >
          <div className="bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <h3 className="text-base sm:text-lg font-bold mb-2">Breakfast</h3>
            <p className="text-2xl sm:text-3xl font-bold mb-1">{breakfastCount}</p>
            <p className="text-xs sm:text-sm opacity-90">days with breakfast</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <h3 className="text-base sm:text-lg font-bold mb-2">Lunch</h3>
            <p className="text-2xl sm:text-3xl font-bold mb-1">{lunchCount}</p>
            <p className="text-xs sm:text-sm opacity-90">days with lunch</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <h3 className="text-base sm:text-lg font-bold mb-2">Dinner</h3>
            <p className="text-2xl sm:text-3xl font-bold mb-1">{dinnerCount}</p>
            <p className="text-xs sm:text-sm opacity-90">days with dinner</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MealsPage;