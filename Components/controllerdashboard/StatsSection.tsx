'use client';

import React, { useState } from 'react';
import { MdPeople, MdRestaurant, MdShoppingCart, MdTrendingUp, MdArrowUpward, MdArrowDownward } from 'react-icons/md';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: number;
  color: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, trend, color, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.5, type: 'spring', stiffness: 100 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -8, boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 ${color} group cursor-pointer`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.1, duration: 0.3 }}
            className="text-gray-500 text-xs sm:text-sm font-medium mb-2"
          >
            {title}
          </motion.p>

          <div className="flex items-baseline gap-2 flex-wrap">
            <motion.h3
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: delay + 0.2,
                duration: 0.4,
                type: 'spring',
                stiffness: 120,
              }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800"
            >
              {value}
            </motion.h3>

            {trend !== undefined && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: delay + 0.3,
                  duration: 0.3,
                  type: 'spring',
                }}
                className={`text-xs sm:text-sm font-semibold flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg ${
                  trend > 0
                    ? 'text-green-600 bg-green-50'
                    : 'text-red-600 bg-red-50'
                }`}
              >
                <motion.div
                  animate={{ y: isHovered ? [0, -3, 0] : 0 }}
                  transition={{
                    repeat: isHovered ? Infinity : 0,
                    duration: 0.6,
                  }}
                >
                  {trend > 0 ? (
                    <MdArrowUpward size={14} />
                  ) : (
                    <MdArrowDownward size={14} />
                  )}
                </motion.div>
                {Math.abs(trend)}%
              </motion.div>
            )}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2, duration: 0.3 }}
            className="text-xs text-gray-400 mt-2 line-clamp-2"
          >
            {subtitle}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: delay + 0.15,
            duration: 0.4,
            type: 'spring',
          }}
          whileHover={{ scale: 1.2, rotate: 10 }}
          className={`text-4xl sm:text-5xl opacity-15 group-hover:opacity-25 flex-shrink-0 transition-all ${
            isHovered ? 'scale-125' : 'scale-100'
          }`}
        >
          {icon}
        </motion.div>
      </div>

      {/* Bottom accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`h-1 mt-4 rounded-full bg-gradient-to-r ${
          color === 'border-green-500'
            ? 'from-green-400 to-green-600'
            : color === 'border-blue-500'
            ? 'from-blue-400 to-blue-600'
            : color === 'border-orange-500'
            ? 'from-orange-400 to-orange-600'
            : 'from-purple-400 to-purple-600'
        } origin-left`}
      />
    </motion.div>
  );
};

const StatsSection = () => {
  const stats = [
    {
      title: 'Total Members',
      value: 12,
      subtitle: 'Active members this month',
      icon: <MdPeople size={32} />,
      trend: 5,
      color: 'border-green-500',
    },
    {
      title: 'Meals Tracked',
      value: 82,
      subtitle: 'Total meals this month',
      icon: <MdRestaurant size={32} />,
      trend: 8,
      color: 'border-blue-500',
    },
    {
      title: 'Total Cost',
      value: `৳${(24680).toLocaleString()}`,
      subtitle: 'Monthly bazaar expenses',
      icon: <MdShoppingCart size={32} />,
      trend: -3,
      color: 'border-orange-500',
    },
    {
      title: 'Per Meal Cost',
      value: `৳${301}`,
      subtitle: 'Average cost per meal',
      icon: <MdTrendingUp size={32} />,
      color: 'border-purple-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8"
    >
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          icon={stat.icon}
          trend={stat.trend}
          color={stat.color}
          delay={index * 0.1}
        />
      ))}
    </motion.div>
  );
};

export default StatsSection;