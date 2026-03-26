'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface MoneyStatsProps {
  totalDeposit: number;
  totalWithdrawal: number;
  totalBalance: number;
}

const MoneyStats = ({ totalDeposit, totalWithdrawal, totalBalance }: MoneyStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-600">
        <div className="flex items-center justify-between mb-2">
          <p className="text-slate-600 text-sm">Total Deposit</p>
          <TrendingUp className="text-indigo-600" size={20} />
        </div>
        <p className="text-3xl font-bold text-indigo-600">৳{totalDeposit.toFixed(2)}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-600">
        <div className="flex items-center justify-between mb-2">
          <p className="text-slate-600 text-sm">Total Withdrawal</p>
          <TrendingDown className="text-red-600" size={20} />
        </div>
        <p className="text-3xl font-bold text-red-600">৳{totalWithdrawal.toFixed(2)}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-600">
        <div className="flex items-center justify-between mb-2">
          <p className="text-slate-600 text-sm">Total Balance</p>
          <DollarSign className="text-emerald-600" size={20} />
        </div>
        <p className="text-3xl font-bold text-emerald-600">৳{totalBalance.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default MoneyStats;