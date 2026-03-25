'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MdDashboard,
  MdPeople,
  MdStore,
  MdAssessment,
  MdSettings,
  MdAssignment,
  MdFastfood,
  MdAccountBalance,
  MdHistory,
  MdLogout,
  MdHome,
  MdClose,
  MdNotifications,
  MdPerson,
  MdArrowDropDown,
  MdRestaurantMenu,
  MdReceipt,
  MdTrendingUp,
  MdShoppingCart,
  MdPayment,
  MdOutlineSpaceDashboard,
  MdOutlineAnalytics,
  MdOutlineSettings,
  MdOutlineRestaurant,
  MdManageAccounts,
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
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

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
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-16 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const userRole = session.user?.accountType || 'member';


  const controllerMenu = [
    { icon: MdOutlineSpaceDashboard, label: 'Dashboard', href: '/', desc: 'Analytics & Insights' },
    { icon: MdPeople, label: 'Members', href: '/controller/members', desc: 'Manage members' },
    { icon: MdManageAccounts, label: 'Managers', href: '/controller/managers', desc: 'Staff management' },
    { icon: MdAssignment, label: 'Bazaar Entry', href: '/controller/bazaar-entry', desc: 'Daily market' },
    { icon: MdPayment, label: 'Deposits', href: '/controller/deposits', desc: 'Track payments' },
    { icon: MdShoppingCart, label: 'Market', href: '/controller/market', desc: 'Shopping list' },
    { icon: MdOutlineAnalytics, label: 'Reports', href: '/controller/reports', desc: 'Data analysis' },
 
  ];

  
  const managerMenu = [
    { icon: MdOutlineSpaceDashboard, label: 'Dashboard', href: '/manager/dashboard', desc: 'Overview & Stats' },
    { icon: MdAssignment, label: 'Bazaar Entry', href: '/manager/bazaar-entry', desc: 'Daily entries' },
    { icon: MdPeople, label: 'Members', href: '/manager/members', desc: 'Member management' },
    { icon: MdFastfood, label: 'Meal Control', href: '/manager/meal-control', desc: 'Track meals' },
    { icon: MdReceipt, label: 'Expenses', href: '/manager/expenses', desc: 'Cost tracking' },
    { icon: MdTrendingUp, label: 'Analytics', href: '/manager/analytics', desc: 'Performance data' },
    { icon: MdOutlineSettings, label: 'Settings', href: '/manager/settings', desc: 'Preferences' },
  ];


  const memberMenu = [
    { icon: MdHome, label: 'Home', href: '/member/home', desc: 'Dashboard' },
    { icon: MdOutlineRestaurant, label: 'Meals', href: '/member/meals', desc: 'Track meals' },
    { icon: MdReceipt, label: 'Balance', href: '/member/balance', desc: 'Your balance' },
    { icon: MdHistory, label: 'History', href: '/member/history', desc: 'Past records' },
    { icon: MdOutlineSettings, label: 'Settings', href: '/member/settings', desc: 'Account settings' },
  ];

  const getMenuItems = () => {
    switch (userRole.toLowerCase()) {
      case 'controller':
        return controllerMenu;
      case 'manager':
        return managerMenu;
      case 'member':
      default:
        return memberMenu;
    }
  };

  const getGradientColor = () => {
    switch (userRole.toLowerCase()) {
      case 'controller':
        return 'from-emerald-600 via-emerald-600 to-teal-600';
      case 'manager':
        return 'from-blue-600 via-blue-600 to-cyan-600';
      case 'member':
      default:
        return 'from-purple-600 via-purple-600 to-pink-600';
    }
  };

  const getGradientColorScrolled = () => {
    switch (userRole.toLowerCase()) {
      case 'controller':
        return 'from-emerald-500 to-teal-500';
      case 'manager':
        return 'from-blue-500 to-cyan-500';
      case 'member':
      default:
        return 'from-purple-500 to-pink-500';
    }
  };

  const getBadgeColor = () => {
    switch (userRole.toLowerCase()) {
      case 'controller':
        return 'bg-emerald-100 text-emerald-700';
      case 'manager':
        return 'bg-blue-100 text-blue-700';
      case 'member':
      default:
        return 'bg-purple-100 text-purple-700';
    }
  };

  const getActiveBgColor = () => {
    switch (userRole.toLowerCase()) {
      case 'controller':
        return 'bg-emerald-50 text-emerald-600';
      case 'manager':
        return 'bg-blue-50 text-blue-600';
      case 'member':
      default:
        return 'bg-purple-50 text-purple-600';
    }
  };

  const getHoverBgColor = () => {
    switch (userRole.toLowerCase()) {
      case 'controller':
        return 'hover:bg-emerald-500/10 hover:text-emerald-600';
      case 'manager':
        return 'hover:bg-blue-500/10 hover:text-blue-600';
      case 'member':
      default:
        return 'hover:bg-purple-500/10 hover:text-purple-600';
    }
  };

  const menuItems = getMenuItems();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}&role=${userRole}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isScrolledStyle = scrolled && userRole.toLowerCase() !== 'controller';

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolledStyle 
          ? 'bg-white/98 backdrop-blur-xl shadow-2xl border-b border-gray-100' 
          : `bg-gradient-to-r ${getGradientColor()}`
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
        
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-all duration-200 group"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  {isMobileMenuOpen ? 
                    <MdClose size={24} className={isScrolledStyle ? 'text-gray-800' : 'text-white'} /> : 
                    <FiGrid size={22} className={isScrolledStyle ? 'text-gray-800' : 'text-white'} />
                  }
                </motion.div>
              </button>
              
              <Link href={`/`} className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <div className={`w-10 h-10 lg:w-11 lg:h-11 rounded-2xl flex items-center justify-center text-2xl font-bold transition-all duration-500 ${
                    isScrolledStyle 
                      ? `bg-gradient-to-br ${getGradientColorScrolled()} text-white shadow-lg` 
                      : 'bg-white/20 text-white backdrop-blur-md shadow-lg'
                  }`}>
                    🍽️
                  </div>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl opacity-0 group-hover:opacity-30 blur transition-all duration-500"></div>
                </motion.div>
                <div>
                  <h1 className={`text-xl lg:text-2xl font-bold tracking-tight transition-all duration-300 ${
                    isScrolledStyle ? 'text-gray-800' : 'text-white'
                  }`}>
                    MealMaster
                  </h1>
                  <p className={`text-[10px] lg:text-xs tracking-wide transition-all duration-300 ${
                    isScrolledStyle ? 'text-gray-400' : 'text-white/70'
                  }`}>
                    {userRole === 'controller' ? 'Control Panel' : userRole === 'manager' ? 'Manager Portal' : 'Member Dashboard'}
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
                      className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 group ${
                        active
                          ? isScrolledStyle
                            ? getActiveBgColor()
                            : 'bg-white/20 text-white'
                          : isScrolledStyle
                            ? `text-gray-600 ${getHoverBgColor()}`
                            : 'text-white/80 hover:bg-white/15 hover:text-white'
                      }`}
                    >
                      <Icon size={20} className={`transition-all duration-300 group-hover:scale-110 ${
                        active ? 'scale-110' : ''
                      }`} />
                      <span className="text-xs font-medium">{item.label}</span>
                      {active && (
                        <motion.div
                          layoutId="activeNav"
                          className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                            isScrolledStyle ? 'bg-current' : 'bg-white'
                          }`}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </Link>
                    
                    
                    {activeDropdown === item.label && !active && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap shadow-xl z-50"
                      >
                        {item.desc}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
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
                className={`relative p-2.5 rounded-xl transition-all duration-300 group ${
                  isScrolledStyle 
                    ? 'text-gray-600 hover:bg-gray-100' 
                    : 'text-white hover:bg-white/15'
                }`}
              >
                <FiSearch size={20} />
                <span className="absolute inset-0 rounded-xl bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></span>
              </motion.button>

         
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-2.5 rounded-xl transition-all duration-300 group ${
                  isScrolledStyle 
                    ? 'text-gray-600 hover:bg-gray-100' 
                    : 'text-white hover:bg-white/15'
                }`}
              >
                <FiBell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-white"></span>
              </motion.button>

              <div className="relative ml-2" ref={userMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-3 p-1.5 pr-4 rounded-2xl transition-all duration-300 ${
                    isScrolledStyle 
                      ? 'hover:bg-gray-100 border border-gray-200 shadow-sm' 
                      : 'hover:bg-white/15 border border-white/20'
                  }`}
                >
                  <div className="relative">
                    <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                      isScrolledStyle 
                        ? `bg-gradient-to-br ${getGradientColorScrolled()} text-white shadow-md` 
                        : 'bg-white/20 text-white backdrop-blur-md'
                    }`}>
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className={`text-sm font-semibold transition-colors duration-300 ${
                      isScrolledStyle ? 'text-gray-800' : 'text-white'
                    }`}>
                      {session.user?.name?.split(' ')[0]}
                    </p>
                    <p className={`text-[10px] transition-colors duration-300 capitalize ${
                      isScrolledStyle ? 'text-gray-500' : 'text-white/70'
                    }`}>
                      {userRole}
                    </p>
                  </div>
                  <FiChevronDown size={16} className={`transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''} ${
                    isScrolledStyle ? 'text-gray-600' : 'text-white/80'
                  }`} />
                </motion.button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, type: 'spring', stiffness: 300 }}
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
                              <p className="text-xl font-bold text-gray-800">
                                {session.user?.name}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {session.user?.email}
                              </p>
                              <div className="mt-2">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${getBadgeColor()}`}>
                                  <div className={`w-1.5 h-1.5 rounded-full`}></div>
                                  {userRole}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-3 px-4 border-t border-gray-100">
                        <Link
                          href={`/${userRole.toLowerCase()}/profile`}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-all">
                            <FiUser size={16} className="text-gray-600 group-hover:text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Profile Settings</p>
                            <p className="text-xs text-gray-400">Manage your account</p>
                          </div>
                        </Link>
                        <button
                          onClick={() => {
                            signOut({ redirect: true, callbackUrl: '/login' });
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-all">
                            <FiLogOut size={16} className="text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Sign Out</p>
                            <p className="text-xs text-gray-400">Logout from account</p>
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
              transition={{ duration: 0.4, type: 'spring', damping: 25 }}
              className="lg:hidden overflow-hidden"
            >
              <div className={`px-4 py-6 border-t ${
                isScrolledStyle ? 'bg-white border-gray-100' : `bg-gradient-to-r ${getGradientColor()} bg-opacity-95 border-opacity-20`
              }`}>
                <div className="space-y-2">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                            active
                              ? isScrolledStyle
                                ? getActiveBgColor()
                                : 'bg-white/20 text-white'
                              : isScrolledStyle
                                ? `text-gray-600 hover:bg-gray-50 ${getHoverBgColor()}`
                                : 'text-white/90 hover:bg-white/10'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Icon size={22} />
                          <div>
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className={`text-xs ${active ? 'opacity-80' : 'opacity-60'}`}>
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
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
              transition={{ type: 'spring', damping: 25 }}
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
                    placeholder={
                      userRole === 'controller' 
                        ? "Search members, bazaar, reports..." 
                        : userRole === 'manager'
                        ? "Search bazaar, meals, members..."
                        : "Search meals, balance, history..."
                    }
                    className="flex-1 outline-none text-gray-800 placeholder-gray-400 text-lg font-medium"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className={`px-6 py-2.5 bg-gradient-to-r ${getGradientColorScrolled()} text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium`}
                  >
                    Search
                  </button>
                </div>
                {searchQuery && (
                  <div className="px-5 pb-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 py-3">Popular searches</p>
                    <div className="flex gap-2 flex-wrap">
                      {(userRole === 'controller' 
                        ? ['Members', 'Bazaar', 'Reports', 'Deposits']
                        : userRole === 'manager'
                        ? ['Bazaar Entry', 'Meal Control', 'Expenses', 'Analytics']
                        : ['Meals', 'Balance', 'History', 'Settings']
                      ).map((item) => (
                        <button
                          key={item}
                          onClick={() => setSearchQuery(item)}
                          className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-xl hover:bg-blue-100 hover:text-blue-600 transition-all"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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