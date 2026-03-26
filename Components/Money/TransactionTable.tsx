'use client';

import React from 'react';
import { DollarSign, Trash2 } from 'lucide-react';

interface MoneyEntry {
  _id?: string;
  memberId: string;
  memberName: string;
  amount: number;
  previousBalance: number;
  newBalance: number;
  date: string;
  description?: string;
  transactionType: 'deposit' | 'withdrawal';
  createdBy?: string;
  createdByEmail?: string;
}

interface TransactionTableProps {
  entries: MoneyEntry[];
  onDelete: (id: string) => void;
  totalTransactions: number;
}

const TransactionTable = ({ entries, onDelete, totalTransactions }: TransactionTableProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800">Transaction History</h2>
        <p className="text-slate-500 text-sm mt-1">Total transactions: {totalTransactions}</p>
      </div>

      {entries.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Member</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Type</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Amount</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Balance Change</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Created By</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((entry) => (
                <tr key={entry._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-800">{entry.memberName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">ID: {entry.memberId.slice(-6)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      entry.transactionType === 'deposit'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        entry.transactionType === 'deposit' ? 'bg-emerald-500' : 'bg-red-500'
                      }`}></span>
                      {entry.transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${
                    entry.transactionType === 'deposit'
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }`}>
                    {entry.transactionType === 'deposit' ? '+' : '-'} ৳{entry.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm">
                      <p className="text-slate-500">Previous: ৳{entry.previousBalance.toFixed(2)}</p>
                      <p className="font-semibold text-indigo-600">New: ৳{entry.newBalance.toFixed(2)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                    {entry.description || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-medium text-slate-700">{entry.createdBy}</p>
                      <p className="text-xs text-slate-500">{entry.createdByEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onDelete(entry._id!)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <DollarSign className="text-slate-400" size={32} />
          </div>
          <p className="text-slate-500 text-lg">No transactions found</p>
          <p className="text-slate-400 text-sm mt-1">Add your first transaction to get started</p>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;