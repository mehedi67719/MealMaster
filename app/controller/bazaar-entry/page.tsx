'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdArrowBack, MdSearch, MdEdit, MdDelete, MdDownload, MdCalendarToday, MdShoppingCart, MdTrendingUp, MdCheckCircle, MdAdd, MdPerson } from 'react-icons/md';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface DailyEntry {
  date: string;
  day: string;
  amount: number;
  description: string;
  category: 'meat' | 'spice' | 'other';
  time: string;
}

interface ManagerData {
  managerId: number;
  managerName: string;
  email: string;
  phone: string;
  totalBazaar: number;
  totalEntries: number;
  averagePerEntry: number;
  mealCollectionRate: number;
  millRate: number;
  entries: DailyEntry[];
}

const managersData: { [key: number]: ManagerData } = {
  1: {
    managerId: 1,
    managerName: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    phone: '01700000001',
    totalBazaar: 9500,
    totalEntries: 32,
    averagePerEntry: 297,
    mealCollectionRate: 92,
    millRate: 156,
    entries: [
      { date: '2024-03-31', day: 'Sunday', amount: 320, description: 'গরু মাংস ও তরকারি', category: 'meat', time: '10:30 AM' },
      { date: '2024-03-31', day: 'Sunday', amount: 180, description: 'আলু, পেঁয়াজ, রসুন', category: 'spice', time: '11:15 AM' },
      { date: '2024-03-30', day: 'Saturday', amount: 290, description: 'মুরগি ও ডাল', category: 'meat', time: '09:30 AM' },
      { date: '2024-03-30', day: 'Saturday', amount: 150, description: 'বেগুন, টমেটো, আদা', category: 'other', time: '01:00 PM' },
      { date: '2024-03-29', day: 'Friday', amount: 420, description: 'মাছ ও ঝিনুক', category: 'meat', time: '08:00 AM' },
      { date: '2024-03-29', day: 'Friday', amount: 180, description: 'লবণ, চিনি, তেল', category: 'spice', time: '03:30 PM' },
      { date: '2024-03-28', day: 'Thursday', amount: 280, description: 'গরু মাংস', category: 'meat', time: '10:00 AM' },
      { date: '2024-03-28', day: 'Thursday', amount: 120, description: 'বিভিন্ন সবজি', category: 'other', time: '12:30 PM' },
      { date: '2024-03-27', day: 'Wednesday', amount: 350, description: 'মুরগি ও বড় মাছ', category: 'meat', time: '09:15 AM' },
      { date: '2024-03-27', day: 'Wednesday', amount: 200, description: 'রসুন, আদা, মশলা', category: 'spice', time: '02:45 PM' },
      { date: '2024-03-26', day: 'Tuesday', amount: 310, description: 'গরু মাংস ও চাল', category: 'meat', time: '08:30 AM' },
      { date: '2024-03-26', day: 'Tuesday', amount: 160, description: 'তেল, নুন, চিনি', category: 'spice', time: '11:00 AM' },
      { date: '2024-03-25', day: 'Monday', amount: 340, description: 'মাছ এবং চিংড়ি', category: 'meat', time: '10:30 AM' },
      { date: '2024-03-25', day: 'Monday', amount: 190, description: 'আলু, পেঁয়াজ, রসুন', category: 'spice', time: '11:15 AM' },
      { date: '2024-03-24', day: 'Sunday', amount: 380, description: 'মুরগি ও ডাল', category: 'meat', time: '09:30 AM' },
      { date: '2024-03-24', day: 'Sunday', amount: 170, description: 'বেগুন, টমেটো, আদা', category: 'other', time: '01:00 PM' },
      { date: '2024-03-23', day: 'Saturday', amount: 450, description: 'মাছ ও ঝিনুক', category: 'meat', time: '08:00 AM' },
      { date: '2024-03-23', day: 'Saturday', amount: 200, description: 'লবণ, চিনি, তেল', category: 'spice', time: '03:30 PM' },
      { date: '2024-03-22', day: 'Friday', amount: 320, description: 'গরু মাংস', category: 'meat', time: '10:00 AM' },
      { date: '2024-03-22', day: 'Friday', amount: 140, description: 'বিভিন্ন সবজি', category: 'other', time: '12:30 PM' },
    ],
  },
  2: {
    managerId: 2,
    managerName: 'Fatima Khan',
    email: 'fatima@example.com',
    phone: '01700000002',
    totalBazaar: 8200,
    totalEntries: 28,
    averagePerEntry: 293,
    mealCollectionRate: 88,
    millRate: 170,
    entries: [
      { date: '2024-03-31', day: 'Sunday', amount: 280, description: 'মশলা ও সয়া সস', category: 'spice', time: '02:45 PM' },
      { date: '2024-03-30', day: 'Saturday', amount: 240, description: 'বেগুন, টমেটো, আদা', category: 'other', time: '01:00 PM' },
      { date: '2024-03-29', day: 'Friday', amount: 290, description: 'বিভিন্ন ফল ও ডিম', category: 'other', time: '12:30 PM' },
      { date: '2024-03-28', day: 'Thursday', amount: 320, description: 'চাল, তেল, নুন', category: 'spice', time: '10:30 AM' },
      { date: '2024-03-27', day: 'Wednesday', amount: 350, description: 'আলু, পেঁয়াজ, পটোল', category: 'other', time: '09:00 AM' },
      { date: '2024-03-26', day: 'Tuesday', amount: 310, description: 'বিভিন্ন সবজি', category: 'other', time: '02:15 PM' },
      { date: '2024-03-25', day: 'Monday', amount: 370, description: 'মুরগি, ডিম, ডাল', category: 'meat', time: '11:30 AM' },
      { date: '2024-03-24', day: 'Sunday', amount: 250, description: 'রসুন, আদা, লবণ', category: 'spice', time: '03:00 PM' },
      { date: '2024-03-23', day: 'Saturday', amount: 420, description: 'মাছ এবং চিংড়ি', category: 'meat', time: '08:45 AM' },
      { date: '2024-03-22', day: 'Friday', amount: 320, description: 'বিভিন্ন সবজি ও ফল', category: 'other', time: '01:30 PM' },
    ],
  },
};

const ControllerBazaarPage = () => {
  const [selectedManagerId, setSelectedManagerId] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'meat' | 'spice' | 'other'>('all');
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [newAmount, setNewAmount] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<'meat' | 'spice' | 'other'>('other');

  const currentData = managersData[selectedManagerId];

  let filteredEntries = currentData.entries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || entry.category === filterCategory;
    const matchesDate = selectedDate === '' || entry.date === selectedDate;
    return matchesSearch && matchesCategory && matchesDate;
  });

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleAddEntry = () => {
    if (newAmount && newDescription) {
      showNotification('Bazaar entry added successfully', 'success');
      setNewAmount('');
      setNewDescription('');
      setNewCategory('other');
      setShowModal(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'meat':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'spice':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'meat':
        return '🍖';
      case 'spice':
        return '🌶️';
      default:
        return '📦';
    }
  };

  // Daily totals for selected date
  const dailyTotalForSelectedDate = selectedDate
    ? currentData.entries
        .filter(e => e.date === selectedDate)
        .reduce((sum, e) => sum + e.amount, 0)
    : 0;

  // Weekly data (last 7 days)
  const last7Days = currentData.entries.slice(-7);
  const weeklyDates = last7Days.map(e => e.day.substring(0, 3));
  const weeklyAmounts = last7Days.map(e => e.amount);

  // Weekly chart
  const weeklyChartOptions: any = {
    chart: {
      type: 'bar',
      toolbar: { show: true },
      animations: { enabled: true, speed: 800 },
    },
    colors: ['#3b82f6'],
    xaxis: {
      categories: weeklyDates,
      title: { text: 'Days' },
    },
    yaxis: { title: { text: 'Amount (৳)' } },
    plotOptions: {
      bar: { columnWidth: '60%', borderRadius: 4 },
    },
    dataLabels: { enabled: true, formatter: (val: number) => '৳' + val },
    tooltip: {
      theme: 'light',
      y: { formatter: (val: number) => '৳' + val.toLocaleString() },
    },
  };

  const weeklyChartSeries = [{ name: 'Daily Bazaar Cost', data: weeklyAmounts }];

  const categoryBreakdown = {
    meat: currentData.entries.filter(e => e.category === 'meat').reduce((sum, e) => sum + e.amount, 0),
    spice: currentData.entries.filter(e => e.category === 'spice').reduce((sum, e) => sum + e.amount, 0),
    other: currentData.entries.filter(e => e.category === 'other').reduce((sum, e) => sum + e.amount, 0),
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-12">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className={`fixed top-6 right-6 px-6 py-3 rounded-lg font-medium text-white shadow-lg z-50 ${
              showToast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {showToast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-6 sm:pt-8 pb-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Link href="/controller">
                <motion.button
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-all"
                >
                  <MdArrowBack size={24} className="text-gray-700" />
                </motion.button>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">🛒 Bazaar Entry</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Track bazaar expenses by manager and date</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-sm font-medium"
            >
              <MdAdd size={18} />
              Add Entry
            </motion.button>
          </div>

          {/* Manager & Date Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Manager</label>
              <select
                value={selectedManagerId}
                onChange={(e) => setSelectedManagerId(parseInt(e.target.value))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                {Object.values(managersData).map(manager => (
                  <option key={manager.managerId} value={manager.managerId}>
                    {manager.managerName} ({manager.email})
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date (Optional)</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Selected Date Info */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 sm:p-6 bg-blue-50 border border-blue-200 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">📅 {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                <p className="text-sm text-gray-600 mt-1">Total bazaar cost for this day</p>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold text-blue-600"
              >
                ৳{dailyTotalForSelectedDate}
              </motion.div>
            </div>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-4 md:p-5 shadow-md border-l-4 border-orange-500"
          >
            <p className="text-gray-500 text-xs md:text-sm font-medium">Total Bazaar</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-3xl font-bold text-orange-600 mt-2"
            >
              ৳{currentData.totalBazaar}
            </motion.p>
            <p className="text-xs text-gray-400 mt-2">{currentData.totalEntries} entries</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-4 md:p-5 shadow-md border-l-4 border-green-500"
          >
            <p className="text-gray-500 text-xs md:text-sm font-medium">Average Per Entry</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-2xl md:text-3xl font-bold text-green-600 mt-2"
            >
              ৳{currentData.averagePerEntry}
            </motion.p>
            <p className="text-xs text-gray-400 mt-2">Per bazaar</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-4 md:p-5 shadow-md border-l-4 border-blue-500"
          >
            <p className="text-gray-500 text-xs md:text-sm font-medium">Meal Collection</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-bold text-blue-600 mt-2"
            >
              {currentData.mealCollectionRate}%
            </motion.p>
            <p className="text-xs text-gray-400 mt-2">Collection rate</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-4 md:p-5 shadow-md border-l-4 border-purple-500"
          >
            <p className="text-gray-500 text-xs md:text-sm font-medium">Mill Rate</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-2xl md:text-3xl font-bold text-purple-600 mt-2"
            >
              ৳{currentData.millRate}
            </motion.p>
            <p className="text-xs text-gray-400 mt-2">Per meal</p>
          </motion.div>
        </motion.div>

        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Weekly Bazaar Trend (Last 7 Days)</h2>
          <div className="h-80">
            <Chart
              options={weeklyChartOptions}
              series={weeklyChartSeries}
              type="bar"
              height="100%"
            />
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <motion.div
            whileHover={{ y: -3 }}
            className="p-4 sm:p-6 bg-red-50 border border-red-200 rounded-xl"
          >
            <p className="text-3xl font-bold text-red-600 mb-2">🍖</p>
            <p className="text-sm font-semibold text-gray-900">Meat</p>
            <p className="text-lg font-bold text-red-600 mt-2">৳{categoryBreakdown.meat}</p>
            <p className="text-xs text-gray-600 mt-1">{Math.round((categoryBreakdown.meat / currentData.totalBazaar) * 100)}% of total</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="p-4 sm:p-6 bg-orange-50 border border-orange-200 rounded-xl"
          >
            <p className="text-3xl font-bold text-orange-600 mb-2">🌶️</p>
            <p className="text-sm font-semibold text-gray-900">Spice</p>
            <p className="text-lg font-bold text-orange-600 mt-2">৳{categoryBreakdown.spice}</p>
            <p className="text-xs text-gray-600 mt-1">{Math.round((categoryBreakdown.spice / currentData.totalBazaar) * 100)}% of total</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="p-4 sm:p-6 bg-gray-50 border border-gray-200 rounded-xl"
          >
            <p className="text-3xl font-bold text-gray-600 mb-2">📦</p>
            <p className="text-sm font-semibold text-gray-900">Other</p>
            <p className="text-lg font-bold text-gray-600 mt-2">৳{categoryBreakdown.other}</p>
            <p className="text-xs text-gray-600 mt-1">{Math.round((categoryBreakdown.other / currentData.totalBazaar) * 100)}% of total</p>
          </motion.div>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="meat">🍖 Meat</option>
            <option value="spice">🌶️ Spice</option>
            <option value="other">📦 Other</option>
          </select>
        </motion.div>

        {/* Entries Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">📋 All Entries ({filteredEntries.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Day</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Item</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase hidden md:table-cell">Category</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase hidden sm:table-cell">Time</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredEntries.length > 0 ? (
                    filteredEntries.map((entry, idx) => (
                      <motion.tr
                        key={entry.date + idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: idx * 0.03 }}
                        whileHover={{ backgroundColor: '#f9fafb' }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-gray-900">
                          {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 font-medium hidden sm:table-cell">
                          {entry.day}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-700">
                          <p className="font-medium line-clamp-1">{entry.description}</p>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(entry.category)}`}
                          >
                            {getCategoryEmoji(entry.category)} {entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}
                          </motion.span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            className="text-base sm:text-lg font-bold text-blue-600"
                          >
                            ৳{entry.amount}
                          </motion.span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 hidden sm:table-cell font-medium">
                          {entry.time}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                          <motion.div className="flex justify-end gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-1.5 sm:p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
                              title="Edit"
                            >
                              <MdEdit size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-1.5 sm:p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                              title="Delete"
                            >
                              <MdDelete size={16} />
                            </motion.button>
                          </motion.div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 sm:px-6 py-12 text-center">
                        <MdShoppingCart size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 text-lg">No entries found</p>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Add Entry Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Bazaar Entry</h2>
              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="Amount (৳)"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Description (e.g., গরু মাংস, তরকারি)"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="meat">🍖 Meat</option>
                  <option value="spice">🌶️ Spice</option>
                  <option value="other">📦 Other</option>
                </select>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddEntry}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                  >
                    Add
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-all"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ControllerBazaarPage;