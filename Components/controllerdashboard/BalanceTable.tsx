'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MdCalendarToday, MdMoreVert } from 'react-icons/md';
import Link from 'next/link';

const BalanceTable = () => {
  const balanceData = [
    { member: 'Mehedi Hassan', meals: 18, costDue: 5418, paid: 5000, balance: -418, status: 'credit' },
    { member: 'Rahim Khan', meals: 22, costDue: 6622, paid: 6500, balance: -122, status: 'credit' },
    { member: 'Sajid Ali', meals: 16, costDue: 4816, paid: 5000, balance: 184, status: 'debit' },
    { member: 'Karim Ahmad', meals: 14, costDue: 4214, paid: 4000, balance: -214, status: 'credit' },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    hover: { backgroundColor: '#f9fafb', transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <motion.div
        whileHover={{ backgroundColor: '#10b981' }}
        className="px-4 sm:px-6 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white flex items-center justify-between transition-all"
      >
        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
          <MdCalendarToday size={20} />
          <span className="hidden sm:inline">Current Month Balance</span>
          <span className="sm:hidden">Balance</span>
        </h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-white/20 rounded-lg transition-all"
        >
          <MdMoreVert size={20} />
        </motion.button>
      </motion.div>

      <div className="overflow-x-auto">
        <motion.table
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full min-w-full"
        >
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Member
              </th>
              <th className="px-2 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Meals
              </th>
              <th className="px-2 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden sm:table-cell">
                Cost Due
              </th>
              <th className="px-2 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">
                Paid
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {balanceData.map((item, index) => (
              <motion.tr
                key={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: index * 0.05 }}
                className="cursor-pointer"
              >
                <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900">
                  <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    {item.member}
                  </motion.div>
                </td>
                <td className="px-2 sm:px-6 py-4 text-xs sm:text-sm text-gray-600">
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="inline-block bg-blue-50 px-2 py-1 rounded-lg"
                  >
                    {item.meals}
                  </motion.span>
                </td>
                <td className="px-2 sm:px-6 py-4 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
                  ৳{item.costDue.toLocaleString()}
                </td>
                <td className="px-2 sm:px-6 py-4 text-xs sm:text-sm text-gray-600 hidden md:table-cell">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="inline-block"
                  >
                    ৳{item.paid.toLocaleString()}
                  </motion.span>
                </td>
                <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-semibold">
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 + 0.1, type: 'spring' }}
                    whileHover={{ scale: 1.05 }}
                    className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      item.status === 'credit'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {item.status === 'credit' ? '-' : '+'}৳{Math.abs(item.balance).toLocaleString()}
                  </motion.span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200"
      >
        <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
          <Link
            href="/controller/members"
            className="text-green-600 hover:text-green-700 font-medium text-xs sm:text-sm transition-all inline-flex items-center gap-1"
          >
            View All Members
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default BalanceTable;