'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { MdEdit, MdDelete, MdOpenInNew } from 'react-icons/md';

interface ActivityItem {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  avatar: string;
  type: 'meal' | 'bazaar' | 'member' | 'system';
  amount?: number;
}

const RecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 1,
      title: 'Meal Entry',
      description: 'Mehedi added 2 meals for today',
      timestamp: '2 min ago',
      avatar: 'M',
      type: 'meal',
    },
    {
      id: 2,
      title: 'Bazaar Entry',
      description: 'Rahim added bazaar cost',
      timestamp: '1 hour ago',
      avatar: 'R',
      type: 'bazaar',
      amount: 500,
    },
    {
      id: 3,
      title: 'New Member',
      description: 'Karim requested to join',
      timestamp: '3 hours ago',
      avatar: 'K',
      type: 'member',
    },
    {
      id: 4,
      title: 'Report Generated',
      description: 'Monthly report for December generated',
      timestamp: '1 day ago',
      avatar: 'S',
      type: 'system',
    },
    {
      id: 5,
      title: 'Balance Updated',
      description: 'Automatic calculation completed',
      timestamp: '2 days ago',
      avatar: 'D',
      type: 'system',
    },
  ]);

  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setActivities(activities.filter(item => item.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meal':
        return 'bg-gradient-to-br from-blue-400 to-blue-600';
      case 'bazaar':
        return 'bg-gradient-to-br from-orange-400 to-orange-600';
      case 'member':
        return 'bg-gradient-to-br from-purple-400 to-purple-600';
      case 'system':
        return 'bg-gradient-to-br from-gray-400 to-gray-600';
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meal':
        return '🍽️';
      case 'bazaar':
        return '🛒';
      case 'member':
        return '👤';
      case 'system':
        return '⚙️';
      default:
        return '📌';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'meal':
        return 'Meal';
      case 'bazaar':
        return 'Bazaar';
      case 'member':
        return 'Member';
      case 'system':
        return 'System';
      default:
        return 'Activity';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <motion.div
        whileHover={{ backgroundColor: '#f9fafb' }}
        className="px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between transition-all"
      >
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-lg font-bold text-gray-900"
        >
          📋 Recent Activity
        </motion.h2>

        <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
          <Link
            href="/controller/activity"
            className="text-green-600 hover:text-green-700 text-xs sm:text-sm font-medium flex items-center gap-1 transition-all"
          >
            <span className="hidden sm:inline">View All</span>
            <motion.span animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              →
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 sm:px-6 py-4 sm:py-6 space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        <AnimatePresence>
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                variants={itemVariants}
                exit="exit"
                layout
                onMouseEnter={() => setHoveredId(activity.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setExpandedId(expandedId === activity.id ? null : activity.id)}
                className="relative"
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                    expandedId === activity.id
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                  }`}
                >
                  {/* Avatar */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0 shadow-md ${getTypeColor(
                      activity.type
                    )}`}
                  >
                    {activity.avatar}
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg sm:text-2xl">{getTypeIcon(activity.type)}</span>
                      <motion.p className="font-semibold text-gray-900 text-sm sm:text-base">
                        {activity.title}
                      </motion.p>
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-2 py-0.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs rounded-full font-semibold"
                      >
                        {getTypeLabel(activity.type)}
                      </motion.span>
                    </div>

                    <motion.p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                      {activity.description}
                    </motion.p>

                    {activity.amount && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-xs sm:text-sm font-bold text-green-600 mt-2 flex items-center gap-1"
                      >
                        <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                          💰
                        </motion.span>
                        ৳{activity.amount}
                      </motion.p>
                    )}

                    <AnimatePresence>
                      {expandedId === activity.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-gray-200"
                        >
                          <p className="text-xs text-gray-500 font-medium">Full Details</p>
                          <p className="text-xs sm:text-sm text-gray-700 mt-1">{activity.description}</p>
                          <p className="text-xs text-gray-400 mt-2">ID: #{activity.id}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Timestamp & Actions */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <motion.p className="text-xs text-gray-400 whitespace-nowrap">
                      {activity.timestamp}
                    </motion.p>

                    <AnimatePresence>
                      {hoveredId === activity.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex gap-1.5"
                        >
                          <motion.button
                            whileHover={{ scale: 1.15, backgroundColor: '#dbeafe' }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1.5 sm:p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
                          >
                            <MdEdit size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.15, backgroundColor: '#fee2e2' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(activity.id);
                            }}
                            className="p-1.5 sm:p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                          >
                            <MdDelete size={16} />
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 sm:py-12"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="text-4xl mb-3"
              >
                📭
              </motion.div>
              <p className="text-gray-500 font-medium text-sm sm:text-base">No activities yet</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">Activities will appear here</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {activities.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 text-xs sm:text-sm text-gray-600 font-medium"
        >
          <motion.div whileHover={{ x: 3 }} className="flex items-center gap-2">
            <MdOpenInNew size={16} />
            <span>{activities.length} recent activities</span>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RecentActivity;