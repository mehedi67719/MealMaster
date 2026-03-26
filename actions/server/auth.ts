'use server';

import { dbconnection } from '@/Components/lib/dbconnection';
import bcrypt from 'bcrypt';

type UserType = {
  _id?: any;
  name: string;
  email: string;
  password: string;
  accountType: string;
  messName?: string;
  messSecretCode?: string;
  agreeToTerms?: boolean;
  createdAt?: Date;
};

export const postuser = async (payload: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType: string;
  messName?: string;
  messSecretCode?: string;
  selectedMess?: string;
  memberSecretCode?: string;
  agreeToTerms: boolean;
}) => {
  try {
    const {
      email,
      password,
      confirmPassword,
      name,
      accountType,
      agreeToTerms,
    } = payload;

    if (!agreeToTerms) {
      return {
        success: false,
        message: 'You must agree to the terms and conditions',
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        message: 'Passwords do not match',
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: 'Password must be at least 6 characters',
      };
    }

    const usercollection = await dbconnection<UserType>('users');

    const isExist = await usercollection.findOne({ email });
    if (isExist) {
      return {
        success: false,
        message: 'User already exists with this email',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newuser: UserType = {
      name,
      email,
      password: hashedPassword,
      accountType,
      agreeToTerms: true,
      createdAt: new Date(),
    };

    if (accountType === 'controller') {
      const { messName, messSecretCode } = payload;

      if (!messName || !messSecretCode) {
        return {
          success: false,
          message: 'Mess name and secret code are required for controller account',
        };
      }

      const existingMess = await usercollection.findOne({
        accountType: 'controller',
        messName: messName.trim(),
        messSecretCode: messSecretCode.trim(),
      });

      if (existingMess) {
        return {
          success: false,
          message: 'A mess with this name and secret code already exists',
        };
      }

      newuser.messName = messName.trim();
      newuser.messSecretCode = messSecretCode.trim();
    } else if (accountType === 'member') {
      const { messName, messSecretCode } = payload;

      if (!messName || !messSecretCode) {
        return {
          success: false,
          message: 'Please select a mess and enter the secret code',
        };
      }

      const messExists = await usercollection.findOne({
        accountType: 'controller',
        messName: messName.trim(),
        messSecretCode: messSecretCode.trim(),
      });

      if (!messExists) {
        return {
          success: false,
          message: 'Invalid mess name or secret code. Please verify and try again.',
        };
      }

      newuser.messName = messName.trim();
      newuser.messSecretCode = messSecretCode.trim();
    }

    const result = await usercollection.insertOne(newuser);

    if (result.acknowledged) {
      return {
        success: true,
        message: 'User registered successfully',
        insertedId: result.insertedId.toString(),
      };
    }

    return { success: false, message: 'Registration failed' };
  } catch (error: any) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: error.message || 'Failed to register user',
    };
  }
};

export const loginuser = async (payload: { email: string; password: string }) => {
  try {
    const { email, password } = payload;

    if (!email || !password) {
      return { success: false, message: 'Email and password are required' };
    }

    const usercollection = await dbconnection<UserType>('users');

    const user = await usercollection.findOne({ email });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return { success: false, message: 'Incorrect password' };
    }

    const userData: any = {
      id: user._id?.toString(),
      name: user.name,
      email: user.email,
      accountType: user.accountType,
      messName: user.messName,
      messSecretCode: user.messSecretCode,
    };

    return {
      success: true,
      user: userData,
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Login failed' };
  }
};