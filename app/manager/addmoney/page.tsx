'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import Swal from 'sweetalert2';
import { alluser } from '@/actions/server/user';
import { addMoney, getMoneyEntries, deleteMoneyEntry, getMoneyStats, getMemberBalance } from '@/actions/server/money';
import MoneyStats from '@/Components/Money/MoneyStats';
import MoneyForm from '@/Components/Money/MoneyForm';
import TransactionTable from '@/Components/Money/TransactionTable';


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

        <MoneyStats 
          totalDeposit={stats.totalDeposit}
          totalWithdrawal={stats.totalWithdrawal}
          totalBalance={stats.totalBalance}
        />

        <MoneyForm
          members={members}
          selectedMember={selectedMember}
          setSelectedMember={setSelectedMember}
          amount={amount}
          setAmount={setAmount}
          transactionType={transactionType}
          setTransactionType={setTransactionType}
          transactionDate={transactionDate}
          setTransactionDate={setTransactionDate}
          description={description}
          setDescription={setDescription}
          selectedMemberBalance={selectedMemberBalance}
          loading={loading}
          onSubmit={handleSubmit}
        />

        <TransactionTable
          entries={moneyEntries}
          onDelete={handleDeleteMoney}
          totalTransactions={stats.totalTransactions}
        />
      </div>
    </div>
  );
};

export default AddMoneyPage;