'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MdEmail, MdPhone, MdLocationOn, MdFacebook, MdArrowUpward, MdDashboard, MdPeople, MdAssignment, MdFastfood, MdReceipt } from 'react-icons/md';
import { FiLinkedin, FiTwitter } from 'react-icons/fi';
import { SiInstagram } from 'react-icons/si';
import Link from 'next/link';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Dashboard', href: '/', icon: MdDashboard },
    { label: 'Members', href: '/members', icon: MdPeople },
    { label: 'Bazaar Entry', href: '/bazaar-entry', icon: MdAssignment },
    { label: 'Meals', href: '/meals', icon: MdFastfood },
    { label: 'Reports', href: '/reports', icon: MdReceipt },
  ];

  const features = [
    { title: 'Member Management', desc: 'Manage all members efficiently' },
    { title: 'Expense Tracking', desc: 'Track bazaar and meal costs' },
    { title: 'Meal Calculation', desc: 'Automatic meal rate calculation' },
  ];

  return (
    <footer className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 w-80 h-80 bg-teal-400 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
            <motion.div variants={itemVariants} className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-300 to-teal-400 flex items-center justify-center text-xl font-bold shadow-lg">
                    🍽️
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-300">MealMaster</h3>
                    <p className="text-xs text-emerald-200">v1.0.0</p>
                  </div>
                </div>
                <p className="text-emerald-100 text-xs leading-tight">
                  Comprehensive mess management system for tracking expenses and members.
                </p>
              </div>
              <div className="flex gap-2">
                <motion.a
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="p-2 bg-emerald-700 hover:bg-emerald-600 rounded-full transition-all duration-300 shadow-lg"
                  title="Facebook"
                >
                  <MdFacebook size={14} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="p-2 bg-emerald-700 hover:bg-emerald-600 rounded-full transition-all duration-300 shadow-lg"
                  title="Twitter"
                >
                  <FiTwitter size={14} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="p-2 bg-emerald-700 hover:bg-emerald-600 rounded-full transition-all duration-300 shadow-lg"
                  title="LinkedIn"
                >
                  <FiLinkedin size={14} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-full transition-all duration-300 shadow-lg"
                  title="Instagram"
                >
                  <SiInstagram size={14} />
                </motion.a>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <h4 className="text-sm font-bold text-emerald-300 mb-2">Quick Links</h4>
              <nav className="space-y-1.5">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ x: 3 }}
                      className="transition-all"
                    >
                      <Link
                        href={link.href}
                        className="flex items-center gap-1.5 text-emerald-200 hover:text-emerald-100 transition-colors text-xs group"
                      >
                        <Icon size={14} className="text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <h4 className="text-sm font-bold text-emerald-300 mb-2">Features</h4>
              <nav className="space-y-1.5">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 3 }}
                    className="transition-all"
                  >
                    <a href="#" className="text-emerald-200 hover:text-emerald-100 transition-colors text-xs group">
                      <p className="font-medium">→ {feature.title}</p>
                      <p className="text-xs text-emerald-300/70">{feature.desc}</p>
                    </a>
                  </motion.div>
                ))}
              </nav>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <h4 className="text-sm font-bold text-emerald-300 mb-2">Contact</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2 group text-xs">
                  <MdLocationOn size={14} className="text-emerald-400 flex-shrink-0 mt-0.5 group-hover:text-emerald-300 transition-colors" />
                  <div>
                    <p className="text-emerald-100 font-medium">Address</p>
                    <p className="text-emerald-200 text-xs">123 Main Street, Dhaka</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 group text-xs">
                  <MdPhone size={14} className="text-emerald-400 flex-shrink-0 group-hover:text-emerald-300 transition-colors" />
                  <a href="tel:+8801700000000" className="text-emerald-200 hover:text-emerald-100 transition-colors">
                    +880 1700 000 000
                  </a>
                </div>
                <div className="flex items-center gap-2 group text-xs">
                  <MdEmail size={14} className="text-emerald-400 flex-shrink-0 group-hover:text-emerald-300 transition-colors" />
                  <a href="mailto:info@mealpro.com" className="text-emerald-200 hover:text-emerald-100 transition-colors">
                    info@mealpro.com
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-px bg-gradient-to-r from-transparent via-emerald-700 to-transparent mb-3"
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
          >
            <motion.div variants={itemVariants} className="text-emerald-200 text-center sm:text-left">
              <p>
                &copy; {currentYear} <span className="text-emerald-300 font-semibold">MealMaster</span> | 
                <motion.a
                  whileHover={{ textDecoration: 'underline', color: '#a7f3d0' }}
                  href="#"
                  className="ml-2 text-emerald-200 hover:text-emerald-100 transition-colors"
                >
                  Privacy
                </motion.a>
                {' '}|{' '}
                <motion.a
                  whileHover={{ textDecoration: 'underline', color: '#a7f3d0' }}
                  href="#"
                  className="text-emerald-200 hover:text-emerald-100 transition-colors"
                >
                  Terms
                </motion.a>
              </p>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-full transition-all duration-300 text-xs font-semibold shadow-lg hover:shadow-xl"
            >
              <span>Back to Top</span>
              <MdArrowUpward size={14} />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;