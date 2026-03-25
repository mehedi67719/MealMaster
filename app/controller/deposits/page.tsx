'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdArrowBack, MdSearch, MdEdit, MdDelete, MdDownload, MdAdd, MdCheckCircle, MdPending, MdTrendingUp, MdCalendarToday, MdAccountBalance, MdPerson } from 'react-icons/md';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Deposit {
  id: number;
  memberName: string;
  amount: number;
  date: string;
  time: string;
  paymentMethod: 'cash' | 'bkash' | 'nagad' | 'rocket';
  transactionId?: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  balance: number;
}

const ControllerDepositsPage = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([
    { id: 1, memberName: 'Mehedi Hassan', amount: 5000, date: '2024-03-31', time: '10:30 AM', paymentMethod: 'bkash', transactionId: 'BKL123456', status: 'completed', description: 'Monthly payment', balance: 5000 },
    { id: 2, memberName: 'Rahim Khan', amount: 3000, date: '2024-03-31', time: '11:15 AM', paymentMethod: 'nagad', transactionId: 'NGD789012', status: 'completed', description: 'Meal & Bazaar', balance: 3000 },
    { id: 3, memberName: 'Sajid Ali', amount: 4500, date: '2024-03-30', time: '09:30 AM', paymentMethod: 'cash', status: 'completed', description: 'Full payment', balance: 4500 },
    { id: 4, memberName: 'Karim Ahmad', amount: 2000, date: '2024-03-30', time: '02:45 PM', paymentMethod: 'rocket', transactionId: 'RKT345678', status: 'completed', description: 'Partial payment', balance: 2000 },
    { id: 5, memberName: 'Sofia Khan', amount: 6000, date: '2024-03-29', time: '08:00 AM', paymentMethod: 'bkash', transactionId: 'BKL456789', status: 'completed', description: 'Membership + Deposit', balance: 6000 },
    { id: 6, memberName: 'Ali Rahman', amount: 3500, date: '2024-03-29', time: '03:30 PM', paymentMethod: 'nagad', transactionId: 'NGD890123', status: 'pending', description: 'Pending verification', balance: 0 },
    { id: 7, memberName: 'Fatima Khan', amount: 5500, date: '2024-03-28', time: '10:00 AM', paymentMethod: 'cash', status: 'completed', description: 'Month deposit', balance: 5500 },
    { id: 8, memberName: 'Ahmed Hassan', amount: 4000, date: '2024-03-28', time: '12:30 PM', paymentMethod: 'bkash', transactionId: 'BKL567890', status: 'completed', description: 'Payment received', balance: 4000 },
    { id: 9, memberName: 'Jamal Ali', amount: 2500, date: '2024-03-27', time: '01:00 PM', paymentMethod: 'rocket', transactionId: 'RKT456123', status: 'failed', description: 'Transaction failed', balance: 0 },
    { id: 10, memberName: 'Noor Hassan', amount: 3200, date: '2024-03-27', time: '04:15 PM', paymentMethod: 'nagad', transactionId: 'NGD123890', status: 'completed', description: 'Regular deposit', balance: 3200 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<'all' | 'cash' | 'bkash' | 'nagad' | 'rocket'>('all');
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [newMemberName, setNewMemberName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newPaymentMethod, setNewPaymentMethod] = useState<'cash' | 'bkash' | 'nagad' | 'rocket'>('cash');

  const filteredDeposits = deposits.filter(deposit => {
    const matchesSearch = deposit.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deposit.transactionId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || deposit.status === filterStatus;
    const matchesMethod = filterPaymentMethod === 'all' || deposit.paymentMethod === filterPaymentMethod;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleAddDeposit = () => {
    if (newMemberName && newAmount) {
      const newDeposit: Deposit = {
        id: Math.max(...deposits.map(d => d.id), 0) + 1,
        memberName: newMemberName,
        amount: parseInt(newAmount),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        paymentMethod: newPaymentMethod,
        status: 'completed',
        description: 'New deposit',
        balance: parseInt(newAmount),
      };
      setDeposits([newDeposit, ...deposits]);
      setNewMemberName('');
      setNewAmount('');
      setNewPaymentMethod('cash');
      setShowModal(false);
      showNotification('Deposit added successfully', 'success');
    }
  };

  const handleDeleteDeposit = (id: number) => {
    setDeposits(deposits.filter(d => d.id !== id));
    showNotification('Deposit deleted', 'success');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash':
        return 'bg-blue-100 text-blue-700';
      case 'bkash':
        return 'bg-orange-100 text-orange-700';
      case 'nagad':
        return 'bg-red-100 text-red-700';
      case 'rocket':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentMethodEmoji = (method: string) => {
    switch (method) {
      case 'cash':
        return '💵';
      case 'bkash':
        return '🟠';
      case 'nagad':
        return '🔴';
      case 'rocket':
        return '🟣';
      default:
        return '💳';
    }
  };

  const totalDeposits = filteredDeposits.reduce((sum, d) => sum + d.amount, 0);
  const completedDeposits = deposits.filter(d => d.status === 'completed').length;
  const pendingDeposits = deposits.filter(d => d.status === 'pending').length;
  const totalBalance = deposits.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.balance, 0);

  // Daily deposits data
  const dailyData: { [key: string]: number } = {};
  deposits.forEach(deposit => {
    if (deposit.status === 'completed') {
      dailyData[deposit.date] = (dailyData[deposit.date] || 0) + deposit.amount;
    }
  });

  const sortedDates = Object.keys(dailyData).sort();
  const chartDates = sortedDates.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  const chartAmounts = sortedDates.map(date => dailyData[date]);

  const chartOptions: any = {
    chart: {
      type: 'bar',
      toolbar: { show: true },
      animations: { enabled: true, speed: 800 },
    },
    colors: ['#10b981'],
    xaxis: {
      categories: chartDates,
      title: { text: 'Date' },
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

  const chartSeries = [{ name: 'Daily Deposits', data: chartAmounts }];

  const paymentMethodBreakdown = {
    cash: deposits.filter(d => d.paymentMethod === 'cash' && d.status === 'completed').reduce((sum, d) => sum + d.amount, 0),
    bkash: deposits.filter(d => d.paymentMethod === 'bkash' && d.status === 'completed').reduce((sum, d) => sum + d.amount, 0),
    nagad: deposits.filter(d => d.paymentMethod === 'nagad' && d.status === 'completed').reduce((sum, d) => sum + d.amount, 0),
    rocket: deposits.filter(d => d.paymentMethod === 'rocket' && d.status === 'completed').reduce((sum, d) => sum + d.amount, 0),
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 pb-12">
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">💰 Deposits</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Track member deposits and payments</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all text-sm font-medium"
          >
            <MdAdd size={18} />
            Add Deposit
          </motion.button>
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
            className="bg-white rounded-xl p-4 md:p-5 shadow-md border-l-4 border-green-500"
          >
            <p className="text-gray-500 text-xs md:text-sm font-medium">Total Deposits</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-3xl font-bold text-green-600 mt-2"
            >
              ৳{totalBalance}
            </motion.p>
            <p className="text-xs text-gray-400 mt-2">Completed deposits</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-4 md:p-5 shadow-md border-l-4 border-blue-500"
          >
            <p className="text-gray-500 text-xs md:text-sm font-medium">Completed</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-2xl md:text-3xl font-bold text-blue-600 mt-2"
            >
              {completedDeposits}
            </motion.p>
            <p className="text-xs text-gray-400 mt-2">Transactions</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-4 md:p-5 shadow-md border-l-4 border-yellow-500"
          >
            <p className="text-gray-500 text-xs md:text-sm font-medium">Pending</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-bold text-yellow-600 mt-2"
            >
              {pendingDeposits}
            </motion.p>
            <p className="text-xs text-gray-400 mt-2">Awaiting verification</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-4 md:p-5 shadow-md border-l-4 border-purple-500"
          >
            <p className="text-gray-500 text-xs md:text-sm font-medium">Total Members</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-2xl md:text-3xl font-bold text-purple-600 mt-2"
            >
              {new Set(deposits.map(d => d.memberName)).size}
            </motion.p>
            <p className="text-xs text-gray-400 mt-2">With deposits</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Daily Deposits Trend</h2>
          <div className="h-80">
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height="100%"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <motion.div
            whileHover={{ y: -3 }}
            className="p-4 sm:p-6 bg-blue-50 border border-blue-200 rounded-xl text-center"
          >
            <p className="text-3xl font-bold text-blue-600 mb-2">💵</p>
            <p className="text-sm font-semibold text-gray-900">Cash</p>
            <p className="text-lg font-bold text-blue-600 mt-2">৳{paymentMethodBreakdown.cash}</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="p-4 sm:p-6 bg-orange-50 border border-orange-200 rounded-xl text-center"
          >
            <p className="text-3xl font-bold text-orange-600 mb-2">🟠</p>
            <p className="text-sm font-semibold text-gray-900">Bkash</p>
            <p className="text-lg font-bold text-orange-600 mt-2">৳{paymentMethodBreakdown.bkash}</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="p-4 sm:p-6 bg-red-50 border border-red-200 rounded-xl text-center"
          >
            <p className="text-3xl font-bold text-red-600 mb-2">🔴</p>
            <p className="text-sm font-semibold text-gray-900">Nagad</p>
            <p className="text-lg font-bold text-red-600 mt-2">৳{paymentMethodBreakdown.nagad}</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="p-4 sm:p-6 bg-purple-50 border border-purple-200 rounded-xl text-center"
          >
            <p className="text-3xl font-bold text-purple-600 mb-2">🟣</p>
            <p className="text-sm font-semibold text-gray-900">Rocket</p>
            <p className="text-lg font-bold text-purple-600 mt-2">৳{paymentMethodBreakdown.rocket}</p>
          </motion.div>
        </motion.div>

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
              placeholder="Search by member name or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          >
            <option value="all">All Status</option>
            <option value="completed">✅ Completed</option>
            <option value="pending">⏳ Pending</option>
            <option value="failed">❌ Failed</option>
          </select>

          <select
            value={filterPaymentMethod}
            onChange={(e) => setFilterPaymentMethod(e.target.value as any)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          >
            <option value="all">All Methods</option>
            <option value="cash">💵 Cash</option>
            <option value="bkash">🟠 Bkash</option>
            <option value="nagad">🔴 Nagad</option>
            <option value="rocket">🟣 Rocket</option>
          </select>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">📋 All Deposits ({filteredDeposits.length})</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all text-sm"
            >
              <MdDownload size={18} />
              Export
            </motion.button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Member</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase hidden md:table-cell">Date</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase hidden sm:table-cell">Method</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredDeposits.length > 0 ? (
                    filteredDeposits.map((deposit, idx) => (
                      <motion.tr
                        key={deposit.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: idx * 0.03 }}
                        whileHover={{ backgroundColor: '#f9fafb' }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{deposit.memberName}</p>
                            <p className="text-xs text-gray-500">{deposit.time}</p>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            className="text-lg font-bold text-green-600"
                          >
                            ৳{deposit.amount}
                          </motion.span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell text-sm text-gray-600">
                          {new Date(deposit.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getPaymentMethodColor(deposit.paymentMethod)}`}
                          >
                            {getPaymentMethodEmoji(deposit.paymentMethod)} {deposit.paymentMethod.toUpperCase()}
                          </motion.span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(deposit.status)}`}
                          >
                            {deposit.status === 'completed' && <MdCheckCircle size={14} />}
                            {deposit.status === 'pending' && <MdPending size={14} />}
                            {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                          </motion.span>
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
                              onClick={() => handleDeleteDeposit(deposit.id)}
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
                      <td colSpan={6} className="px-4 sm:px-6 py-12 text-center">
                        <MdAccountBalance size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 text-lg">No deposits found</p>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Add Deposit Modal */}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Deposit</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Member Name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="number"
                  placeholder="Amount (৳)"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <select
                  value={newPaymentMethod}
                  onChange={(e) => setNewPaymentMethod(e.target.value as any)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="cash">💵 Cash</option>
                  <option value="bkash">🟠 Bkash</option>
                  <option value="nagad">🔴 Nagad</option>
                  <option value="rocket">🟣 Rocket</option>
                </select>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddDeposit}
                    className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
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

export default ControllerDepositsPage;