'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdArrowBack, MdSearch, MdDownload, MdPrint, MdCalendarToday, MdTrendingUp, MdBarChart, MdPieChart, MdFileDownload, MdRefresh, MdCheckCircle, MdPending, MdError } from 'react-icons/md';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface DailyData {
  date: string;
  day: string;
  totalBazaar: number;
  totalMeals: number;
  totalDeposits: number;
  transactionCount: number;
  activeMembers: number;
}

interface Report {
  id: number;
  type: 'daily' | 'member_summary' | 'bazaar_summary' | 'meal_summary' | 'deposit_summary' | 'balance_sheet';
  title: string;
  description: string;
  date: string;
  dataPoints: number;
  status: 'completed' | 'pending' | 'error';
}

const ControllerReportsPage = () => {
  const today = new Date().toISOString().split('T')[0];
  const todayDate = new Date(today);
  const dayName = todayDate.toLocaleDateString('en-US', { weekday: 'long' });

  const [selectedReport, setSelectedReport] = useState<'daily' | 'member' | 'bazaar' | 'meal' | 'deposit' | 'balance'>('daily');
  const [searchQuery, setSearchQuery] = useState('');

  const dailyData: DailyData = {
    date: today,
    day: dayName,
    totalBazaar: 2450,
    totalMeals: 45,
    totalDeposits: 18500,
    transactionCount: 28,
    activeMembers: 12,
  };

  const reports: Report[] = [
    {
      id: 1,
      type: 'daily',
      title: `Daily Report - ${dayName}, ${new Date(today).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      description: 'Today\'s complete transaction summary',
      date: today,
      dataPoints: 28,
      status: 'completed',
    },
    {
      id: 2,
      type: 'bazaar_summary',
      title: 'Today\'s Bazaar Summary',
      description: 'All bazaar entries and expenses for today',
      date: today,
      dataPoints: 12,
      status: 'completed',
    },
    {
      id: 3,
      type: 'meal_summary',
      title: 'Today\'s Meal Summary',
      description: 'All meal entries and consumption data',
      date: today,
      dataPoints: 45,
      status: 'completed',
    },
    {
      id: 4,
      type: 'deposit_summary',
      title: 'Today\'s Deposit Summary',
      description: 'All deposits and payments received',
      date: today,
      dataPoints: 8,
      status: 'completed',
    },
    {
      id: 5,
      type: 'member_summary',
      title: 'Member Account Status',
      description: 'Current balance and account summary for all members',
      date: today,
      dataPoints: 12,
      status: 'completed',
    },
    {
      id: 6,
      type: 'balance_sheet',
      title: 'Daily Balance Sheet',
      description: 'Complete financial summary for today',
      date: today,
      dataPoints: 1,
      status: 'completed',
    },
  ];

  // Sample data for different reports
  const memberSummary = [
    { name: 'Mehedi Hassan', meals: 2, balance: -418, deposit: 0 },
    { name: 'Rahim Khan', meals: 3, balance: -122, deposit: 5000 },
    { name: 'Sajid Ali', meals: 1, balance: 184, deposit: 0 },
    { name: 'Karim Ahmad', meals: 2, balance: 0, deposit: 0 },
    { name: 'Sofia Khan', meals: 0, balance: 0, deposit: 0 },
    { name: 'Ali Rahman', meals: 3, balance: 150, deposit: 3500 },
    { name: 'Fatima Khan', meals: 4, balance: 200, deposit: 5500 },
    { name: 'Ahmed Hassan', meals: 2, balance: 300, deposit: 4000 },
    { name: 'Jamal Ali', meals: 1, balance: -250, deposit: 0 },
    { name: 'Noor Hassan', meals: 3, balance: 100, deposit: 3200 },
  ];

  const bazaarSummary = [
    { itemName: 'গরু মাংস', amount: 450, quantity: 1 },
    { itemName: 'মুরগি', amount: 320, quantity: 1 },
    { itemName: 'মাছ', amount: 380, quantity: 0.5 },
    { itemName: 'আলু', amount: 280, quantity: 10 },
    { itemName: 'পেঁয়াজ', amount: 360, quantity: 8 },
    { itemName: 'রসুন', amount: 240, quantity: 2 },
    { itemName: 'চাল', amount: 1100, quantity: 20 },
  ];

  const mealData = memberSummary.map(m => m.meals);
  const memberNames = memberSummary.map(m => m.name.split(' ')[0]);

  const mealChartOptions: any = {
    chart: {
      type: 'bar',
      toolbar: { show: true },
      animations: { enabled: true, speed: 800 },
    },
    colors: ['#3b82f6'],
    xaxis: {
      categories: memberNames,
    },
    yaxis: { title: { text: 'Number of Meals' } },
    plotOptions: {
      bar: { columnWidth: '70%', borderRadius: 4 },
    },
    tooltip: {
      theme: 'light',
      y: { formatter: (val: number) => val + ' meals' },
    },
  };

  const mealChartSeries = [{ name: 'Meals', data: mealData }];

  const bazaarChartOptions: any = {
    chart: {
      type: 'pie',
      toolbar: { show: true },
    },
    colors: ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'],
    labels: bazaarSummary.map(b => b.itemName),
    tooltip: {
      theme: 'light',
      y: { formatter: (val: number) => '৳' + val.toLocaleString() },
    },
  };

  const bazaarChartSeries = bazaarSummary.map(b => b.amount);

  const balanceChartOptions: any = {
    chart: {
      type: 'bar',
      toolbar: { show: true },
    },
    colors: ['#10b981'],
    xaxis: {
      categories: memberSummary.map(m => m.name.split(' ')[0]),
    },
    yaxis: { title: { text: 'Balance (৳)' } },
    plotOptions: {
      bar: { columnWidth: '70%', borderRadius: 4, dataLabels: { position: 'top' } },
    },
    tooltip: {
      theme: 'light',
      y: { formatter: (val: number) => '৳' + val.toLocaleString() },
    },
  };

  const balanceChartSeries = [{ name: 'Balance', data: memberSummary.map(m => m.balance) }];

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-6 sm:pt-8 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">📊 Daily Reports</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{dayName}, {new Date(today).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-sm font-medium"
          >
            <MdRefresh size={18} />
            Refresh
          </motion.button>
        </motion.div>

        {/* Daily Summary Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-8"
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
              ৳{dailyData.totalBazaar}
            </motion.p>
            <p className="text-xs text-gray-400 mt-2">{dailyData.totalBazaar / 200}টি আইটেম</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-4 md:p-5 shadow-md border-l-4 border-green-500"
          >
            <p className="text-gray-500 text-xs md:text-sm font-medium">Total Meals</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-2xl md:text-3xl font-bold text-green-600 mt-2"
            >
              {dailyData.totalMeals}
            </motion.p>
            <p className="text-xs text-gray-400 mt-2">মিল এন্ট্রি</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-4 md:p-5 shadow-md border-l-4 border-blue-500"
          >
            <p className="text-gray-500 text-xs md:text-sm font-medium">Total Deposits</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-bold text-blue-600 mt-2"
            >
              ৳{dailyData.totalDeposits}
            </motion.p>
            <p className="text-xs text-gray-400 mt-2">{Math.floor(dailyData.totalDeposits / 1000)}টি ডিপোজিট</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-4 md:p-5 shadow-md border-l-4 border-purple-500"
          >
            <p className="text-gray-500 text-xs md:text-sm font-medium">Transactions</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-2xl md:text-3xl font-bold text-purple-600 mt-2"
            >
              {dailyData.transactionCount}
            </motion.p>
            <p className="text-xs text-gray-400 mt-2">মোট লেনদেন</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-4 md:p-5 shadow-md border-l-4 border-pink-500"
          >
            <p className="text-gray-500 text-xs md:text-sm font-medium">Active Members</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-bold text-pink-600 mt-2"
            >
              {dailyData.activeMembers}
            </motion.p>
            <p className="text-xs text-gray-400 mt-2">সক্রিয় সদস্য</p>
          </motion.div>
        </motion.div>

        {/* Report Selection Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2"
        >
          {[
            { id: 'daily', label: '📋 Daily Summary' },
            { id: 'member', label: '👥 Member Summary' },
            { id: 'bazaar', label: '🛒 Bazaar Summary' },
            { id: 'meal', label: '🍽️ Meal Summary' },
            { id: 'deposit', label: '💰 Deposit Summary' },
            { id: 'balance', label: '⚖️ Balance Sheet' },
          ].map(tab => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedReport(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                selectedReport === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Report Content */}
        <AnimatePresence mode="wait">
          {selectedReport === 'daily' && (
            <motion.div
              key="daily"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Daily Summary Report</h2>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                  >
                    <MdDownload size={18} />
                    PDF
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                  >
                    <MdDownload size={18} />
                    Excel
                  </motion.button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 font-medium">তারিখ</p>
                  <p className="text-lg font-bold text-gray-900">{new Date(today).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 font-medium">দিন</p>
                  <p className="text-lg font-bold text-gray-900">{dayName}</p>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-gray-600 font-medium">মোট বাজার খরচ</p>
                  <p className="text-lg font-bold text-orange-600">৳{dailyData.totalBazaar}</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-gray-600 font-medium">মোট মিল</p>
                  <p className="text-lg font-bold text-green-600">{dailyData.totalMeals}</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-gray-600 font-medium">মোট ডিপোজিট</p>
                  <p className="text-lg font-bold text-blue-600">৳{dailyData.totalDeposits}</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-gray-600 font-medium">লেনদেন সংখ্যা</p>
                  <p className="text-lg font-bold text-purple-600">{dailyData.transactionCount}</p>
                </div>
              </div>
            </motion.div>
          )}

          {selectedReport === 'meal' && (
            <motion.div
              key="meal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Today's Meal Summary</h2>
              <div className="h-80 mb-8">
                <Chart
                  options={mealChartOptions}
                  series={mealChartSeries}
                  type="bar"
                  height="100%"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Member</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Meals Today</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {memberSummary.map((member, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{member.name}</td>
                        <td className="px-4 py-3 text-sm font-bold text-blue-600">{member.meals}</td>
                        <td className="px-4 py-3 text-sm font-bold">
                          <span className={member.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                            ৳{member.balance}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {selectedReport === 'bazaar' && (
            <motion.div
              key="bazaar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Today's Bazaar Summary</h2>
              <div className="h-80 mb-8">
                <Chart
                  options={bazaarChartOptions}
                  series={bazaarChartSeries}
                  type="pie"
                  height="100%"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Item</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {bazaarSummary.map((item, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.itemName}</td>
                        <td className="px-4 py-3 text-sm font-bold text-orange-600">৳{item.amount}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.quantity}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {selectedReport === 'member' && (
            <motion.div
              key="member"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Member Account Summary</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Member</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Meals</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Deposit</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {memberSummary.map((member, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{member.name}</td>
                        <td className="px-4 py-3 text-sm text-blue-600 font-bold">{member.meals}</td>
                        <td className="px-4 py-3 text-sm text-green-600 font-bold">৳{member.deposit}</td>
                        <td className="px-4 py-3 text-sm font-bold">
                          <span className={member.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                            ৳{member.balance}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {selectedReport === 'balance' && (
            <motion.div
              key="balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Balance Sheet</h2>
              <div className="h-80 mb-8">
                <Chart
                  options={balanceChartOptions}
                  series={balanceChartSeries}
                  type="bar"
                  height="100%"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-gray-600 font-medium">Total Positive Balance</p>
                  <p className="text-2xl font-bold text-green-600">
                    ৳{memberSummary.filter(m => m.balance > 0).reduce((sum, m) => sum + m.balance, 0)}
                  </p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-gray-600 font-medium">Total Negative Balance</p>
                  <p className="text-2xl font-bold text-red-600">
                    ৳{Math.abs(memberSummary.filter(m => m.balance < 0).reduce((sum, m) => sum + m.balance, 0))}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-gray-600 font-medium">Net Balance</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ৳{memberSummary.reduce((sum, m) => sum + m.balance, 0)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {selectedReport === 'deposit' && (
            <motion.div
              key="deposit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Today's Deposit Summary</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-gray-600 font-medium">Total Deposits</p>
                  <p className="text-2xl font-bold text-green-600">৳{dailyData.totalDeposits}</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-gray-600 font-medium">Number of Deposits</p>
                  <p className="text-2xl font-bold text-blue-600">{memberSummary.filter(m => m.deposit > 0).length}</p>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-gray-600 font-medium">Average Deposit</p>
                  <p className="text-2xl font-bold text-orange-600">
                    ৳{memberSummary.filter(m => m.deposit > 0).length > 0 ? Math.round(dailyData.totalDeposits / memberSummary.filter(m => m.deposit > 0).length) : 0}
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Member</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Deposit Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {memberSummary.filter(m => m.deposit > 0).map((member, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{member.name}</td>
                        <td className="px-4 py-3 text-sm font-bold text-green-600">৳{member.deposit}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            <MdCheckCircle size={14} />
                            Completed
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ControllerReportsPage;