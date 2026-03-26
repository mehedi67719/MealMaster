'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCheckCircle, MdClose, MdDelete, MdPerson, MdSearch, MdSupervisorAccount, MdPersonAdd, MdPersonRemove, MdRefresh } from 'react-icons/md';
import { useSession, signOut } from 'next-auth/react';
import { alluser, updateUserAccountType, deleteUser } from '@/actions/server/user';

interface Member {
  _id: string;
  name: string;
  email: string;
  accountType: 'member' | 'controller' | 'manager';
  messName: string;
  messSecretCode: string;
  createdAt: string;
}

const AdminMembersPage = () => {
  const { update } = useSession();
  const { data: session } = useSession();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'member' | 'controller' | 'manager'>('all');
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const result = await alluser();
      if (result && Array.isArray(result)) {
        setMembers(result as Member[]);
      } else {
        setMembers([]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setMembers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
    setLoading(false);
  }, []);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || member.accountType === filterType;
    return matchesSearch && matchesType;
  });

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleMakeController = async (id: string) => {
    setUpdatingId(id);
    try {
      const result = await updateUserAccountType(id, 'controller');
      if (result.success) {
        setMembers(prevMembers =>
          prevMembers.map(m =>
            m._id === id ? { ...m, accountType: 'controller' } : m
          )
        );
        showNotification(`User promoted to Controller`, 'success');
        await update();
      } else {
        showNotification(result.error || 'Failed to update', 'error');
      }
    } catch (error) {
      showNotification('Error updating user', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMakeManager = async (id: string) => {
    setUpdatingId(id);
    try {
      const result = await updateUserAccountType(id, 'manager');
      if (result.success) {
        setMembers(prevMembers =>
          prevMembers.map(m =>
            m._id === id ? { ...m, accountType: 'manager' } : m
          )
        );
        showNotification(`User promoted to Manager`, 'success');
        await update();
      } else {
        showNotification(result.error || 'Failed to update', 'error');
      }
    } catch (error) {
      showNotification('Error updating user', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMakeMember = async (id: string) => {
    setUpdatingId(id);
    try {
      const result = await updateUserAccountType(id, 'member');
      if (result.success) {
        setMembers(prevMembers =>
          prevMembers.map(m =>
            m._id === id ? { ...m, accountType: 'member' } : m
          )
        );
        showNotification(`User downgraded to Member`, 'success');
        await update();
      } else {
        showNotification(result.error || 'Failed to update', 'error');
      }
    } catch (error) {
      showNotification('Error updating user', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const user = members.find(m => m._id === id);
    setUpdatingId(id);
    try {
      const result = await deleteUser(id);
      if (result.success) {
        setMembers(prevMembers => prevMembers.filter(m => m._id !== id));
        showNotification(`${user?.name} deleted successfully`, 'success');
        await update();
      } else {
        showNotification(result.error || 'Failed to delete', 'error');
      }
    } catch (error) {
      showNotification('Error deleting user', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await fetchUsers();
    setLoading(false);
    await update();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'controller':
        return 'bg-purple-100 text-purple-700';
      case 'manager':
        return 'bg-orange-100 text-orange-700';
      case 'member':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const memberCount = members.filter(m => m.accountType === 'member').length;
  const controllerCount = members.filter(m => m.accountType === 'controller').length;
  const managerCount = members.filter(m => m.accountType === 'manager').length;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">👥 User Management</h1>
              <p className="text-gray-500 text-sm sm:text-base mt-1 sm:mt-2">Manage users and account types</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={updatingId !== null}
              className="p-2 sm:p-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-all"
              title="Refresh Data"
            >
              <MdRefresh size={20} className={updatingId !== null ? 'animate-spin' : ''} />
            </motion.button>
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
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Total Users</p>
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
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Members</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mt-1 sm:mt-2"
              >
                {memberCount}
              </motion.p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-md border-l-4 border-orange-500 transition-all"
            >
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Managers</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600 mt-1 sm:mt-2"
              >
                {managerCount}
              </motion.p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-md border-l-4 border-purple-500 transition-all"
            >
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Controllers</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 mt-1 sm:mt-2"
              >
                {controllerCount}
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
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
              />
            </div>
            <motion.select
              whileFocus={{ boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)' }}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
            >
              <option value="all">All Types</option>
              <option value="member">Member</option>
              <option value="manager">Manager</option>
              <option value="controller">Controller</option>
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
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase hidden lg:table-cell">Mess Name</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {filteredMembers.map((member, index) => (
                      <motion.tr
                        key={member._id}
                        custom={index}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        whileHover={{ backgroundColor: '#f9fafb' }}
                        className="hover:bg-gray-50 transition-colors relative"
                      >
                        {updatingId === member._id && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-lg z-10"
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1 }}
                              className="w-6 h-6 border-2 border-blue-200 border-t-blue-500 rounded-full"
                            />
                          </motion.div>
                        )}
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                          <motion.div whileHover={{ x: 3 }} className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                            {member.name}
                          </motion.div>
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden md:table-cell text-xs sm:text-sm text-gray-600 truncate">{member.email}</td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={`inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getTypeColor(member.accountType)}`}
                          >
                            {member.accountType === 'controller' && <MdSupervisorAccount size={12} />}
                            {member.accountType === 'manager' && <MdPersonAdd size={12} />}
                            {member.accountType === 'member' && <MdPerson size={12} />}
                            <span className="hidden sm:inline">{member.accountType.charAt(0).toUpperCase() + member.accountType.slice(1)}</span>
                            <span className="sm:hidden">{member.accountType === 'controller' ? 'Ctrl' : member.accountType === 'manager' ? 'Mgr' : 'Mem'}</span>
                          </motion.span>
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden lg:table-cell text-xs sm:text-sm text-gray-600">{member.messName}</td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                          <motion.div className="flex justify-end gap-0.5 sm:gap-1 md:gap-2 flex-wrap">
                            {member.accountType === 'member' && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleMakeManager(member._id)}
                                  disabled={updatingId !== null}
                                  className="p-1 sm:p-1.5 md:p-2 bg-orange-100 hover:bg-orange-200 disabled:bg-gray-200 text-orange-600 disabled:text-gray-400 rounded-lg transition-all"
                                  title="Make Manager"
                                >
                                  <MdPersonAdd size={14} className="sm:hidden" />
                                  <MdPersonAdd size={16} className="hidden sm:block" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleMakeController(member._id)}
                                  disabled={updatingId !== null}
                                  className="p-1 sm:p-1.5 md:p-2 bg-purple-100 hover:bg-purple-200 disabled:bg-gray-200 text-purple-600 disabled:text-gray-400 rounded-lg transition-all"
                                  title="Make Controller"
                                >
                                  <MdSupervisorAccount size={14} className="sm:hidden" />
                                  <MdSupervisorAccount size={16} className="hidden sm:block" />
                                </motion.button>
                              </>
                            )}

                            {member.accountType === 'manager' && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleMakeController(member._id)}
                                  disabled={updatingId !== null}
                                  className="p-1 sm:p-1.5 md:p-2 bg-purple-100 hover:bg-purple-200 disabled:bg-gray-200 text-purple-600 disabled:text-gray-400 rounded-lg transition-all"
                                  title="Make Controller"
                                >
                                  <MdSupervisorAccount size={14} className="sm:hidden" />
                                  <MdSupervisorAccount size={16} className="hidden sm:block" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleMakeMember(member._id)}
                                  disabled={updatingId !== null}
                                  className="p-1 sm:p-1.5 md:p-2 bg-blue-100 hover:bg-blue-200 disabled:bg-gray-200 text-blue-600 disabled:text-gray-400 rounded-lg transition-all"
                                  title="Make Member"
                                >
                                  <MdPersonRemove size={14} className="sm:hidden" />
                                  <MdPersonRemove size={16} className="hidden sm:block" />
                                </motion.button>
                              </>
                            )}

                            {member.accountType === 'controller' && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleMakeManager(member._id)}
                                  disabled={updatingId !== null}
                                  className="p-1 sm:p-1.5 md:p-2 bg-orange-100 hover:bg-orange-200 disabled:bg-gray-200 text-orange-600 disabled:text-gray-400 rounded-lg transition-all"
                                  title="Make Manager"
                                >
                                  <MdPersonAdd size={14} className="sm:hidden" />
                                  <MdPersonAdd size={16} className="hidden sm:block" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleMakeMember(member._id)}
                                  disabled={updatingId !== null}
                                  className="p-1 sm:p-1.5 md:p-2 bg-blue-100 hover:bg-blue-200 disabled:bg-gray-200 text-blue-600 disabled:text-gray-400 rounded-lg transition-all"
                                  title="Make Member"
                                >
                                  <MdPersonRemove size={14} className="sm:hidden" />
                                  <MdPersonRemove size={16} className="hidden sm:block" />
                                </motion.button>
                              </>
                            )}

                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteUser(member._id)}
                              disabled={updatingId !== null}
                              className="p-1 sm:p-1.5 md:p-2 bg-red-100 hover:bg-red-200 disabled:bg-gray-200 text-red-600 disabled:text-gray-400 rounded-lg transition-all"
                              title="Delete User"
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
                <p className="text-gray-500 text-sm sm:text-lg">No users found</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminMembersPage;