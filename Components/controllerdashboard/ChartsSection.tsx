'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { MdLocalDining, MdTrendingUp } from 'react-icons/md';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ChartsSection = () => {
  const [timeRange, setTimeRange] = useState('week');

  const chartDataMap = {
    week: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [12, 14, 18, 16, 20, 14, 8],
    },
    month: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [60, 64, 72, 58],
    },
    year: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [120, 145, 156, 142, 168, 180, 165, 152, 175, 188, 195, 210],
    },
  };

  const currentData = chartDataMap[timeRange as keyof typeof chartDataMap];

  const mealChartOptions: any = {
    chart: {
      type: 'area',
      toolbar: { show: true, tools: { download: true, selection: true, zoom: true, zoomin: true, zoomout: true, reset: true } },
      animations: { enabled: true, speed: 800, animateGradually: { enabled: true, delay: 150 }, dynamicAnimation: { enabled: true, speed: 150 } },
    },
    stroke: { curve: 'smooth', width: 2 },
    colors: ['#10b981'],
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [0, 100] },
    },
    xaxis: {
      categories: currentData.categories,
      labels: { style: { fontSize: '12px' } },
    },
    yaxis: {
      title: { text: 'Meals' },
      labels: { formatter: (val: number) => val.toLocaleString() },
    },
    tooltip: {
      theme: 'light',
      y: { formatter: (val: number) => val + ' meals' },
    },
    responsive: [
      { breakpoint: 768, options: { chart: { height: 320 } } },
      { breakpoint: 480, options: { chart: { height: 280 } } },
    ],
  };

  const mealChartSeries = [
    {
      name: 'Meals',
      data: currentData.data,
    },
  ];

  const calculateStats = () => {
    const total = currentData.data.reduce((a: number, b: number) => a + b, 0);
    const avg = Math.round(total / currentData.data.length);
    const max = Math.max(...currentData.data);
    const min = Math.min(...currentData.data);
    return { total, avg, max, min };
  };

  const stats = calculateStats();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <motion.div
        whileHover={{ backgroundColor: '#f3f4f6' }}
        className="px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
      >
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2"
        >
          <motion.span
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          >
            <MdLocalDining size={22} className="text-green-600" />
          </motion.span>
          <span className="hidden sm:inline">Meal Trends</span>
          <span className="sm:hidden">Meals</span>
        </motion.h2>

        <motion.select
          whileHover={{ scale: 1.05 }}
          whileFocus={{ scale: 1.05 }}
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 sm:px-4 py-2 border border-green-200 bg-white rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all cursor-pointer w-full sm:w-auto"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </motion.select>
      </motion.div>

      <motion.div className="p-4 sm:p-6">
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-72 sm:h-80 md:h-96 mb-6"
        >
          <Chart
            options={mealChartOptions}
            series={mealChartSeries}
            type="area"
            height="100%"
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(16, 185, 129, 0.1)' }}
            className="bg-gradient-to-br from-green-50 to-green-100 p-3 sm:p-4 rounded-xl border border-green-200"
          >
            <motion.p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">
              Total Meals
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl sm:text-2xl font-bold text-green-700"
            >
              {stats.total}
            </motion.p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(59, 130, 246, 0.1)' }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 rounded-xl border border-blue-200"
          >
            <motion.p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">
              Average/Day
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl sm:text-2xl font-bold text-blue-700"
            >
              {stats.avg}
            </motion.p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(245, 158, 11, 0.1)' }}
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 sm:p-4 rounded-xl border border-yellow-200"
          >
            <motion.p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">
              Peak Day
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl sm:text-2xl font-bold text-yellow-700 flex items-center gap-1"
            >
              <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                ↑
              </motion.span>
              {stats.max}
            </motion.p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(239, 68, 68, 0.1)' }}
            className="bg-gradient-to-br from-red-50 to-red-100 p-3 sm:p-4 rounded-xl border border-red-200"
          >
            <motion.p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">
              Lowest Day
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl sm:text-2xl font-bold text-red-700 flex items-center gap-1"
            >
              <motion.span animate={{ y: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                ↓
              </motion.span>
              {stats.min}
            </motion.p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-2 text-xs sm:text-sm text-gray-600"
          >
            <MdTrendingUp size={18} className="text-green-600 flex-shrink-0" />
            <span className="font-medium">
              {timeRange === 'week' && '📊 7 days tracking'}
              {timeRange === 'month' && '📅 4 weeks tracking'}
              {timeRange === 'year' && '📈 12 months tracking'}
            </span>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium transition-all"
          >
            View Details →
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ChartsSection;