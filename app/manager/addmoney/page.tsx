'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Loader, DollarSign, User, TrendingUp, TrendingDown } from 'lucide-react';
import Swal from 'sweetalert2';
import { alluser } from '@/actions/server/user';
import { addMoney, getMoneyEntries, deleteMoneyEntry, getMoneyStats, getMemberBalance } from '@/actions/server/money';


interface Member {
  _id: string;
  name: string;
  email: string;
  balance?: number;
}

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
  timestamp?: string;
  createdBy?: string;
  createdByEmail?: string;
}

const AddMoneyPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [moneyEntries, setMoneyEntries] = useState<MoneyEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalDeposit: 0,
    totalWithdrawal: 0,
    totalBalance: 0,
    totalTransactions: 0,
    recentTransactions: []
  });

  const [selectedMember, setSelectedMember] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMemberBalance, setSelectedMemberBalance] = useState(0);

  useEffect(() => {
    loadMembers();
    loadMoneyEntries();
    loadStats();
  }, []);

  useEffect(() => {
    if (selectedMember) {
      loadMemberBalance();
    }
  }, [selectedMember]);

  const loadMembers = async () => {
    try {
      const result = await alluser();
      if (result && Array.isArray(result)) {
        setMembers(result);
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  };

  const loadMemberBalance = async () => {
    try {
      const result = await getMemberBalance(selectedMember);
      if (result.success && result.data) {
        setSelectedMemberBalance(result.data.balance || 0);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const loadMoneyEntries = async () => {
    try {
      setLoading(true);
      const result = await getMoneyEntries();
      if (result.success) {
        setMoneyEntries(result.data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const result = await getMoneyStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleAddMoney = async (data: any) => {
    try {
      setLoading(true);
      const result = await addMoney(data);
      
      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: 'সফল!',
          html: `
            <div class="text-left">
              <p><strong>${data.transactionType === 'deposit' ? 'জমা' : 'উত্তোলন'}</strong> হয়েছে</p>
              <p>পরিমাণ: ৳${data.amount}</p>
              <p>পূর্বের ব্যালেন্স: ৳${result.data.previousBalance}</p>
              <p>বর্তমান ব্যালেন্স: ৳${result.data.newBalance}</p>
              <p class="text-sm text-gray-500 mt-2">করেছেন: ${result.data.createdBy}</p>
            </div>
          `,
          confirmButtonColor: '#16a34a',
          timer: 3000,
          showConfirmButton: true
        });
        await loadMoneyEntries();
        await loadStats();
        await loadMemberBalance();
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'ত্রুটি!',
        text: error.message,
        confirmButtonColor: '#dc2626'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMoney = async (id: string) => {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'নিশ্চিত?',
      text: 'এই লেনদেন ডিলিট করতে চান?',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'হ্যাঁ, ডিলিট',
      cancelButtonText: 'না'
    });

    if (confirm.isConfirmed) {
      try {
        setLoading(true);
        const result = await deleteMoneyEntry(id);
        
        if (result.success) {
          await Swal.fire({
            icon: 'success',
            title: 'ডিলিট সফল!',
            text: result.message,
            confirmButtonColor: '#16a34a',
            timer: 1500,
            showConfirmButton: true
          });
          await loadMoneyEntries();
          await loadStats();
          await loadMemberBalance();
        } else {
          throw new Error(result.message);
        }
      } catch (error: any) {
        await Swal.fire({
          icon: 'error',
          title: 'ত্রুটি!',
          text: error.message,
          confirmButtonColor: '#dc2626'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMember || !amount) {
      await Swal.fire({
        icon: 'warning',
        title: 'সতর্কতা',
        text: 'সদস্য এবং পরিমাণ উভয়ই প্রয়োজন!',
        confirmButtonColor: '#16a34a'
      });
      return;
    }

    if (transactionType === 'withdrawal' && parseFloat(amount) > selectedMemberBalance) {
      await Swal.fire({
        icon: 'warning',
        title: 'পর্যাপ্ত ব্যালেন্স নেই',
        text: `বর্তমান ব্যালেন্স: ৳${selectedMemberBalance}`,
        confirmButtonColor: '#16a34a'
      });
      return;
    }

    const selectedMemberData = members.find(m => m._id === selectedMember);
    if (!selectedMemberData) return;

    const submissionData = {
      memberId: selectedMember,
      memberName: selectedMemberData.name,
      amount: parseFloat(amount),
      date: transactionDate,
      description: description,
      transactionType: transactionType,
      timestamp: new Date().toISOString()
    };

    const success = await handleAddMoney(submissionData);

    if (success) {
      setSelectedMember('');
      setAmount('');
      setDescription('');
      setTransactionType('deposit');
      setTransactionDate(new Date().toISOString().split('T')[0]);
      setSelectedMemberBalance(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                  <DollarSign className="text-white" size={28} />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Money Management
                </h1>
              </div>
              <p className="text-slate-500 ml-14">Track member deposits, withdrawals and balances</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-600">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-600 text-sm">Total Deposit</p>
              <TrendingUp className="text-indigo-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-indigo-600">৳{stats.totalDeposit.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-600">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-600 text-sm">Total Withdrawal</p>
              <TrendingDown className="text-red-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-red-600">৳{stats.totalWithdrawal.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-600">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-600 text-sm">Total Balance</p>
              <DollarSign className="text-emerald-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-emerald-600">৳{stats.totalBalance.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-slate-100">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Add New Transaction</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
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

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800">Transaction History</h2>
            <p className="text-slate-500 text-sm mt-1">Total transactions: {stats.totalTransactions}</p>
          </div>

          {moneyEntries.length > 0 ? (
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
                  {moneyEntries.map((entry) => (
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
                          onClick={() => handleDeleteMoney(entry._id!)}
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
      </div>
    </div>
  );
};

export default AddMoneyPage;