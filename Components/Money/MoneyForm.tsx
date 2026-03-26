'use client';

import React from 'react';
import { Calendar, Loader } from 'lucide-react';

interface Member {
  _id: string;
  name: string;
  email: string;
}

interface MoneyFormProps {
  members: Member[];
  selectedMember: string;
  setSelectedMember: (id: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  transactionType: 'deposit' | 'withdrawal';
  setTransactionType: (type: 'deposit' | 'withdrawal') => void;
  transactionDate: string;
  setTransactionDate: (date: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  selectedMemberBalance: number;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const MoneyForm = ({
  members,
  selectedMember,
  setSelectedMember,
  amount,
  setAmount,
  transactionType,
  setTransactionType,
  transactionDate,
  setTransactionDate,
  description,
  setDescription,
  selectedMemberBalance,
  loading,
  onSubmit
}: MoneyFormProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-slate-100">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Add New Transaction</h2>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Member</label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">-- Select Member --</option>
              {members.map(member => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
            {selectedMember && (
              <p className="mt-2 text-sm text-slate-600">
                Current Balance: <span className="font-bold text-indigo-600">৳{selectedMemberBalance.toFixed(2)}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Amount (৳)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Transaction Type</label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value as 'deposit' | 'withdrawal')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="deposit">Deposit (+) Add Money</option>
              <option value="withdrawal">Withdrawal (-) Remove Money</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-indigo-500" />
              <input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write any notes..."
            rows={3}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader size={18} className="animate-spin" />}
          {loading ? 'Processing...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
};

export default MoneyForm;