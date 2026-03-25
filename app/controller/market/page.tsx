'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdArrowBack, MdSearch, MdEdit, MdDelete, MdDownload, MdAdd, MdTrendingUp, MdTrendingDown, MdCalendarToday, MdShoppingCart, MdAutoGraph } from 'react-icons/md';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface MarketItem {
  id: number;
  itemName: string;
  unit: string;
  currentPrice: number;
  previousPrice: number;
  date: string;
  source: string;
  category: 'meat' | 'vegetable' | 'spice' | 'rice' | 'oil' | 'other';
  quantity?: number;
  trend: number;
}

interface PriceHistory {
  date: string;
  price: number;
}

const ControllerMarketPage = () => {
  const [marketItems, setMarketItems] = useState<MarketItem[]>([
    { id: 1, itemName: 'গরু মাংস', unit: 'কেজি', currentPrice: 450, previousPrice: 420, date: '2024-03-31', source: 'গ্রামীণ বাজার', category: 'meat', quantity: 5, trend: 7 },
    { id: 2, itemName: 'মুরগি', unit: 'কেজি', currentPrice: 320, previousPrice: 310, date: '2024-03-31', source: 'খামার বাজার', category: 'meat', quantity: 3, trend: 3 },
    { id: 3, itemName: 'মাছ', unit: 'কেজি', currentPrice: 380, previousPrice: 390, date: '2024-03-31', source: 'নদী বাজার', category: 'meat', quantity: 2, trend: -3 },
    { id: 4, itemName: 'আলু', unit: 'কেজি', currentPrice: 28, previousPrice: 30, date: '2024-03-31', source: 'গ্রামীণ বাজার', category: 'vegetable', quantity: 10, trend: -7 },
    { id: 5, itemName: 'পেঁয়াজ', unit: 'কেজি', currentPrice: 45, previousPrice: 42, date: '2024-03-31', source: 'মিয��াটাউন', category: 'vegetable', quantity: 8, trend: 7 },
    { id: 6, itemName: 'রসুন', unit: 'কেজি', currentPrice: 120, previousPrice: 115, date: '2024-03-31', source: 'নয়াবাজার', category: 'vegetable', quantity: 2, trend: 4 },
    { id: 7, itemName: 'আদা', unit: 'কেজি', currentPrice: 80, previousPrice: 78, date: '2024-03-30', source: 'মিয়াটাউন', category: 'spice', quantity: 1, trend: 3 },
    { id: 8, itemName: 'মরিচ', unit: 'কেজি', currentPrice: 280, previousPrice: 275, date: '2024-03-30', source: 'নয়াবাজার', category: 'spice', quantity: 0.5, trend: 2 },
    { id: 9, itemName: 'হলুদ', unit: 'কেজি', currentPrice: 120, previousPrice: 125, date: '2024-03-29', source: 'গ্রামীণ বাজার', category: 'spice', quantity: 0.5, trend: -4 },
    { id: 10, itemName: 'চাল', unit: 'কেজি', currentPrice: 55, previousPrice: 52, date: '2024-03-31', source: 'মিল বাজার', category: 'rice', quantity: 20, trend: 6 },
    { id: 11, itemName: 'সয়াবিন তেল', unit: 'লিটার', currentPrice: 140, previousPrice: 135, date: '2024-03-31', source: 'ঘি দোকান', category: 'oil', quantity: 5, trend: 4 },
    { id: 12, itemName: 'ডাল', unit: 'কেজি', currentPrice: 95, previousPrice: 90, date: '2024-03-30', source: 'ডাল দোকান', category: 'other', quantity: 2, trend: 6 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'meat' | 'vegetable' | 'spice' | 'rice' | 'oil' | 'other'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'trend'>('name');
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newUnit, setNewUnit] = useState('কেজি');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState<'meat' | 'vegetable' | 'spice' | 'rice' | 'oil' | 'other'>('meat');
  const [newSource, setNewSource] = useState('');

  let filteredItems = marketItems.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (sortBy === 'price') {
    filteredItems.sort((a, b) => b.currentPrice - a.currentPrice);
  } else if (sortBy === 'trend') {
    filteredItems.sort((a, b) => b.trend - a.trend);
  }

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleAddItem = () => {
    if (newItemName && newPrice && newSource) {
      const newItem: MarketItem = {
        id: Math.max(...marketItems.map(i => i.id), 0) + 1,
        itemName: newItemName,
        unit: newUnit,
        currentPrice: parseInt(newPrice),
        previousPrice: Math.round(parseInt(newPrice) * 0.95),
        date: new Date().toISOString().split('T')[0],
        source: newSource,
        category: newCategory,
        trend: Math.round((parseInt(newPrice) / (parseInt(newPrice) * 0.95) - 1) * 100),
      };
      setMarketItems([newItem, ...marketItems]);
      setNewItemName('');
      setNewPrice('');
      setNewSource('');
      setShowModal(false);
      showNotification('Item added successfully', 'success');
    }
  };

  const handleDeleteItem = (id: number) => {
    setMarketItems(marketItems.filter(i => i.id !== id));
    showNotification('Item deleted', 'success');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'meat':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'vegetable':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'spice':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'rice':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'oil':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'meat':
        return '🍖';
      case 'vegetable':
        return '🥬';
      case 'spice':
        return '🌶️';
      case 'rice':
        return '🍚';
      case 'oil':
        return '🛢️';
      default:
        return '📦';
    }
  };

  const categoryBreakdown = {
    meat: marketItems.filter(i => i.category === 'meat').length,
    vegetable: marketItems.filter(i => i.category === 'vegetable').length,
    spice: marketItems.filter(i => i.category === 'spice').length,
    rice: marketItems.filter(i => i.category === 'rice').length,
    oil: marketItems.filter(i => i.category === 'oil').length,
    other: marketItems.filter(i => i.category === 'other').length,
  };

  const priceChartData = filteredItems.slice(0, 10).map(item => ({
    name: item.itemName,
    currentPrice: item.currentPrice,
    previousPrice: item.previousPrice,
  }));

  const chartOptions: any = {
    chart: {
      type: 'bar',
      toolbar: { show: true },
      animations: { enabled: true, speed: 800 },
    },
    colors: ['#3b82f6', '#9ca3af'],
    xaxis: {
      categories: priceChartData.map(i => i.name),
    },
    yaxis: { title: { text: 'Price (৳)' } },
    plotOptions: {
      bar: { columnWidth: '70%', borderRadius: 4 },
    },
    tooltip: {
      theme: 'light',
      y: { formatter: (val: number) => '৳' + val.toLocaleString() },
    },
  };

  const chartSeries = [
    { name: 'Current Price', data: priceChartData.map(i => i.currentPrice) },
    { name: 'Previous Price', data: priceChartData.map(i => i.previousPrice) },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const averagePrice = filteredItems.length > 0 
    ? Math.round(filteredItems.reduce((sum, i) => sum + i.currentPrice, 0) / filteredItems.length)
    : 0;

  const highestPrice = filteredItems.length > 0
    ? Math.max(...filteredItems.map(i => i.currentPrice))
    : 0;

  const lowestPrice = filteredItems.length > 0
    ? Math.min(...filteredItems.map(i => i.currentPrice))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 pb-12">
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">📊 Market Prices</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Track market rates for items</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all text-sm font-medium"
          >
            <MdAdd size={18} />
            Add Price
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
            className="bg-white rounded-xl p-4 md:p-5 shadow-md border-l-4 border-blue-500"
          >
            <p className="text-gray-500 text-xs md:text-sm font-medium">Total Items</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-3xl font-bold text-blue-600 mt-2"
            >
              {marketItems.length}
            </motion.p>
            <p className="text-xs text-gray-400 mt-2">Tracking items</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-4 md:p-5 shadow-md border-l-4 border-orange-500"
          >
            <p className="text-gray-500 text-xs md:text-sm font-medium">Average Price</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-2xl md:text-3xl font-bold text-orange-600 mt-2"
            >
              ৳{averagePrice}
            </motion.p>
            <p className="text-xs text-gray-400 mt-2">Filtered items</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-4 md:p-5 shadow-md border-l-4 border-green-500"
          >
            <p className="text-gray-500 text-xs md:text-sm font-medium">Lowest Price</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-bold text-green-600 mt-2"
            >
              ৳{lowestPrice}
            </motion.p>
            <p className="text-xs text-gray-400 mt-2">Best price</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-4 md:p-5 shadow-md border-l-4 border-red-500"
          >
            <p className="text-gray-500 text-xs md:text-sm font-medium">Highest Price</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-2xl md:text-3xl font-bold text-red-600 mt-2"
            >
              ৳{highestPrice}
            </motion.p>
            <p className="text-xs text-gray-400 mt-2">Most expensive</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">📈 Price Comparison (Current vs Previous)</h2>
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4 mb-8"
        >
          <motion.div
            whileHover={{ y: -3 }}
            className="p-4 bg-red-50 border border-red-200 rounded-xl text-center"
          >
            <p className="text-2xl font-bold text-red-600 mb-1">🍖</p>
            <p className="text-xs font-semibold text-gray-900">Meat</p>
            <p className="text-lg font-bold text-red-600 mt-1">{categoryBreakdown.meat}</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="p-4 bg-green-50 border border-green-200 rounded-xl text-center"
          >
            <p className="text-2xl font-bold text-green-600 mb-1">🥬</p>
            <p className="text-xs font-semibold text-gray-900">Vegetable</p>
            <p className="text-lg font-bold text-green-600 mt-1">{categoryBreakdown.vegetable}</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-center"
          >
            <p className="text-2xl font-bold text-orange-600 mb-1">🌶️</p>
            <p className="text-xs font-semibold text-gray-900">Spice</p>
            <p className="text-lg font-bold text-orange-600 mt-1">{categoryBreakdown.spice}</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center"
          >
            <p className="text-2xl font-bold text-yellow-600 mb-1">🍚</p>
            <p className="text-xs font-semibold text-gray-900">Rice</p>
            <p className="text-lg font-bold text-yellow-600 mt-1">{categoryBreakdown.rice}</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center"
          >
            <p className="text-2xl font-bold text-blue-600 mb-1">🛢️</p>
            <p className="text-xs font-semibold text-gray-900">Oil</p>
            <p className="text-lg font-bold text-blue-600 mt-1">{categoryBreakdown.oil}</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center"
          >
            <p className="text-2xl font-bold text-gray-600 mb-1">📦</p>
            <p className="text-xs font-semibold text-gray-900">Other</p>
            <p className="text-lg font-bold text-gray-600 mt-1">{categoryBreakdown.other}</p>
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
              placeholder="Search items or source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="meat">🍖 Meat</option>
            <option value="vegetable">🥬 Vegetable</option>
            <option value="spice">🌶️ Spice</option>
            <option value="rice">🍚 Rice</option>
            <option value="oil">🛢️ Oil</option>
            <option value="other">📦 Other</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="trend">Sort by Trend</option>
          </select>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">📋 All Items ({filteredItems.length})</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all text-sm"
            >
              <MdDownload size={18} />
              Export
            </motion.button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Item</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase hidden md:table-cell">Source</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Current</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase hidden sm:table-cell">Previous</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Trend</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, idx) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: idx * 0.03 }}
                        whileHover={{ backgroundColor: '#fafafa' }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{item.itemName}</p>
                            <p className="text-xs text-gray-500">{item.unit}</p>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(item.category)}`}
                          >
                            {getCategoryEmoji(item.category)} {item.category.toUpperCase()}
                          </motion.span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell text-sm text-gray-600">
                          {item.source}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            className="text-lg font-bold text-green-600"
                          >
                            ৳{item.currentPrice}
                          </motion.span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 hidden sm:table-cell text-sm text-gray-600">
                          ৳{item.previousPrice}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                              item.trend > 0
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {item.trend > 0 ? (
                              <MdTrendingUp size={14} />
                            ) : (
                              <MdTrendingDown size={14} />
                            )}
                            {Math.abs(item.trend)}%
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
                              onClick={() => handleDeleteItem(item.id)}
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
                        <p className="text-gray-500 text-lg">No items found</p>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Add Price Modal */}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Market Price</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="number"
                  placeholder="Price (৳)"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  placeholder="Source (বাজার/দোকান)"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="meat">🍖 Meat</option>
                  <option value="vegetable">🥬 Vegetable</option>
                  <option value="spice">🌶️ Spice</option>
                  <option value="rice">🍚 Rice</option>
                  <option value="oil">🛢️ Oil</option>
                  <option value="other">📦 Other</option>
                </select>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddItem}
                    className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all"
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

export default ControllerMarketPage;