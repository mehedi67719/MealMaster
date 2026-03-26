'use server';

import { dbconnection } from "@/Components/lib/dbconnection";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import { authOptions } from "@/Components/lib/authoptions";

interface MoneyEntry {
  memberId: string;
  memberName: string;
  amount: number;
  previousBalance: number;
  newBalance: number;
  date: string;
  description?: string;
  transactionType: 'deposit' | 'withdrawal';
  timestamp: string;
  messName: string;
  messSecretCode: string;
  createdBy: string;
  createdByName: string;
  createdByEmail: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const checkAccess = async () => {
  const session = await getServerSession(authOptions);

  console.log(session)
  
  if (!session) {
    return { success: false, message: 'আপনি লগইন করেননি' };
  }
  
  if (session.user?.accountType !== 'controller' && session.user?.accountType !== 'manager') {
    return { success: false, message: 'শুধুমাত্র ম্যানেজার বা কন্ট্রোলার টাকা যোগ করতে পারেন' };
  }
  
  if (!session.user?.messName || !session.user?.messSecretCode) {
    return { success: false, message: 'আপনার মেস তথ্য পাওয়া যায়নি' };
  }
  
  return { 
    success: true, 
    messName: session.user.messName,
    messSecretCode: session.user.messSecretCode,
    user: session.user,
    userId: session.user.id,
    userName: session.user.name,
    userEmail: session.user.email
  };
};

export const addMoney = async (data: any) => {
  try {
    const access = await checkAccess();
    if (!access.success) {
      return access;
    }
    
    const moneycollection = await dbconnection("money");
    const usersCollection = await dbconnection("users");
    
    const currentUser = await usersCollection.findOne({ 
      _id: new ObjectId(data.memberId),
      messName: access.messName,
      messSecretCode: access.messSecretCode
    });
    
    if (!currentUser) {
      return { success: false, message: 'সদস্য পাওয়া যায়নি বা আপনার মেসের সদস্য নয়' };
    }
    
    let currentBalance = currentUser.balance || 0;
    let newBalance = currentBalance;
    
    if (data.transactionType === 'deposit') {
      newBalance = currentBalance + data.amount;
    } else {
      if (currentBalance < data.amount) {
        return { success: false, message: `পর্যাপ্ত ব্যালেন্স নেই। বর্তমান ব্যালেন্স: ৳${currentBalance}` };
      }
      newBalance = currentBalance - data.amount;
    }
    
    const updateResult = await usersCollection.updateOne(
      { 
        _id: new ObjectId(data.memberId),
        messName: access.messName,
        messSecretCode: access.messSecretCode
      },
      { 
        $set: { 
          balance: newBalance, 
          updatedAt: new Date() 
        } 
      }
    );
    
    if (updateResult.modifiedCount === 0) {
      return { success: false, message: 'ব্যালেন্স আপডেট করতে ব্যর্থ হয়েছে' };
    }
    
    const result = await moneycollection.insertOne({
      ...data,
      previousBalance: currentBalance,
      newBalance: newBalance,
      messName: access.messName,
      messSecretCode: access.messSecretCode,
      createdBy: access.userId,
      createdByName: access.userName,
      createdByEmail: access.userEmail,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return { 
      success: true, 
      message: data.transactionType === 'deposit' ? `টাকা জমা হয়েছে। নতুন ব্যালেন্স: ৳${newBalance}` : `টাকা উত্তোলন হয়েছে। নতুন ব্যালেন্স: ৳${newBalance}`, 
      id: result.insertedId.toString(),
      data: {
        ...data,
        previousBalance: currentBalance,
        newBalance: newBalance,
        createdBy: access.userName,
        createdByEmail: access.userEmail
      }
    };
  } catch (error: any) {
    console.error('Add money error:', error);
    return { success: false, message: 'টাকা যোগ করতে ব্যর্থ হয়েছে', error: error.message };
  }
};

export const getMoneyEntries = async (memberId?: string) => {
  try {
    const access = await checkAccess();
    if (!access.success) {
      return access;
    }
    
    const moneycollection = await dbconnection("money");
    const query: any = { 
      messName: access.messName,
      messSecretCode: access.messSecretCode
    };
    
    if (memberId) {
      query.memberId = memberId;
    }
    
    const result = await moneycollection.find(query).sort({ createdAt: -1 }).toArray();
    
    const serializedData = result.map(item => ({
      _id: item._id?.toString(),
      memberId: item.memberId,
      memberName: item.memberName,
      amount: item.amount,
      previousBalance: item.previousBalance,
      newBalance: item.newBalance,
      date: item.date,
      description: item.description,
      transactionType: item.transactionType,
      timestamp: item.timestamp,
      messName: item.messName,
      createdBy: item.createdByName,
      createdByEmail: item.createdByEmail,
      createdAt: item.createdAt?.toISOString(),
      updatedAt: item.updatedAt?.toISOString()
    }));
    
    return { success: true, message: 'ডেটা সফলভাবে প্রাপ্ত হয়েছে', data: serializedData };
  } catch (error: any) {
    console.error('Get entries error:', error);
    return { success: false, message: 'ডেটা প্রাপ্তিতে ব্যর্থ হয়েছে', error: error.message };
  }
};

export const deleteMoneyEntry = async (id: string) => {
  try {
    const access = await checkAccess();
    if (!access.success) {
      return access;
    }
    
    const moneycollection = await dbconnection("money");
    const usersCollection = await dbconnection("users");
    
    const existingEntry = await moneycollection.findOne({ 
      _id: new ObjectId(id),
      messName: access.messName,
      messSecretCode: access.messSecretCode
    });
    
    if (!existingEntry) {
      return { success: false, message: 'এন্ট্রি পাওয়া যায়নি বা আপনার অনুমতি নেই' };
    }
    
    const currentUser = await usersCollection.findOne({ 
      _id: new ObjectId(existingEntry.memberId),
      messName: access.messName,
      messSecretCode: access.messSecretCode
    });
    
    if (currentUser) {
      let newBalance = currentUser.balance || 0;
      
      if (existingEntry.transactionType === 'deposit') {
        newBalance = newBalance - existingEntry.amount;
      } else {
        newBalance = newBalance + existingEntry.amount;
      }
      
      await usersCollection.updateOne(
        { 
          _id: new ObjectId(existingEntry.memberId),
          messName: access.messName,
          messSecretCode: access.messSecretCode
        },
        { $set: { balance: newBalance, updatedAt: new Date() } }
      );
    }
    
    const result = await moneycollection.deleteOne({ 
      _id: new ObjectId(id),
      messName: access.messName,
      messSecretCode: access.messSecretCode
    });
    
    if (result.deletedCount === 0) {
      return { success: false, message: 'এন্ট্রি পাওয়া যায়নি' };
    }
    
    return { success: true, message: 'লেনদেন ডিলিট হয়েছে', deletedCount: result.deletedCount };
  } catch (error: any) {
    console.error('Delete entry error:', error);
    return { success: false, message: 'ডিলিট করতে ব্যর্থ হয়েছে', error: error.message };
  }
};

export const getMemberBalance = async (memberId?: string) => {
  try {
    const access = await checkAccess();
    if (!access.success) {
      return access;
    }
    
    const usersCollection = await dbconnection("users");
    const query: any = { 
      messName: access.messName,
      messSecretCode: access.messSecretCode
    };
    
    if (memberId) {
      query._id = new ObjectId(memberId);
      const user = await usersCollection.findOne(query);
      
      if (!user) {
        return { success: false, message: 'সদস্য পাওয়া যায়নি' };
      }
      
      return { 
        success: true, 
        message: 'ব্যালেন্স প্রাপ্ত হয়েছে', 
        data: {
          userId: user._id.toString(),
          name: user.name,
          email: user.email,
          balance: user.balance || 0
        }
      };
    } else {
      const allUsers = await usersCollection.find(query).toArray();
      const balances = allUsers.map(user => ({
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        balance: user.balance || 0
      }));
      
      const totalBalance = balances.reduce((sum, user) => sum + user.balance, 0);
      
      return { 
        success: true, 
        message: 'ব্যালেন্স প্রাপ্ত হয়েছে', 
        data: {
          users: balances,
          totalBalance: totalBalance,
          totalMembers: balances.length
        }
      };
    }
  } catch (error: any) {
    console.error('Get balance error:', error);
    return { success: false, message: 'ব্যালেন্স প্রাপ্তিতে ব্যর্থ হয়েছে', error: error.message };
  }
};

export const getMoneyStats = async (memberId?: string) => {
  try {
    const access = await checkAccess();
    if (!access.success) {
      return access;
    }
    
    const moneycollection = await dbconnection("money");
    const query: any = { 
      messName: access.messName,
      messSecretCode: access.messSecretCode
    };
    
    if (memberId) {
      query.memberId = memberId;
    }
    
    const result = await moneycollection.find(query).toArray();
    
    const totalDeposit = result
      .filter(item => item.transactionType === 'deposit')
      .reduce((sum, item) => sum + item.amount, 0);
    
    const totalWithdrawal = result
      .filter(item => item.transactionType === 'withdrawal')
      .reduce((sum, item) => sum + item.amount, 0);
    
    const memberBalances = await getMemberBalance();
    const totalBalance = memberBalances.success ? memberBalances.data.totalBalance : 0;
    
    const recentTransactions = await moneycollection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();
    
    const recentData = recentTransactions.map(item => ({
      _id: item._id?.toString(),
      memberName: item.memberName,
      amount: item.amount,
      transactionType: item.transactionType,
      date: item.date,
      createdBy: item.createdByName,
      previousBalance: item.previousBalance,
      newBalance: item.newBalance
    }));
    
    return { 
      success: true, 
      message: 'স্ট্যাটাস সফলভাবে প্রাপ্ত হয়েছে',
      data: {
        totalDeposit,
        totalWithdrawal,
        totalBalance,
        totalTransactions: result.length,
        recentTransactions: recentData
      }
    };
  } catch (error: any) {
    console.error('Get stats error:', error);
    return { success: false, message: 'স্ট্যাটাস প্রাপ্তিতে ব্যর্থ হয়েছে', error: error.message };
  }
};

export const initializeUserBalance = async () => {
  try {
    const access = await checkAccess();
    if (!access.success) {
      return access;
    }
    
    const usersCollection = await dbconnection("users");
    
    const result = await usersCollection.updateMany(
      { 
        messName: access.messName,
        messSecretCode: access.messSecretCode,
        balance: { $exists: false }
      },
      { $set: { balance: 0, updatedAt: new Date() } }
    );
    
    return { 
      success: true, 
      message: `${result.modifiedCount} জন সদস্যের ব্যালেন্স ইনিশিয়ালাইজ করা হয়েছে`,
      modifiedCount: result.modifiedCount
    };
  } catch (error: any) {
    console.error('Initialize balance error:', error);
    return { success: false, message: 'ব্যালেন্স ইনিশিয়ালাইজ করতে ব্যর্থ হয়েছে', error: error.message };
  }
};