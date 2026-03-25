// src/app/member/balance/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCreditCard, FiTrendingUp, FiTrendingDown, FiArrowUpRight, FiArrowDownLeft, FiCalendar } from 'react-icons/fi';
import { MdChevronLeft, MdChevronRight, MdFileDownload } from 'react-icons/md';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface Transaction {
    date: string;
    type: 'deposit' | 'expense';
    amount: number;
    description: string;
    balance: number;
}

interface MonthlyData {
    month: string;
    deposit: number;
    expense: number;
}

const BalancePage: React.FC = () => {
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [mealStorage, setMealStorage] = useState<any>({});

    const totalDeposit = 50000;

    useEffect(() => {
        setIsMounted(true);
        const savedMeals = localStorage.getItem('mealData');
        if (savedMeals) {
            try {
                setMealStorage(JSON.parse(savedMeals));
            } catch (error) {
                console.error('Failed to load meal data:', error);
            }
        }
    }, []);

    const handlePrevMonth = (): void => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        setCurrentMonth(newDate);
    };

    const handleNextMonth = (): void => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        setCurrentMonth(newDate);
    };

    // Calculate expenses for current month
    const calculateMonthExpense = (): number => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const lastDay = new Date(year, month + 1, 0).getDate();

        let totalExpense = 0;
        for (let i = 1; i <= lastDay; i++) {
            const date = new Date(year, month, i);
            const dateString = date.toISOString().split('T')[0];
            const mealData = mealStorage[dateString];
            
            if (mealData) {
                const mealCount = (mealData.breakfast ? 1 : 0) + (mealData.lunch ? 1 : 0) + (mealData.dinner ? 1 : 0);
                totalExpense += mealCount * 750;
            }
        }
        return totalExpense;
    };

    // Generate all transactions for current month
    const generateTransactions = (): Transaction[] => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const lastDay = new Date(year, month + 1, 0).getDate();

        const transactions: Transaction[] = [];
        let runningBalance = totalDeposit;

        // Add initial deposit on first day of month
        transactions.push({
            date: new Date(year, month, 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            type: 'deposit',
            amount: totalDeposit,
            description: 'Monthly Deposit',
            balance: runningBalance,
        });

        // Add expenses for each day
        for (let i = 1; i <= lastDay; i++) {
            const date = new Date(year, month, i);
            const dateString = date.toISOString().split('T')[0];
            const mealData = mealStorage[dateString];
            
            if (mealData) {
                const mealCount = (mealData.breakfast ? 1 : 0) + (mealData.lunch ? 1 : 0) + (mealData.dinner ? 1 : 0);
                if (mealCount > 0) {
                    const cost = mealCount * 750;
                    runningBalance -= cost;
                    
                    const mealTypes = [];
                    if (mealData.breakfast) mealTypes.push('Breakfast');
                    if (mealData.lunch) mealTypes.push('Lunch');
                    if (mealData.dinner) mealTypes.push('Dinner');

                    transactions.push({
                        date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                        type: 'expense',
                        amount: cost,
                        description: `Meal - ${mealTypes.join(', ')}`,
                        balance: runningBalance,
                    });
                }
            }
        }

        return transactions;
    };

    // Generate monthly data for chart
    const generateMonthlyData = (): MonthlyData[] => {
        const months: MonthlyData[] = [];
        const currentDate = new Date();

        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const year = date.getFullYear();
            const month = date.getMonth();
            const lastDay = new Date(year, month + 1, 0).getDate();

            let expense = 0;
            for (let j = 1; j <= lastDay; j++) {
                const checkDate = new Date(year, month, j);
                const dateString = checkDate.toISOString().split('T')[0];
                const mealData = mealStorage[dateString];
                
                if (mealData) {
                    const mealCount = (mealData.breakfast ? 1 : 0) + (mealData.lunch ? 1 : 0) + (mealData.dinner ? 1 : 0);
                    expense += mealCount * 750;
                }
            }

            months.push({
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                deposit: totalDeposit,
                expense: expense,
            });
        }

        return months;
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
    const monthlyExpense = calculateMonthExpense();
    const remainingBalance = totalDeposit - monthlyExpense;
    const transactions = generateTransactions();
    const monthlyData = generateMonthlyData();
    const expensePercentage = (monthlyExpense / totalDeposit * 100).toFixed(1);

    const statCards = [
        {
            title: 'Total Deposit',
            value: totalDeposit.toLocaleString(),
            subtext: 'BDT',
            icon: FiCreditCard,
            color: 'from-emerald-500 to-teal-500',
            trend: 'Initial Balance',
            trendUp: true,
        },
        {
            title: 'Total Expense',
            value: monthlyExpense.toLocaleString(),
            subtext: 'BDT',
            icon: FiTrendingDown,
            color: 'from-red-500 to-orange-500',
            trend: `${expensePercentage}% of balance`,
            trendUp: false,
        },
        {
            title: 'Remaining Balance',
            value: remainingBalance.toLocaleString(),
            subtext: 'BDT',
            icon: FiArrowUpRight,
            color: remainingBalance >= 0 ? 'from-blue-500 to-cyan-500' : 'from-red-500 to-rose-500',
            trend: remainingBalance >= 0 ? 'Available' : 'Exceeded',
            trendUp: remainingBalance >= 0,
        },
        {
            title: 'Per Meal Cost',
            value: '750',
            subtext: 'BDT',
            icon: FiArrowDownLeft,
            color: 'from-purple-500 to-pink-500',
            trend: 'Fixed rate',
            trendUp: true,
        },
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-blue-50 pt-6 pb-20 px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="w-full max-w-full lg:max-w-7xl mx-auto">

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
                                My Balance 💰
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

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {statCards.map((stat, index) => {
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

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {/* Line Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Balance History</h2>
                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                Last 6 Months
                            </span>
                        </div>
                        <div className="w-full overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
                            <ResponsiveContainer width="100%" height={250} minWidth={300}>
                                <BarChart data={monthlyData} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="month" stroke="#6b7280" fontSize={10} />
                                    <YAxis stroke="#6b7280" fontSize={10} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                                        cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                    <Bar dataKey="deposit" fill="#10b981" radius={[8, 8, 0, 0]} name="Deposit" />
                                    <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} name="Expense" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Progress Circle */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Budget Usage</h2>
                        <div className="flex flex-col items-center justify-center">
                            <div className="relative w-40 h-40 sm:w-48 sm:h-48">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="45%"
                                        fill="none"
                                        stroke="#e5e7eb"
                                        strokeWidth="8"
                                    />
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="45%"
                                        fill="none"
                                        stroke={monthlyExpense > totalDeposit * 0.8 ? '#ef4444' : '#10b981'}
                                        strokeWidth="8"
                                        strokeDasharray={`${(monthlyExpense / totalDeposit) * 283} 283`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{expensePercentage}%</p>
                                    <p className="text-xs sm:text-sm text-gray-600">Used</p>
                                </div>
                            </div>
                            <div className="mt-6 w-full space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-600">Total Deposit</span>
                                    <span className="text-sm font-bold text-gray-900">{totalDeposit.toLocaleString()} ৳</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-600">Total Spent</span>
                                    <span className="text-sm font-bold text-red-600">{monthlyExpense.toLocaleString()} ৳</span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                    <span className="text-sm font-medium text-gray-600">Remaining</span>
                                    <span className={`text-sm font-bold ${remainingBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {remainingBalance.toLocaleString()} ৳
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Transactions Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                    <div className="border-b border-gray-200 p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                            Transactions - {monthName}
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-xs sm:text-sm">
                            <thead className="bg-gray-50">
                                <tr className="border-b border-gray-200">
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-gray-900">Date</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-gray-900">Description</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-right font-semibold text-gray-900">Amount</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-right font-semibold text-gray-900">Balance</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-center font-semibold text-gray-900">Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction, index) => (
                                    <motion.tr
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.02 }}
                                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900">
                                            {transaction.date}
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">
                                            {transaction.description}
                                        </td>
                                        <td className={`px-3 sm:px-6 py-3 sm:py-4 text-right font-bold ${
                                            transaction.type === 'deposit' ? 'text-emerald-600' : 'text-red-600'
                                        }`}>
                                            {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount.toLocaleString()} ৳
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-right font-bold text-gray-900">
                                            {transaction.balance.toLocaleString()} ৳
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                                            <div className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded text-xs font-semibold ${
                                                transaction.type === 'deposit'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {transaction.type === 'deposit' ? (
                                                    <FiArrowDownLeft size={14} className="flex-shrink-0" />
                                                ) : (
                                                    <FiArrowUpRight size={14} className="flex-shrink-0" />
                                                )}
                                                <span className="hidden sm:inline">{transaction.type === 'deposit' ? 'Deposit' : 'Expense'}</span>
                                                <span className="sm:hidden">{transaction.type === 'deposit' ? 'In' : 'Out'}</span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl sm:rounded-b-2xl">
                        <p className="text-xs sm:text-sm text-gray-600">
                            Total Transactions: <span className="font-bold text-gray-900">{transactions.length}</span>
                        </p>
                    </div>
                </motion.div>

                {/* Summary Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                >
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
                        <h3 className="text-base sm:text-lg font-bold mb-2">Income This Month</h3>
                        <p className="text-2xl sm:text-3xl font-bold mb-1">{totalDeposit.toLocaleString()}</p>
                        <p className="text-xs sm:text-sm opacity-90">Monthly deposit</p>
                    </div>

                    <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
                        <h3 className="text-base sm:text-lg font-bold mb-2">Expenses This Month</h3>
                        <p className="text-2xl sm:text-3xl font-bold mb-1">{monthlyExpense.toLocaleString()}</p>
                        <p className="text-xs sm:text-sm opacity-90">Total meals cost</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BalancePage;