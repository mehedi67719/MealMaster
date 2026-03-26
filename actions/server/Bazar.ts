'use server';

import { authOptions } from "@/Components/lib/authoptions";
import { dbconnection } from "@/Components/lib/dbconnection";
import { ObjectId } from 'mongodb';
import { getServerSession } from "next-auth";

interface BazarItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

interface BazarData {
  _id?: ObjectId;
  date: string;
  items: BazarItem[];
  totalAmount: number;
  notes?: string;
  timestamp: string;
  messName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const checkManagerAccess = async () => {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Session data:', JSON.stringify(session, null, 2));
    
    if (!session) {
      return { success: false, message: 'আপনি লগইন করেননি', error: 'Unauthorized' };
    }
    
    const user = session.user as any;
    
    if (!user) {
      return { success: false, message: 'ব্যবহারকারীর তথ্য পাওয়া যায়নি', error: 'User Info Missing' };
    }
    
    if (user.accountType !== 'manager' && user.accountType !== 'controller') {
      return { 
        success: false, 
        message: `শুধুমাত্র ম্যানেজার বা কন্ট্রোলার বাজার এন্ট্রি করতে পারেন। আপনার একাউন্ট টাইপ: ${user.accountType}`,
        error: 'Access Denied' 
      };
    }
    
    if (!user.messName) {
      return { success: false, message: 'আপনার মেস তথ্য পাওয়া যায়নি', error: 'Mess Info Missing' };
    }
    
    return { 
      success: true, 
      messName: user.messName, 
      user: user,
      accountType: user.accountType 
    };
  } catch (error: any) {
    console.error('Session check error:', error);
    return { success: false, message: 'সেশন চেক করতে ব্যর্থ হয়েছে', error: error.message };
  }
};

export const postBazar = async (barazdata: any) => {
  try {
    const access = await checkManagerAccess();
    if (!access.success) {
      console.log('Access denied:', access.message);
      return access;
    }
    
    console.log('Posting bazar for mess:', access.messName);
    
    const bazarcollection = await dbconnection("bazar");
    const result = await bazarcollection.insertOne({
      ...barazdata,
      messName: access.messName,
      createdBy: access.user.email,
      createdByType: access.accountType,
      createdAt: new Date(),
      updatedAt: new Date()
    } as BazarData);
    
    return { 
      success: true, 
      message: 'বাজার এন্ট্রি সফলভাবে সংরক্ষিত হয়েছে', 
      id: result.insertedId.toString(),
      data: barazdata 
    };
  } catch (error: any) {
    console.error('Post error:', error);
    return { success: false, message: 'বাজার এন্ট্রি সংরক্ষণে ব্যর্থ হয়েছে', error: error.message };
  }
};

export const getBazar = async (date?: string) => {
  try {
    const access = await checkManagerAccess();
    if (!access.success) {
      console.log('Access denied for get:', access.message);
      return access;
    }
    
    console.log('Fetching bazar for mess:', access.messName);
    
    const bazarcollection = await dbconnection("bazar");
    const query: any = { messName: access.messName };
    if (date) {
      query.date = date;
    }
    
    const result = await bazarcollection.find(query).sort({ createdAt: -1 }).toArray();
    
    console.log(`Found ${result.length} entries for mess ${access.messName}`);
    
    const serializedData = result.map(item => ({
      _id: item._id?.toString(),
      date: item.date,
      items: item.items,
      totalAmount: item.totalAmount,
      notes: item.notes,
      timestamp: item.timestamp,
      messName: item.messName,
      createdAt: item.createdAt?.toISOString(),
      updatedAt: item.updatedAt?.toISOString()
    }));
    
    return { success: true, message: 'ডেটা সফলভাবে প্রাপ্ত হয়েছে', data: serializedData };
  } catch (error: any) {
    console.error('Get error:', error);
    return { success: false, message: 'ডেটা প্রাপ্তিতে ব্যর্থ হয়েছে', error: error.message };
  }
};

export const putBazar = async (id: string, updateData: any) => {
  try {
    const access = await checkManagerAccess();
    if (!access.success) {
      return access;
    }
    
    console.log('Updating bazar entry:', id, 'for mess:', access.messName);
    
    const bazarcollection = await dbconnection("bazar");
    
    const existingEntry = await bazarcollection.findOne({ 
      _id: new ObjectId(id),
      messName: access.messName 
    });
    
    if (!existingEntry) {
      return { success: false, message: 'এন্ট্রি পাওয়া যায়নি বা আপনার অনুমতি নেই' };
    }
    
    const result = await bazarcollection.updateOne(
      { _id: new ObjectId(id), messName: access.messName },
      { $set: { ...updateData, updatedAt: new Date(), updatedBy: access.user.email } }
    );
    
    if (result.matchedCount === 0) {
      return { success: false, message: 'এন্ট্রি পাওয়া যায়নি' };
    }
    
    return { success: true, message: 'বাজার এন্ট্রি আপডেট হয়েছে', modifiedCount: result.modifiedCount };
  } catch (error: any) {
    console.error('Put error:', error);
    return { success: false, message: 'আপডেটে ব্যর্থ হয়েছে', error: error.message };
  }
};

export const deleteBazar = async (id: string) => {
  try {
    const access = await checkManagerAccess();
    if (!access.success) {
      return access;
    }
    
    console.log('Deleting bazar entry:', id, 'for mess:', access.messName);
    
    const bazarcollection = await dbconnection("bazar");
    
    const existingEntry = await bazarcollection.findOne({ 
      _id: new ObjectId(id),
      messName: access.messName 
    });
    
    if (!existingEntry) {
      return { success: false, message: 'এন্ট্রি পাওয়া যায়নি বা আপনার অনুমতি নেই' };
    }
    
    const result = await bazarcollection.deleteOne({ 
      _id: new ObjectId(id),
      messName: access.messName 
    });
    
    if (result.deletedCount === 0) {
      return { success: false, message: 'এন্ট্রি পাওয়া যায়নি' };
    }
    
    return { success: true, message: 'বাজার এন্ট্রি ডিলিট হয়েছে', deletedCount: result.deletedCount };
  } catch (error: any) {
    console.error('Delete error:', error);
    return { success: false, message: 'ডিলিট করতে ব্যর্থ হয়েছে', error: error.message };
  }
};

export const getBazarStats = async (startDate?: string, endDate?: string) => {
  try {
    const access = await checkManagerAccess();
    if (!access.success) {
      return access;
    }
    
    console.log('Getting stats for mess:', access.messName);
    
    const bazarcollection = await dbconnection("bazar");
    const query: any = { messName: access.messName };
    
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    const result = await bazarcollection.find(query).sort({ date: -1 }).toArray();
    
    const totalExpense = result.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
    const averageExpense = result.length > 0 ? totalExpense / result.length : 0;
    
    const serializedData = result.map(item => ({
      _id: item._id?.toString(),
      date: item.date,
      totalAmount: item.totalAmount,
      notes: item.notes
    }));
    
    return { 
      success: true, 
      message: 'স্ট্যাটাস সফলভাবে প্রাপ্ত হয়েছে',
      data: {
        totalEntries: result.length,
        totalExpense,
        averageExpense,
        entries: serializedData
      }
    };
  } catch (error: any) {
    console.error('Stats error:', error);
    return { success: false, message: 'স্ট্যাটাস প্রাপ্তিতে ব্যর্থ হয়েছে', error: error.message };
  }
};