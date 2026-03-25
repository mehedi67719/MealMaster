// src/app/member/home/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiCalendar, FiCreditCard, FiBarChart2, FiArrowUpRight, FiArrowDownLeft, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { MdChevronLeft, MdChevronRight, MdFileDownload } from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface MealHistoryItem {
  date: string;
  day: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  cost: number;
}

interface DailyMealDataItem {
  date: string;
  meals: number;
  cost: number;
}

interface MonthlyDataItem {
  name: string;
  value: number;
  color: string;
}

interface StatItem {
  title: string;
  value: string;
  subtext: string;
  icon: React.ComponentType<{ size: number }>;
  color: string;
  trend: string;
  trendUp: boolean;
}

const MemberHome: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePrevMonth = (): void => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = (): void => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const dailyMealData: DailyMealDataItem[] = [
    { date: '20 Mar', meals: 2, cost: 1500 },
    { date: '21 Mar', meals: 1, cost: 750 },
    { date: '22 Mar', meals: 2, cost: 1500 },
    { date: '23 Mar', meals: 0, cost: 0 },
    { date: '24 Mar', meals: 2, cost: 1500 },
    { date: '25 Mar', meals: 3, cost: 2250 },
    { date: '26 Mar', meals: 2, cost: 1500 },
  ];

  const monthlyData: MonthlyDataItem[] = [
    { name: 'Breakfast', value: 15, color: '#f97316' },
    { name: 'Lunch', value: 22, color: '#06b6d4' },
    { name: 'Dinner', value: 20, color: '#10b981' },
  ];

  const mealHistory: MealHistoryItem[] = [
    { date: '26 Mar 2026', day: 'Wednesday', breakfast: true, lunch: true, dinner: false, cost: 1500 },
    { date: '25 Mar 2026', day: 'Tuesday', breakfast: true, lunch: true, dinner: true, cost: 2250 },
    { date: '24 Mar 2026', day: 'Monday', breakfast: true, lunch: true, dinner: false, cost: 1500 },
    { date: '23 Mar 2026', day: 'Sunday', breakfast: false, lunch: false, dinner: false, cost: 0 },
    { date: '22 Mar 2026', day: 'Saturday', breakfast: true, lunch: true, dinner: false, cost: 1500 },
    { date: '21 Mar 2026', day: 'Friday', breakfast: true, lunch: false, dinner: true, cost: 1500 },
    { date: '20 Mar 2026', day: 'Thursday', breakfast: true, lunch: true, dinner: true, cost: 2250 },
  ];

  const totalMeals: number = mealHistory.reduce((acc, meal) => acc + (meal.breakfast ? 1 : 0) + (meal.lunch ? 1 : 0) + (meal.dinner ? 1 : 0), 0);
  const totalCost: number = mealHistory.reduce((acc, meal) => acc + meal.cost, 0);
  const totalDeposit: number = 50000;
  const remainingBalance: number = totalDeposit - totalCost;
  const perMealCost: number = totalMeals > 0 ? Math.round(totalCost / totalMeals) : 0;

  const stats: StatItem[] = [
    {
      title: 'Total Meals',
      value: totalMeals.toString(),
      subtext: 'This Month',
      icon: FiBarChart2,
      color: 'from-emerald-500 to-teal-500',
      trend: `${totalMeals} meals taken`,
      trendUp: true,
    },
    {
      title: 'Total Cost',
      value: totalCost.toLocaleString(),
      subtext: 'BDT',
      icon: FiCreditCard,
      color: 'from-blue-500 to-cyan-500',
      trend: `${totalCost.toLocaleString()} BDT spent`,
      trendUp: true,
    },
    {
      title: 'Amount Spent',
      value: totalCost.toLocaleString(),
      subtext: 'BDT',
      icon: FiArrowDownLeft,
      color: 'from-purple-500 to-pink-500',
      trend: `Out of ${totalDeposit.toLocaleString()}`,
      trendUp: true,
    },
    {
      title: 'Remaining Balance',
      value: remainingBalance.toLocaleString(),
      subtext: 'BDT',
      icon: FiArrowUpRight,
      color: remainingBalance >= 0 ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500',
      trend: remainingBalance >= 0 ? 'Positive' : 'Negative',
      trendUp: remainingBalance >= 0,
    },
  ];

  if (!isMounted) return null;

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
    <div className="min-h-screen max-w-full lg:max-w-7xl mx-auto pt-6 pb-20 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="w-full ">
        
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
                Welcome Back! 👋
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
                className="px-3 sm:px-6 py-2.5 bg-white rounded-xl hover:bg-gray-50 border border-gray-200 font-medium text-xs sm:text-base transition-all flex items-center justify-center gap-2 flex-shrink-0 whitespace-nowrap"
              >
                <span className="hidden sm:inline">This Month</span>
                <span className="sm:hidden">Month</span>
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
                className="px-3 sm:px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-xs sm:text-base transition-all shadow-lg flex items-center justify-center gap-2 flex-shrink-0 whitespace-nowrap"
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
            className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-6 origin-left"
          />
        </motion.div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative h-full overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-gray-200 p-4 sm:p-6 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                  
                  <div className="relative flex items-start justify-between mb-3 sm:mb-4">
                    <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.color} text-white flex-shrink-0`}>
                      <Icon size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs sm:text-sm font-semibold flex-shrink-0 ${
                      stat.trendUp ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {stat.trendUp ? <FiTrendingUp size={14} className="sm:w-4 sm:h-4" /> : <FiTrendingDown size={14} className="sm:w-4 sm:h-4" />}
                    </div>
                  </div>

                  <div className="relative min-w-0">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">{stat.title}</h3>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 break-words">{stat.value}</p>
                    <p className="text-xs text-gray-500 mb-2 truncate">{stat.subtext}</p>
                    <p className={`text-xs font-medium truncate ${stat.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                      {stat.trend}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2 flex-shrink-0">
                <FiBarChart2 className="text-emerald-500 flex-shrink-0" size={20} />
                <span className="hidden sm:inline">Daily Meal Trend</span>
                <span className="sm:hidden">Meals</span>
              </h2>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full flex-shrink-0">
                Last 7 Days
              </span>
            </div>
            <div className="w-full overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
              <ResponsiveContainer width="100%" height={250} minWidth={280}>
                <BarChart data={dailyMealData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }}
                    cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                  />
                  <Legend />
                  <Bar dataKey="meals" fill="#10b981" radius={[8, 8, 0, 0]} name="Meals" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 flex-shrink-0">
              <FiBarChart2 className="text-blue-500 flex-shrink-0" size={20} />
              <span className="hidden sm:inline">Distribution</span>
              <span className="sm:hidden">Diet</span>
            </h2>
            <div className="w-full overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
              <ResponsiveContainer width="100%" height={200} minWidth={240}>
                <PieChart margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                  <Pie
                    data={monthlyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {monthlyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} meals`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {monthlyData.map((item, index) => (
                <div key={index} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs sm:text-sm text-gray-600 truncate">{item.name}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-900 flex-shrink-0">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <div className="border-b border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2 flex-shrink-0">
              <FiClock className="text-emerald-500 flex-shrink-0" size={20} />
              <span className="truncate">Recent History</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-semibold text-gray-900">Date</th>
                  <th className="px-1 sm:px-3 md:px-6 py-3 sm:py-4 text-center font-semibold text-gray-900 text-xs">B</th>
                  <th className="px-1 sm:px-3 md:px-6 py-3 sm:py-4 text-center font-semibold text-gray-900 text-xs">L</th>
                  <th className="px-1 sm:px-3 md:px-6 py-3 sm:py-4 text-center font-semibold text-gray-900 text-xs">D</th>
                  <th className="px-1 sm:px-3 md:px-6 py-3 sm:py-4 text-right font-semibold text-gray-900">Cost</th>
                  <th className="px-1 sm:px-3 md:px-6 py-3 sm:py-4 text-center font-semibold text-gray-900 text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {mealHistory.map((meal, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4">
                      <div className="font-semibold text-gray-900 text-xs sm:text-sm">{meal.date.split(' ')[0]} {meal.date.split(' ')[1]}</div>
                      <div className="text-xs text-gray-500 hidden sm:block">{meal.day}</div>
                    </td>
                    <td className="px-1 sm:px-3 md:px-6 py-2 sm:py-4 text-center">
                      <div className={`inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded text-xs font-bold ${
                        meal.breakfast
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {meal.breakfast ? '✓' : '✗'}
                      </div>
                    </td>
                    <td className="px-1 sm:px-3 md:px-6 py-2 sm:py-4 text-center">
                      <div className={`inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded text-xs font-bold ${
                        meal.lunch
                          ? 'bg-cyan-100 text-cyan-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {meal.lunch ? '✓' : '✗'}
                      </div>
                    </td>
                    <td className="px-1 sm:px-3 md:px-6 py-2 sm:py-4 text-center">
                      <div className={`inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded text-xs font-bold ${
                        meal.dinner
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {meal.dinner ? '✓' : '✗'}
                      </div>
                    </td>
                    <td className="px-1 sm:px-3 md:px-6 py-2 sm:py-4 text-right">
                      <div className="font-bold text-gray-900 text-xs sm:text-sm">{meal.cost.toLocaleString()}</div>
                    </td>
                    <td className="px-1 sm:px-3 md:px-6 py-2 sm:py-4 text-center">
                      {meal.cost === 0 ? (
                        <div className="inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700 whitespace-nowrap">
                          <FiAlertCircle size={12} className="hidden sm:inline flex-shrink-0" />
                          <span className="hidden sm:inline">No</span>
                          <span className="sm:hidden">✗</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-1 rounded text-xs font-semibold bg-emerald-100 text-emerald-700 whitespace-nowrap">
                          <FiCheckCircle size={12} className="hidden sm:inline flex-shrink-0" />
                          <span className="hidden sm:inline">Yes</span>
                          <span className="sm:hidden">✓</span>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl sm:rounded-b-2xl">
            <button className="text-emerald-600 hover:text-emerald-700 font-semibold text-xs sm:text-sm transition-colors">
              View Full History →
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
        >
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
            <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 truncate">Monthly Summary</h3>
            <p className="text-emerald-100 text-xs sm:text-sm mb-4 truncate">Your consumption</p>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center bg-white/20 px-3 sm:px-4 py-2 rounded-lg gap-2">
                <span className="text-xs sm:text-sm font-medium truncate">Total Meals</span>
                <span className="text-base sm:text-lg font-bold flex-shrink-0">{totalMeals}</span>
              </div>
              <div className="flex justify-between items-center bg-white/20 px-3 sm:px-4 py-2 rounded-lg gap-2">
                <span className="text-xs sm:text-sm font-medium truncate">Total Cost</span>
                <span className="text-base sm:text-lg font-bold flex-shrink-0 text-right">{totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center bg-white/20 px-3 sm:px-4 py-2 rounded-lg gap-2">
                <span className="text-xs sm:text-sm font-medium truncate">Per Meal</span>
                <span className="text-base sm:text-lg font-bold flex-shrink-0">{perMealCost.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
            <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 truncate">Financial Status</h3>
            <p className="text-blue-100 text-xs sm:text-sm mb-4 truncate">Account balance</p>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center bg-white/20 px-3 sm:px-4 py-2 rounded-lg gap-2">
                <span className="text-xs sm:text-sm font-medium truncate">Deposit</span>
                <span className="text-base sm:text-lg font-bold flex-shrink-0 text-right">{totalDeposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center bg-white/20 px-3 sm:px-4 py-2 rounded-lg gap-2">
                <span className="text-xs sm:text-sm font-medium truncate">Spent</span>
                <span className="text-base sm:text-lg font-bold flex-shrink-0 text-right">{totalCost.toLocaleString()}</span>
              </div>
              <div className={`flex justify-between items-center px-3 sm:px-4 py-2 rounded-lg gap-2 font-bold ${
                remainingBalance >= 0 
                  ? 'bg-green-400/30 text-green-100' 
                  : 'bg-red-400/30 text-red-100'
              }`}>
                <span className="text-xs sm:text-sm font-medium truncate">Balance</span>
                <span className="text-base sm:text-lg flex-shrink-0 text-right">{remainingBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MemberHome;