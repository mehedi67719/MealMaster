'use server';

import { dbconnection } from "@/Components/lib/dbconnection";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import { revalidateTag, revalidatePath } from "next/cache";
import { authOptions } from "@/Components/lib/authoptions";

interface User {
  _id: string;
  email: string;
  accountType: 'member' | 'controller' | 'manager';
  messName: string;
  messSecretCode: string;
  name?: string;
  [key: string]: any;
}

interface UpdateUserResponse {
  success: boolean;
  error?: string;
  message?: string;
  data?: User[];
  isOwnAccount?: boolean;
  changedUserEmail?: string;
}

interface DeleteUserResponse {
  success: boolean;
  error?: string;
  message?: string;
  data?: User[];
  isOwnAccount?: boolean;
  changedUserEmail?: string;
}

interface SessionInvalidationResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export const alluser = async (): Promise<User[] | null> => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return null;
    }

    const usercollection = await dbconnection("users");

    const currentuser = await usercollection.findOne({
      email: session.user.email
    });

    if (!currentuser) {
      return null;
    }

    if (currentuser.accountType === "controller") {
      const allusers = await usercollection.find({
        messName: currentuser.messName,
        messSecretCode: currentuser.messSecretCode
      }).toArray();

      return allusers.map(user => ({
        ...user,
        _id: user._id instanceof ObjectId ? user._id.toString() : String(user._id)
      }));
    } else {
      return null;
    }

  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateUserAccountType = async (
  userId: string,
  accountType: 'member' | 'controller' | 'manager'
): Promise<UpdateUserResponse> => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    if (!userId?.trim()) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    let objectId: ObjectId;
    try {
      objectId = new ObjectId(userId);
    } catch {
      return {
        success: false,
        error: "Invalid user ID format",
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
      _id: objectId,
    });

    if (!targetUser) {
      return {
        success: false,
        error: "Target user not found",
      };
    }

    if (targetUser.messSecretCode !== currentUser.messSecretCode || targetUser.messName !== currentUser.messName) {
      return {
        success: false,
        error: "You can only manage users in your own mess",
      };
    }

    if (currentUser._id.toString() === targetUser._id.toString() && accountType === 'member') {
      return {
        success: false,
        error: "You cannot demote yourself to member",
      };
    }

    const isOwnAccount = targetUser.email === session.user.email;

    const result = await usersCollection.updateOne(
      { _id: objectId },
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
      data: updatedUsers || undefined,
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

export const deleteUser = async (userId: string): Promise<DeleteUserResponse> => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    if (!userId?.trim()) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    let objectId: ObjectId;
    try {
      objectId = new ObjectId(userId);
    } catch {
      return {
        success: false,
        error: "Invalid user ID format",
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
      _id: objectId,
    });

    if (!targetUser) {
      return {
        success: false,
        error: "Target user not found",
      };
    }

    if (targetUser.messSecretCode !== currentUser.messSecretCode || targetUser.messName !== currentUser.messName) {
      return {
        success: false,
        error: "You can only delete users in your own mess",
      };
    }

    if (currentUser._id.toString() === targetUser._id.toString()) {
      return {
        success: false,
        error: "You cannot delete your own account",
      };
    }

    const isOwnAccount = targetUser.email === session.user.email;

    const result = await usersCollection.deleteOne(
      { _id: objectId }
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
      data: updatedUsers || undefined,
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

export const invalidateUserSession = async (email: string): Promise<SessionInvalidationResponse> => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    if (!email?.trim() || !email.includes('@')) {
      return {
        success: false,
        error: "Valid email is required",
      };
    }

    const usersCollection = await dbconnection('users');

    const currentUser = await usersCollection.findOne({
      email: session.user.email
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
        error: "Only controllers can invalidate sessions",
      };
    }

    const targetUser = await usersCollection.findOne({
      email: email
    });

    if (!targetUser) {
      return {
        success: false,
        error: "User not found",
      };
    }

    if (currentUser.messSecretCode !== targetUser.messSecretCode || currentUser.messName !== targetUser.messName) {
      return {
        success: false,
        error: "You can only invalidate sessions for users in your mess",
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