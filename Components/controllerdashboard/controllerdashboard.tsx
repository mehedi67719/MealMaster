'use client';

import BalanceTable from '@/Components/controllerdashboard/BalanceTable';
import ChartsSection from '@/Components/controllerdashboard/ChartsSection';
import BazaarChart from '@/Components/controllerdashboard/BazaarChart';
import RecentActivity from '@/Components/controllerdashboard/RecentActivity';
import Header from '@/Components/controllerdashboard/Header';
import Sidebar from '@/Components/controllerdashboard/Sidebar';
import StatsSection from '@/Components/controllerdashboard/StatsSection';
import React from 'react';

const ControllerDashboard = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-green-50 min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <StatsSection />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ChartsSection />
            <BazaarChart />
            <BalanceTable />
            <RecentActivity />
          </div>
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default ControllerDashboard;