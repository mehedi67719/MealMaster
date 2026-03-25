'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdArrowBack, MdTrendingUp, MdTrendingDown, MdShoppingCart, MdRestaurant, MdPeople, MdCheckCircle, MdWarning, MdDownload } from 'react-icons/md';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ManagerDetail {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  performanceScore: number;
  status: 'active' | 'inactive';
  totalBazaarCost: number;
  totalMeals: number;
  totalMembers: number;
  bazaarEntriesAdded: number;
  mealEntriesAdded: number;
  mealCollectionRate: number;
  totalAmountCollected: number;
  totalAmountDue: number;
  totalAmountWithManager: number;
}

const ManagerDetailPage = ({ params }: { params: { id: string } }) => {
  const [selectedMonth, setSelectedMonth] = useState('March');
  
  const [manager] = useState<ManagerDetail>({
    id: 1,
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    phone: '01700000001',
    joinDate: '2024-01-10',
    performanceScore: 95,
    status: 'active',
    totalBazaarCost: 3500,
    totalMeals: 45,
    totalMembers: 5,
    bazaarEntriesAdded: 12,
    mealEntriesAdded: 28,
    mealCollectionRate: 92,
    totalAmountCollected: 3220,
    totalAmountDue: 280,
    totalAmountWithManager: 450,
  });

  const monthlyData: { [key: string]: { bazaar: number[]; meals: number[]; collected: number; due: number; withManager: number } } = {
    'January': {
      bazaar: [480, 520, 450, 580, 490, 540, 510],
      meals: [10, 12, 11, 13, 12, 14, 11],
      collected: 2800,
      due: 150,
      withManager: 200,
    },
    'February': {
      bazaar: [500, 530, 460, 590, 510, 550, 520],
      meals: [11, 13, 12, 14, 13, 15, 12],
      collected: 2950,
      due: 180,
      withManager: 280,
    },
    'March': {
      bazaar: [520, 550, 480, 610, 530, 570, 540],
      meals: [12, 14, 13, 15, 14, 16, 13],
      collected: 3220,
      due: 280,
      withManager: 450,
    },
  };

  const currentMonthData = monthlyData[selectedMonth];

  const bazaarChartOptions: any = {
    chart: {
      type: 'bar',
      toolbar: { show: true },
      animations: { enabled: true, speed: 800 },
    },
    colors: ['#10b981'],
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      title: { text: 'Days of Week' },
    },
    yaxis: {
      title: { text: 'Amount (৳)' },
    },
    plotOptions: {
      bar: { columnWidth: '60%', borderRadius: 4 },
    },
    dataLabels: { enabled: true, formatter: (val: number) => '৳' + val },
    tooltip: {
      theme: 'light',
      y: { formatter: (val: number) => '৳' + val.toLocaleString() },
    },
  };

  const bazaarChartSeries = [
    { name: 'Daily Bazaar Cost', data: currentMonthData.bazaar },
  ];

  const mealChartOptions: any = {
    chart: {
      type: 'area',
      toolbar: { show: true },
      animations: { enabled: true, speed: 800 },
    },
    stroke: { curve: 'smooth', width: 2 },
    colors: ['#3b82f6'],
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [0, 100] },
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      title: { text: 'Days of Week' },
    },
    yaxis: { title: { text: 'Meals' } },
    tooltip: {
      theme: 'light',
      y: { formatter: (val: number) => val + ' meals' },
    },
  };

  const mealChartSeries = [
    { name: 'Meals Tracked', data: currentMonthData.meals },
  ];

  const collectionRateOptions: any = {
    chart: { type: 'radialBar' },
    plotOptions: {
      radialBar: {
        hollow: { size: '70%' },
        track: { margin: 15 },
        dataLabels: {
          name: { fontSize: '16px' },
          value: { fontSize: '24px', fontWeight: 'bold' },
        },
      },
    },
    colors: ['#10b981'],
    labels: ['Collection Rate'],
  };

  const collectionRate = Math.round(
    (currentMonthData.collected / (currentMonthData.collected + currentMonthData.due)) * 100
  );
  const collectionRateSeries = [collectionRate];

  const financeBreakdown: any = {
    chart: { type: 'donut' },
    colors: ['#10b981', '#ef4444', '#f59e0b'],
    labels: ['Collected', 'Due', 'With Manager'],
    plotOptions: {
      pie: { donut: { size: '75%' } },
    },
  };

  const financeBreakdownSeries = [currentMonthData.collected, currentMonthData.due, currentMonthData.withManager];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-6 sm:pt-8 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <Link href="/admin/managers">
              <motion.button
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-200 rounded-lg transition-all"
              >
                <MdArrowBack size={24} className="text-gray-700" />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{manager.name}</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{manager.email} • {manager.phone}</p>
            </div>
          </div>

          <motion.select
            whileHover={{ scale: 1.05 }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-sm bg-white"
          >
            <option value="January">January 2024</option>
            <option value="February">February 2024</option>
            <option value="March">March 2024</option>
          </motion.select>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-4 md:p-5 shadow-md border-l-4 border-blue-500"
          >
            <p className="text-gray-500 text-xs md:text-sm font-medium">Performance Score</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-3xl font-bold text-blue-600 mt-2"
            >
              {manager.performanceScore}%
            </motion.p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${manager.performanceScore}%` }}
                transition={{ delay: 0.2, duration: 1 }}
                className="bg-blue-600 h-full rounded-full"
              />
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-4 md:p-5 shadow-md border-l-4 border-green-500"
          >
            <p className="text-gray-500 text-xs md:text-sm font-medium">Month Bazaar Cost</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-2xl md:text-3xl font-bold text-green-600 mt-2"
            >
              ৳{currentMonthData.bazaar.reduce((a, b) => a + b, 0)}
            </motion.p>
            <p className="text-xs text-gray-400 mt-2">{currentMonthData.bazaar.length} days tracked</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-4 md:p-5 shadow-md border-l-4 border-orange-500"
          >
            <p className="text-gray-500 text-xs md:text-sm font-medium">Month Meals</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-bold text-orange-600 mt-2"
            >
              {currentMonthData.meals.reduce((a, b) => a + b, 0)}
            </motion.p>
            <p className="text-xs text-gray-400 mt-2">Total meals tracked</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-4 md:p-5 shadow-md border-l-4 border-purple-500"
          >
            <p className="text-gray-500 text-xs md:text-sm font-medium">Avg Daily Cost</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-2xl md:text-3xl font-bold text-purple-600 mt-2"
            >
              ৳{Math.round(currentMonthData.bazaar.reduce((a, b) => a + b, 0) / currentMonthData.bazaar.length)}
            </motion.p>
            <p className="text-xs text-gray-400 mt-2">Per day average</p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">📊 {selectedMonth} Weekly Bazaar Trend</h2>
            <div className="h-80">
              <Chart
                options={bazaarChartOptions}
                series={bazaarChartSeries}
                type="bar"
                height="100%"
              />
            </div>
            <motion.div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs sm:text-sm text-blue-700">
                <strong>Weekly Average:</strong> ৳{Math.round(currentMonthData.bazaar.reduce((a, b) => a + b, 0) / currentMonthData.bazaar.length)}
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">📈 {selectedMonth} Weekly Meal Tracking</h2>
            <div className="h-80">
              <Chart
                options={mealChartOptions}
                series={mealChartSeries}
                type="area"
                height="100%"
              />
            </div>
            <motion.div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs sm:text-sm text-blue-700">
                <strong>Daily Average:</strong> {Math.round(currentMonthData.meals.reduce((a, b) => a + b, 0) / currentMonthData.meals.length)} meals
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">💰 {selectedMonth} Collection Rate</h2>
            <div className="h-80">
              <Chart
                options={collectionRateOptions}
                series={collectionRateSeries}
                type="radialBar"
                height="100%"
              />
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">💸 {selectedMonth} Finance Breakdown</h2>
            <div className="h-80">
              <Chart
                options={financeBreakdown}
                series={financeBreakdownSeries}
                type="donut"
                height="100%"
              />
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">💵 {selectedMonth} Financial Summary</h2>
            <div className="space-y-4">
              <motion.div
                whileHover={{ x: 5 }}
                className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500"
              >
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Amount Collected</p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg sm:text-2xl font-bold text-green-600 mt-1 flex items-center gap-1"
                >
                  <MdTrendingUp size={18} />
                  ৳{currentMonthData.collected}
                </motion.p>
              </motion.div>

              <motion.div
                whileHover={{ x: 5 }}
                className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500"
              >
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Amount Due</p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-lg sm:text-2xl font-bold text-red-600 mt-1 flex items-center gap-1"
                >
                  <MdWarning size={18} />
                  ৳{currentMonthData.due}
                </motion.p>
              </motion.div>

              <motion.div
                whileHover={{ x: 5 }}
                className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500"
              >
                <p className="text-xs sm:text-sm text-gray-600 font-medium">With Manager</p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg sm:text-2xl font-bold text-yellow-600 mt-1"
                >
                  ৳{currentMonthData.withManager}
                </motion.p>
              </motion.div>

              <motion.div className="pt-4 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2">Total Balance</p>
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 }}
                  className="text-2xl sm:text-3xl font-bold text-purple-600"
                >
                  ৳{currentMonthData.collected + currentMonthData.withManager - currentMonthData.due}
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">📋 Manager Details</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-sm"
            >
              <MdDownload size={18} />
              Export Report
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <p className="text-xs text-gray-600 font-medium">Email</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{manager.email}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <p className="text-xs text-gray-600 font-medium">Phone</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{manager.phone}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <p className="text-xs text-gray-600 font-medium">Join Date</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{manager.joinDate}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <p className="text-xs text-gray-600 font-medium">Status</p>
              <motion.span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                  manager.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {manager.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
              </motion.span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <p className="text-xs text-gray-600 font-medium">Collection Rate</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{collectionRate}%</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-blue-50 rounded-lg border border-blue-200"
            >
              <p className="text-xs text-blue-600 font-medium">Performance Level</p>
              <motion.span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 mt-1">
                <MdCheckCircle size={16} />
                Excellent
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ManagerDetailPage;