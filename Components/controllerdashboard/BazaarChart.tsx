'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { MdShoppingCart, MdTrendingUp } from 'react-icons/md';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const BazaarChart = () => {
  const [timeRange, setTimeRange] = useState('week');

  const chartDataMap = {
    week: {
      categories: ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5', 'Jan 6', 'Jan 7'],
      data: [450, 520, 380, 600, 480, 550, 420],
    },
    month: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [3400, 3200, 3800, 3500],
    },
    year: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [12000, 13500, 11800, 14200, 13900, 15600, 14300, 13200, 14800, 15900, 16200, 17500],
    },
  };

  const currentData = chartDataMap[timeRange as keyof typeof chartDataMap];

  const bazaarChartOptions: any = {
    chart: {
      type: 'bar',
      toolbar: { show: true, tools: { download: true, selection: true, zoom: true, zoomin: true, zoomout: true, reset: true } },
      animations: { enabled: true, speed: 800, animateGradually: { enabled: true, delay: 150 }, dynamicAnimation: { enabled: true, speed: 150 } },
    },
    colors: ['#10b981'],
    xaxis: {
      categories: currentData.categories,
      labels: { style: { fontSize: '12px' } },
    },
    yaxis: {
      title: { text: 'Amount (৳)' },
      labels: { formatter: (val: number) => '৳' + val.toLocaleString() },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 6,
        dataLabels: { position: 'top' },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => '৳' + val.toLocaleString(),
      style: { fontSize: '12px', fontWeight: 600 },
      offsetY: -20,
    },
    states: {
      hover: { filter: { type: 'darken', value: 0.15 } },
      active: { filter: { type: 'darken', value: 0.15 } },
    },
    responsive: [
      { breakpoint: 768, options: { plotOptions: { bar: { columnWidth: '70%' } } } },
      { breakpoint: 480, options: { plotOptions: { bar: { columnWidth: '85%' } }, dataLabels: { enabled: false } } },
    ],
  };

  const bazaarChartSeries = [
    {
      name: 'Daily Bazaar Cost',
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
      transition={{ delay: 0.25 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <motion.div
        whileHover={{ backgroundColor: '#f3f4f6' }}
        className="px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
      >
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2"
        >
          <motion.span
            animate={{ rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <MdShoppingCart size={22} className="text-orange-600" />
          </motion.span>
          <span className="hidden sm:inline">Daily Bazaar Cost</span>
          <span className="sm:hidden">Bazaar Cost</span>
        </motion.h2>

        <motion.select
          whileHover={{ scale: 1.05 }}
          whileFocus={{ scale: 1.05 }}
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 sm:px-4 py-2 border border-orange-200 bg-white rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer"
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
            options={bazaarChartOptions}
            series={bazaarChartSeries}
            type="bar"
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
              Total Cost
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl sm:text-2xl font-bold text-green-700"
            >
              ৳{stats.total.toLocaleString()}
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
              ৳{stats.avg.toLocaleString()}
            </motion.p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(245, 158, 11, 0.1)' }}
            className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 sm:p-4 rounded-xl border border-orange-200"
          >
            <motion.p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">
              Highest Day
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl sm:text-2xl font-bold text-orange-700 flex items-center gap-1"
            >
              <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                ↑
              </motion.span>
              ৳{stats.max.toLocaleString()}
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
              ৳{stats.min.toLocaleString()}
            </motion.p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 pt-4 border-t border-gray-200"
        >
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <MdTrendingUp size={18} className="text-green-600" />
              <span>
                {timeRange === 'week' && '7 days data'}
                {timeRange === 'month' && '4 weeks data'}
                {timeRange === 'year' && '12 months data'}
              </span>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium transition-all"
            >
              View Details →
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default BazaarChart;