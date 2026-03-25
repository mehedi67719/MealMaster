// src/app/member/history/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiCheckCircle, FiAlertCircle, FiSearch, FiFilter } from 'react-icons/fi';
import { MdChevronLeft, MdChevronRight, MdFileDownload } from 'react-icons/md';

interface HistoryItem {
    date: string;
    day: string;
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    totalMeals: number;
    cost: number;
}

const HistoryPage: React.FC = () => {
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [mealStorage, setMealStorage] = useState<any>({});
    const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterType, setFilterType] = useState<string>('all');

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

    useEffect(() => {
        if (isMounted) {
            generateHistory();
        }
    }, [currentMonth, isMounted, mealStorage]);

    const generateHistory = (): void => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const lastDay = new Date(year, month + 1, 0).getDate();

        const history: HistoryItem[] = [];

        for (let i = lastDay; i >= 1; i--) {
            const date = new Date(year, month, i);
            const dateString = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

            const mealData = mealStorage[dateString];
            const breakfast = mealData?.breakfast ?? false;
            const lunch = mealData?.lunch ?? false;
            const dinner = mealData?.dinner ?? false;
            const totalMeals = (breakfast ? 1 : 0) + (lunch ? 1 : 0) + (dinner ? 1 : 0);
            const cost = totalMeals * 750;

            history.push({
                date: formattedDate,
                day: dayName,
                breakfast,
                lunch,
                dinner,
                totalMeals,
                cost,
            });
        }

        setHistoryData(history);
    };

    const handlePrevMonth = (): void => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        setCurrentMonth(newDate);
    };

    const handleNextMonth = (): void => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        setCurrentMonth(newDate);
    };

    // Filter and search logic
    const filteredData = historyData.filter((item) => {
        const matchesSearch = item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.day.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filterType === 'all') return matchesSearch;
        if (filterType === 'active') return matchesSearch && item.totalMeals > 0;
        if (filterType === 'inactive') return matchesSearch && item.totalMeals === 0;
        return matchesSearch;
    });

    // Statistics
    const totalDays = historyData.length;
    const activeDays = historyData.filter(item => item.totalMeals > 0).length;
    const inactiveDays = totalDays - activeDays;
    const totalMeals = historyData.reduce((sum, item) => sum + item.totalMeals, 0);
    const totalCost = historyData.reduce((sum, item) => sum + item.cost, 0);

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
                                Meal History 📋
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

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 text-center hover:shadow-lg transition-all"
                    >
                        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Days</p>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalDays}</p>
                        <p className="text-xs text-gray-500 mt-1">in {monthName.split(' ')[0]}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 text-center hover:shadow-lg transition-all"
                    >
                        <p className="text-xs sm:text-sm font-medium text-emerald-600 mb-1">Active Days</p>
                        <p className="text-2xl sm:text-3xl font-bold text-emerald-600">{activeDays}</p>
                        <p className="text-xs text-gray-500 mt-1">with meals</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 text-center hover:shadow-lg transition-all"
                    >
                        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Meals</p>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalMeals}</p>
                        <p className="text-xs text-gray-500 mt-1">this month</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 text-center hover:shadow-lg transition-all"
                    >
                        <p className="text-xs sm:text-sm font-medium text-red-600 mb-1">Total Cost</p>
                        <p className="text-2xl sm:text-3xl font-bold text-red-600">{(totalCost / 1000).toFixed(1)}k</p>
                        <p className="text-xs text-gray-500 mt-1">BDT spent</p>
                    </motion.div>
                </div>

                {/* Search and Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6 shadow-sm hover:shadow-xl transition-all"
                >
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        {/* Search Box */}
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by date or day..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                            />
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterType('all')}
                                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                                    filterType === 'all'
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterType('active')}
                                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                                    filterType === 'active'
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => setFilterType('inactive')}
                                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                                    filterType === 'inactive'
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Inactive
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* History List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-3"
                >
                    {filteredData.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center justify-between gap-3 sm:gap-4">
                                {/* Date and Day */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm sm:text-base font-semibold text-gray-900">{item.date}</p>
                                    <p className="text-xs sm:text-sm text-gray-600">{item.day}</p>
                                </div>

                                {/* Meals Status */}
                                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold ${
                                        item.breakfast
                                            ? 'bg-orange-100 text-orange-700'
                                            : 'bg-gray-100 text-gray-400'
                                    }`} title="Breakfast">
                                        B
                                    </div>
                                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold ${
                                        item.lunch
                                            ? 'bg-cyan-100 text-cyan-700'
                                            : 'bg-gray-100 text-gray-400'
                                    }`} title="Lunch">
                                        L
                                    </div>
                                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold ${
                                        item.dinner
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-gray-100 text-gray-400'
                                    }`} title="Dinner">
                                        D
                                    </div>
                                </div>

                                {/* Total Meals and Cost */}
                                <div className="text-right flex-shrink-0">
                                    <div className={`inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-lg ${
                                        item.totalMeals === 3 ? 'bg-emerald-100 text-emerald-700' :
                                        item.totalMeals === 2 ? 'bg-blue-100 text-blue-700' :
                                        item.totalMeals === 1 ? 'bg-orange-100 text-orange-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {item.totalMeals === 0 ? (
                                            <FiAlertCircle size={14} />
                                        ) : (
                                            <FiCheckCircle size={14} />
                                        )}
                                        <span className="text-xs sm:text-sm font-bold">{item.totalMeals} meals</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-red-600 font-bold mt-1">{item.cost.toLocaleString()} ৳</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {filteredData.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-8 text-center"
                        >
                            <FiAlertCircle size={40} className="mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-600">No records found</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">Try adjusting your search or filter</p>
                        </motion.div>
                    )}
                </motion.div>

                {/* Summary Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl sm:rounded-2xl border border-emerald-200 p-4 sm:p-6"
                >
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Summary</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Total Days</p>
                            <p className="text-lg sm:text-xl font-bold text-gray-900">{totalDays}</p>
                        </div>
                        <div>
                            <p className="text-xs text-emerald-600 mb-1">Active Days</p>
                            <p className="text-lg sm:text-xl font-bold text-emerald-600">{activeDays}</p>
                        </div>
                        <div>
                            <p className="text-xs text-red-600 mb-1">Inactive Days</p>
                            <p className="text-lg sm:text-xl font-bold text-red-600">{inactiveDays}</p>
                        </div>
                        <div>
                            <p className="text-xs text-blue-600 mb-1">Avg Per Day</p>
                            <p className="text-lg sm:text-xl font-bold text-blue-600">{activeDays > 0 ? (totalMeals / activeDays).toFixed(1) : 0}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HistoryPage;