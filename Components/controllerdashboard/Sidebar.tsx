'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdPeople, MdShoppingCart, MdRestaurant, MdTrendingUp, MdCheckCircle, MdClose, MdExpandMore } from 'react-icons/md';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const Sidebar = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const costChartOptions: any = {
    chart: {
      type: 'donut',
      animations: { enabled: true, speed: 800, animateGradually: { enabled: true, delay: 150 } },
      toolbar: { show: true, tools: { download: true, selection: true, zoom: true, reset: true } },
    },
    colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
    labels: ['Completed', 'Pending', 'Overdue', 'Upcoming'],
    plotOptions: { pie: { donut: { size: '75%' } } },
    dataLabels: { enabled: true, formatter: (val: number) => val.toFixed(0) + '%' },
    responsive: [
      { breakpoint: 480, options: { chart: { height: 280 } } },
    ],
  };

  const costChartSeries = [65, 20, 10, 5];

  const pendingMembers = [
    { id: 3, name: 'Karim Ahmad', email: 'karim@example.com' },
    { id: 4, name: 'Sofia Khan', email: 'sofia@example.com' },
    { id: 5, name: 'Jamal Ali', email: 'jamal@example.com' },
  ];

  const quickActions = [
    { icon: MdPeople, label: 'Manage Members', href: '/controller/members', color: 'green' },
    { icon: MdShoppingCart, label: 'Bazaar Entry', href: '/controller/bazaar-entry', color: 'blue' },
    { icon: MdRestaurant, label: 'Track Meals', href: '/controller/meal-tracking', color: 'orange' },
    { icon: MdTrendingUp, label: 'View Calculations', href: '/controller/calculations', color: 'purple' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-50 hover:bg-green-100 text-green-700';
      case 'blue':
        return 'bg-blue-50 hover:bg-blue-100 text-blue-700';
      case 'orange':
        return 'bg-orange-50 hover:bg-orange-100 text-orange-700';
      case 'purple':
        return 'bg-purple-50 hover:bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-50 hover:bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 md:space-y-6"
    >
      {/* Chart */}
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
        className="bg-white rounded-2xl shadow-lg p-4 md:p-6 transition-all"
      >
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base md:text-lg font-bold text-gray-900 mb-4"
        >
          📊 Task Status
        </motion.h3>

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-60 md:h-72 mb-4"
        >
          <Chart
            options={costChartOptions}
            series={costChartSeries}
            type="donut"
            height="100%"
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-3"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -3 }}
            className="bg-gradient-to-br from-green-50 to-green-100 p-3 md:p-4 rounded-lg md:rounded-xl text-center border border-green-200 transition-all"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-bold text-green-600"
            >
              65%
            </motion.p>
            <p className="text-xs md:text-sm text-gray-600 mt-1 font-medium">Completed</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -3 }}
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 md:p-4 rounded-lg md:rounded-xl text-center border border-yellow-200 transition-all"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-bold text-yellow-600"
            >
              20%
            </motion.p>
            <p className="text-xs md:text-sm text-gray-600 mt-1 font-medium">Pending</p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -5 }}
        className="bg-white rounded-2xl shadow-lg p-4 md:p-6 transition-all"
      >
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base md:text-lg font-bold text-gray-900 mb-4"
        >
          ⚡ Quick Actions
        </motion.h3>

        <motion.div
          className="space-y-2 md:space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={action.href}
                  className={`flex items-center gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all font-medium text-xs md:text-sm ${getColorClass(
                    action.color
                  )} border border-current border-opacity-20 hover:border-opacity-50`}
                >
                  <motion.div whileHover={{ scale: 1.15, rotate: 10 }} transition={{ duration: 0.2 }}>
                    <Icon size={20} className="flex-shrink-0" />
                  </motion.div>
                  <span className="truncate">{action.label}</span>
                  <motion.span animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="ml-auto flex-shrink-0">
                    →
                  </motion.span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Pending Requests */}
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -5 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all"
      >
        <motion.button
          whileHover={{ backgroundColor: '#f3f4f6' }}
          onClick={() => setExpandedSection(expandedSection === 'pending' ? null : 'pending')}
          className="w-full px-4 md:px-6 py-4 md:py-5 bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100 flex items-center justify-between hover:bg-red-100 transition-all"
        >
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2"
          >
            👥 Pending Requests
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-red-500 text-white text-xs font-bold px-2 md:px-3 py-1 rounded-full"
            >
              {pendingMembers.length}
            </motion.span>
          </motion.h3>

          <motion.div
            animate={{ rotate: expandedSection === 'pending' ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <MdExpandMore size={24} className="text-gray-600" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {expandedSection === 'pending' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="px-4 md:px-6 py-4 md:py-6 space-y-3"
            >
              {pendingMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-3 md:p-4 border border-gray-200 rounded-lg md:rounded-xl hover:border-green-500 hover:bg-green-50 transition-all"
                >
                  <motion.p className="font-semibold text-gray-900 text-sm md:text-base">
                    {member.name}
                  </motion.p>
                  <p className="text-xs text-gray-500 mb-3 truncate">{member.email}</p>

                  <motion.div
                    className="flex gap-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.button
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, backgroundColor: '#dcfce7' }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-3 py-1.5 md:py-2 bg-green-600 hover:bg-green-700 text-white text-xs md:text-sm rounded-lg font-medium transition-all flex items-center justify-center gap-1"
                    >
                      <MdCheckCircle size={14} />
                      <span>Approve</span>
                    </motion.button>
                    <motion.button
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, backgroundColor: '#fee2e2' }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-3 py-1.5 md:py-2 bg-red-100 hover:bg-red-200 text-red-600 text-xs md:text-sm rounded-lg font-medium transition-all"
                    >
                      <MdClose size={14} />
                    </motion.button>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Month Info */}
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)' }}
        className="bg-gradient-to-br from-green-600 via-green-600 to-emerald-600 rounded-2xl shadow-lg p-4 md:p-6 text-white transition-all relative overflow-hidden group"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full"
        />

        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base md:text-lg font-bold mb-4 relative z-10"
        >
          📅 Month Status
        </motion.h3>

        <motion.div className="space-y-4 relative z-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex justify-between items-center"
          >
            <span className="text-sm opacity-90 font-medium">Days Remaining</span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-bold text-lg md:text-xl"
            >
              12 days
            </motion.span>
          </motion.div>

          <motion.div className="space-y-2">
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ delay: 0.3, duration: 1, type: 'spring' }}
                className="bg-gradient-to-r from-white to-green-200 h-full rounded-full shadow-lg"
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs opacity-75 font-medium"
            >
              Month progress: 65% completed
            </motion.p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-4 py-2.5 md:py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold text-sm md:text-base transition-all backdrop-blur-sm border border-white/30"
          >
            End Month
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;