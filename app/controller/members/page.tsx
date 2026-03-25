'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCheckCircle, MdClose, MdDelete, MdPerson, MdSearch, MdSupervisorAccount, MdPersonAdd, MdPersonRemove } from 'react-icons/md';

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'active' | 'inactive';
  role: 'member' | 'manager' | 'admin';
  joinDate: string;
  meals: number;
  balance: number;
}

const AdminMembersPage = () => {
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: 'Mehedi Hassan', email: 'mehedi@example.com', phone: '01700000001', status: 'active', role: 'member', joinDate: '2024-01-15', meals: 45, balance: -418 },
    { id: 2, name: 'Rahim Khan', email: 'rahim@example.com', phone: '01700000002', status: 'active', role: 'manager', joinDate: '2024-01-20', meals: 52, balance: -122 },
    { id: 3, name: 'Karim Ahmad', email: 'karim@example.com', phone: '01700000003', status: 'pending', role: 'member', joinDate: '2024-03-20', meals: 0, balance: 0 },
    { id: 4, name: 'Sajid Ali', email: 'sajid@example.com', phone: '01700000004', status: 'active', role: 'member', joinDate: '2024-02-10', meals: 38, balance: 184 },
    { id: 5, name: 'Sofia Khan', email: 'sofia@example.com', phone: '01700000005', status: 'pending', role: 'member', joinDate: '2024-03-22', meals: 0, balance: 0 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'active' | 'inactive'>('all');
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleApproveMember = (id: number) => {
    setMembers(members.map(m => m.id === id ? { ...m, status: 'active' } : m));
    showNotification('Member approved successfully', 'success');
  };

  const handleRejectMember = (id: number) => {
    const member = members.find(m => m.id === id);
    setMembers(members.filter(m => m.id !== id));
    showNotification(`${member?.name} rejected`, 'success');
  };

  const handleMakeManager = (id: number) => {
    const member = members.find(m => m.id === id);
    setMembers(members.map(m => m.id === id ? { ...m, role: 'manager' } : m));
    showNotification(`${member?.name} is now a Manager`, 'success');
  };

  const handleRemoveManager = (id: number) => {
    const member = members.find(m => m.id === id);
    setMembers(members.map(m => m.id === id ? { ...m, role: 'member' } : m));
    showNotification(`${member?.name} downgraded to Member`, 'success');
  };

  const handleDeleteMember = (id: number) => {
    const member = members.find(m => m.id === id);
    setMembers(members.filter(m => m.id !== id));
    showNotification(`${member?.name} deleted`, 'success');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'inactive':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      case 'manager':
        return 'bg-blue-100 text-blue-700';
      case 'member':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const pendingCount = members.filter(m => m.status === 'pending').length;
  const activeCount = members.filter(m => m.status === 'active').length;
  const managerCount = members.filter(m => m.role === 'manager').length;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05 },
    }),
    exit: { opacity: 0, x: 20 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-12 md:pb-16">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className={`fixed top-4 right-4 sm:top-6 sm:right-6 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-white shadow-lg z-50 text-sm sm:text-base ${
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
          className="pt-6 sm:pt-8 pb-4 sm:pb-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">👥 Member Management</h1>
              <p className="text-gray-500 text-sm sm:text-base mt-1 sm:mt-2">Manage users, roles, and permissions</p>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-md border-l-4 border-blue-500 transition-all"
            >
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Total Members</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mt-1 sm:mt-2"
              >
                {members.length}
              </motion.p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-md border-l-4 border-green-500 transition-all"
            >
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Active Members</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mt-1 sm:mt-2"
              >
                {activeCount}
              </motion.p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-md border-l-4 border-yellow-500 transition-all"
            >
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Pending</p>
              <motion.p
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-600 mt-1 sm:mt-2"
              >
                {pendingCount}
              </motion.p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-md border-l-4 border-purple-500 transition-all"
            >
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Managers</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 mt-1 sm:mt-2"
              >
                {managerCount}
              </motion.p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6"
          >
            <div className="flex-1 relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <motion.input
                whileFocus={{ boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)' }}
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
              />
            </div>
            <motion.select
              whileFocus={{ boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </motion.select>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 sm:mb-8"
        >
          <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase hidden md:table-cell">Email</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase hidden lg:table-cell">Meals</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {filteredMembers.map((member, index) => (
                      <motion.tr
                        key={member.id}
                        custom={index}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        whileHover={{ backgroundColor: '#f9fafb' }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                          <motion.div whileHover={{ x: 3 }} className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                            {member.name}
                          </motion.div>
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden md:table-cell text-xs sm:text-sm text-gray-600 truncate">{member.email}</td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={`inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getRoleColor(member.role)}`}
                          >
                            {member.role === 'manager' && <MdSupervisorAccount size={12} />}
                            {member.role === 'member' && <MdPerson size={12} />}
                            <span className="hidden sm:inline">{member.role.charAt(0).toUpperCase() + member.role.slice(1)}</span>
                            <span className="sm:hidden">{member.role === 'manager' ? 'Mgr' : member.role === 'admin' ? 'Adm' : 'Mem'}</span>
                          </motion.span>
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusColor(member.status)}`}
                          >
                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                          </motion.span>
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden lg:table-cell text-xs sm:text-sm text-gray-600">{member.meals}</td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                          <motion.div className="flex justify-end gap-0.5 sm:gap-1 md:gap-2 flex-wrap">
                            {member.status === 'pending' && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleApproveMember(member.id)}
                                  className="p-1 sm:p-1.5 md:p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-all"
                                  title="Approve"
                                >
                                  <MdCheckCircle size={14} className="sm:hidden" />
                                  <MdCheckCircle size={16} className="hidden sm:block" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleRejectMember(member.id)}
                                  className="p-1 sm:p-1.5 md:p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all"
                                  title="Reject"
                                >
                                  <MdClose size={14} className="sm:hidden" />
                                  <MdClose size={16} className="hidden sm:block" />
                                </motion.button>
                              </>
                            )}

                            {member.status === 'active' && member.role === 'member' && (
                              <motion.button
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleMakeManager(member.id)}
                                className="p-1 sm:p-1.5 md:p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all"
                                title="Make Manager"
                              >
                                <MdPersonAdd size={14} className="sm:hidden" />
                                <MdPersonAdd size={16} className="hidden sm:block" />
                              </motion.button>
                            )}

                            {member.role === 'manager' && (
                              <motion.button
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleRemoveManager(member.id)}
                                className="p-1 sm:p-1.5 md:p-2 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-lg transition-all"
                                title="Remove Manager"
                              >
                                <MdPersonRemove size={14} className="sm:hidden" />
                                <MdPersonRemove size={16} className="hidden sm:block" />
                              </motion.button>
                            )}

                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteMember(member.id)}
                              className="p-1 sm:p-1.5 md:p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all"
                              title="Delete"
                            >
                              <MdDelete size={14} className="sm:hidden" />
                              <MdDelete size={16} className="hidden sm:block" />
                            </motion.button>
                          </motion.div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {filteredMembers.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 sm:py-12"
              >
                <p className="text-gray-500 text-sm sm:text-lg">No members found</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminMembersPage;