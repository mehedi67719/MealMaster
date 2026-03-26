'use server';

import { dbconnection } from "@/Components/lib/dbconnection";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/Components/lib/authoptions";


export const alluser = async () => {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return {
        success: false,
        error: "Unauthorized",
        data: null,
      };
    }

    const usersCollection = await dbconnection('users');
    
    const currentUser = await usersCollection.findOne({
      email: session.user.email,
    });

    if (!currentUser) {
      return {
        success: false,
        error: "Current user not found",
        data: null,
      };
    }

    const query: Record<string, any> = {};
    
    if (currentUser.accountType === 'controller') {
      query.messSecretCode = currentUser.messSecretCode;
    }

    const result = await usersCollection.find(query).toArray();
    
    const formattedResult = result.map((user: any) => ({
      _id: user._id?.toString() || '',
      name: user.name || '',
      email: user.email || '',
      accountType: user.accountType || 'member',
      messName: user.messName || '',
      messSecretCode: user.messSecretCode || '',
      createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt || '',
    }));

    return {
      success: true,
      data: formattedResult,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch users";
    return {
      success: false,
      error: errorMessage,
      data: null,
    };
  }
};

export const updateUserAccountType = async (userId: string, accountType: 'member' | 'controller' | 'manager') => {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const usersCollection = await dbconnection('users');

    const currentUser = await usersCollection.findOne({
      email: session.user.email,
    });

    if (!currentUser) {
      return {
        success: false,
        error: "Current user not found",
      };
    }

    if (currentUser.accountType !== 'controller') {
      return {
        success: false,
        error: "Only controllers can update user accounts",
      };
    }

    const targetUser = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!targetUser) {
      return {
        success: false,
        error: "Target user not found",
      };
    }

    if (targetUser.messSecretCode !== currentUser.messSecretCode) {
      return {
        success: false,
        error: "You can only manage users in your own mess",
      };
    }

    const isOwnAccount = targetUser.email === session.user.email;

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { accountType } }
    );

    if (result.modifiedCount === 0) {
      return {
        success: false,
        error: "User not found",
      };
    }

    revalidateTag('users-list');
    revalidatePath('/admin/members', 'layout');

    const updatedUsers = await alluser();

    return {
      success: true,
      message: isOwnAccount 
        ? `Your account type updated to ${accountType}` 
        : `User account type updated to ${accountType}`,
      data: updatedUsers.data,
      isOwnAccount,
      changedUserEmail: targetUser.email,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user",
    };
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const usersCollection = await dbconnection('users');

    const currentUser = await usersCollection.findOne({
      email: session.user.email,
    });

    if (!currentUser) {
      return {
        success: false,
        error: "Current user not found",
      };
    }

    if (currentUser.accountType !== 'controller') {
      return {
        success: false,
        error: "Only controllers can delete users",
      };
    }

    const targetUser = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!targetUser) {
      return {
        success: false,
        error: "Target user not found",
      };
    }

    if (targetUser.messSecretCode !== currentUser.messSecretCode) {
      return {
        success: false,
        error: "You can only delete users in your own mess",
      };
    }

    const isOwnAccount = targetUser.email === session.user.email;

    const result = await usersCollection.deleteOne(
      { _id: new ObjectId(userId) }
    );

    if (result.deletedCount === 0) {
      return {
        success: false,
        error: "User not found",
      };
    }

    revalidateTag('users-list');
    revalidatePath('/admin/members', 'layout');

    const updatedUsers = await alluser();

    return {
      success: true,
      message: "User deleted successfully",
      data: updatedUsers.data,
      isOwnAccount,
      changedUserEmail: targetUser.email,
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete user",
    };
  }
};

export const invalidateUserSession = async (email: string) => {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    if (!email) {
      return {
        success: false,
        error: "Email is required",
      };
    }

    revalidateTag('users-list');
    revalidatePath('/admin/members', 'layout');

    return {
      success: true,
      message: `Session invalidated for ${email}`,
    };
  } catch (error) {
    console.error("Error invalidating session:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to invalidate session",
    };
  }
};