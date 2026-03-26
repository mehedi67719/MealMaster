'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MdOutlineSpaceDashboard,
  MdPeople,
  MdManageAccounts,
  MdAssignment,
  MdPayment,
  MdShoppingCart,
  MdOutlineAnalytics,
  MdFastfood,
  MdReceipt,
  MdTrendingUp,
  MdHistory,
  MdHome,
  MdClose,
  MdOutlineRestaurant,
} from 'react-icons/md';
import { FiSearch, FiBell, FiUser, FiChevronDown, FiLogOut, FiGrid } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    setCurrentMonth(months[new Date().getMonth()]);
  }, []);

  useEffect(() => {
    if (session?.user?.accountType) {
      setSelectedRole(session.user.accountType.toLowerCase());
    }
  }, [session]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (status === 'loading') {
    return (
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-600 h-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const userRole = session.user?.accountType?.toLowerCase() || 'member';
  const messName = (session.user as any)?.messName || (session.user as any)?.selectedMess || 'Mess';

  // All menu items grouped by role
  const allMenus = {
    controller: [
      { icon: MdOutlineSpaceDashboard, label: 'Dashboard', href: '/', desc: 'Analytics & Insights' },
      { icon: MdPeople, label: 'Members', href: '/controller/members', desc: 'Manage members' },
      { icon: MdManageAccounts, label: 'Managers', href: '/controller/managers', desc: 'Staff management' },
      { icon: MdAssignment, label: 'Bazaar Entry', href: '/controller/bazaar-entry', desc: 'Daily market' },
      { icon: MdPayment, label: 'Deposits', href: '/controller/deposits', desc: 'Track payments' },
      { icon: MdShoppingCart, label: 'Market', href: '/controller/market', desc: 'Shopping list' },
      { icon: MdOutlineAnalytics, label: 'Reports', href: '/controller/reports', desc: 'Data analysis' },
    ],
    manager: [
      { icon: MdOutlineSpaceDashboard, label: 'Dashboard', href: '/manager/dashboard', desc: 'Overview & Stats' },
      { icon: MdAssignment, label: 'Bazaar Entry', href: '/manager/bazaar-entry', desc: 'Daily entries' },
      { icon: MdPeople, label: 'Members', href: '/manager/members', desc: 'Member management' },
      { icon: MdFastfood, label: 'Meal Control', href: '/manager/meal-control', desc: 'Track meals' },
      { icon: MdReceipt, label: 'Expenses', href: '/manager/expenses', desc: 'Cost tracking' },
      { icon: MdTrendingUp, label: 'Analytics', href: '/manager/analytics', desc: 'Performance data' },
    ],
    member: [
      { icon: MdHome, label: 'Home', href: '/', desc: 'Dashboard' },
      { icon: MdOutlineRestaurant, label: 'Meals', href: '/member/meals', desc: 'Track meals' },
      { icon: MdReceipt, label: 'Balance', href: '/member/balance', desc: 'Your balance' },
      { icon: MdHistory, label: 'History', href: '/member/history', desc: 'Past records' },
    ],
  };

  const menuItems = allMenus[selectedRole as keyof typeof allMenus] || allMenus.member;

  const getGradientColor = () => 'from-emerald-600 via-emerald-600 to-emerald-700';
  const getGradientColorScrolled = () => 'from-emerald-600 to-emerald-700';
  const getBadgeColor = () => 'bg-emerald-100 text-emerald-700';
  const getActiveBgColor = () => 'bg-emerald-50 text-emerald-600';
  const getHoverBgColor = () => 'hover:bg-emerald-500/10 hover:text-emerald-600';

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
  };

  const availableRoles: string[] = [];
  if (userRole === 'controller') {
    availableRoles.push('controller', 'member');
  } else if (userRole === 'manager') {
    availableRoles.push('manager', 'member');
  } else {
    availableRoles.push('member');
  }

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
          ? 'bg-white/98 backdrop-blur-xl shadow-2xl border-b border-gray-100'
          : `bg-gradient-to-r ${getGradientColor()}`
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">

            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-all"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ?
                    <MdClose size={24} className={scrolled ? 'text-gray-800' : 'text-white'} /> :
                    <FiGrid size={22} className={scrolled ? 'text-gray-800' : 'text-white'} />
                  }
                </motion.div>
              </button>

              <Link href="/" className="flex items-center gap-3 group">
                <div className={`w-10 h-10 lg:w-11 lg:h-11 rounded-2xl flex items-center justify-center text-2xl font-bold transition-all ${scrolled
                    ? `bg-gradient-to-br ${getGradientColorScrolled()} text-white shadow-lg`
                    : 'bg-white/20 text-white backdrop-blur-md'
                  }`}>
                  🍚
                </div>
                <div>
                  <h1 className={`text-xl lg:text-2xl font-bold transition-all ${scrolled ? 'text-gray-800' : 'text-white'
                    }`}>
                    MealMaster
                  </h1>
                  <p className={`text-[10px] lg:text-xs transition-all ${scrolled ? 'text-gray-400' : 'text-white/70'
                    }`}>
                    {messName}
                  </p>
                </div>
              </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all group ${active
                          ? scrolled
                            ? getActiveBgColor()
                            : 'bg-white/20 text-white'
                          : scrolled
                            ? `text-gray-600 ${getHoverBgColor()}`
                            : 'text-white/80 hover:bg-white/15 hover:text-white'
                        }`}
                    >
                      <Icon size={20} className="group-hover:scale-110 transition-all" />
                      <span className="text-xs font-medium">{item.label}</span>
                      {active && (
                        <motion.div
                          className={`absolute -bottom-1 left-1/2 w-1.5 h-1.5 rounded-full ${scrolled ? 'bg-current' : 'bg-white'
                            }`}
                          style={{ x: '-50%' }}
                        />
                      )}
                    </Link>

                    {activeDropdown === item.label && !active && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-1/2 mt-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap"
                        style={{ x: '-50%' }}
                      >
                        {item.desc}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className={`p-2.5 rounded-xl transition-all ${scrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white hover:bg-white/15'
                  }`}
              >
                <FiSearch size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-2.5 rounded-xl transition-all ${scrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white hover:bg-white/15'
                  }`}
              >
                <FiBell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </motion.button>

              <div className="relative ml-2" ref={userMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-3 p-1.5 pr-4 rounded-2xl transition-all ${scrolled ? 'hover:bg-gray-100 border border-gray-200 shadow-sm' : 'hover:bg-white/15 border border-white/20'
                    }`}
                >
                  <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${scrolled
                      ? `bg-gradient-to-br ${getGradientColorScrolled()} text-white`
                      : 'bg-white/20 text-white'
                    }`}>
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className={`text-sm font-semibold ${scrolled ? 'text-gray-800' : 'text-white'}`}>
                      {session.user?.name?.split(' ')[0]}
                    </p>
                    <p className={`text-[10px] capitalize ${scrolled ? 'text-gray-500' : 'text-white/70'}`}>
                      {selectedRole}
                    </p>
                  </div>
                  <FiChevronDown size={16} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-96 bg-white rounded-3xl shadow-2xl overflow-hidden z-50 border border-gray-100"
                    >
                      <div className="relative overflow-hidden">
                        <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-r ${getGradientColorScrolled()}`}></div>
                        <div className="relative px-6 pt-12 pb-5">
                          <div className="flex items-center gap-4">
                            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getGradientColorScrolled()} flex items-center justify-center text-white font-bold text-3xl shadow-xl ring-4 ring-white`}>
                              {session.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="text-xl font-bold text-gray-800">{session.user?.name}</p>
                              <p className="text-sm text-gray-500 mt-1">{session.user?.email}</p>
                              <div className="mt-3 flex gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor()}`}>
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-700"></div>
                                  {selectedRole}
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-700"></div>
                                  {messName}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="py-3 px-4 border-t border-gray-100">
                        {/* Role Selection */}
                        {availableRoles.length > 1 && (
                          <div className="mb-4 pb-4 border-b border-gray-100">
                            <p className="text-xs font-semibold text-gray-700 px-4 mb-2">SELECT ROLE</p>
                            <div className="space-y-2 px-2">
                              {availableRoles.map((role) => (
                                <button
                                  key={role}
                                  onClick={() => {
                                    handleRoleChange(role);
                                    setIsUserMenuOpen(false);
                                  }}
                                  className={`w-full text-left px-4 py-2 rounded-lg transition-all capitalize font-medium text-sm ${selectedRole === role
                                      ? 'bg-emerald-100 text-emerald-700'
                                      : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                  {role}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Profile Link */}
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-all"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                            <FiUser size={16} className="text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Profile Settings</p>
                            <p className="text-xs text-gray-400">Manage account</p>
                          </div>
                        </Link>

                        {/* Logout Button */}
                        <button
                          onClick={() => {
                            signOut({ redirect: true, callbackUrl: '/login' });
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all mt-2"
                        >
                          <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                            <FiLogOut size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Sign Out</p>
                            <p className="text-xs text-gray-400">Logout</p>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className={`px-4 py-6 border-t space-y-2 ${scrolled ? 'bg-white border-gray-100' : `bg-gradient-to-r ${getGradientColor()} bg-opacity-95`
                }`}>
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${active
                          ? scrolled
                            ? getActiveBgColor()
                            : 'bg-white/20 text-white'
                          : scrolled
                            ? `text-gray-600 hover:bg-gray-50 ${getHoverBgColor()}`
                            : 'text-white/90 hover:bg-white/10'
                        }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon size={22} />
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs opacity-60">{item.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[100] flex items-start justify-center pt-24"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: -30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: -30, opacity: 0 }}
              className="w-full max-w-3xl mx-4"
              onClick={(e) => e.stopPropagation()}
              ref={searchRef}
            >
              <form onSubmit={handleSearch} className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex items-center p-5">
                  <FiSearch className="text-gray-400 text-2xl mr-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="flex-1 outline-none text-gray-800 text-lg"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className={`px-6 py-2.5 bg-gradient-to-r ${getGradientColorScrolled()} text-white rounded-xl font-medium`}
                  >
                    Search
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16 lg:h-20"></div>
    </>
  );
};

export default Navbar;