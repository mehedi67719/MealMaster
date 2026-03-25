// src/actions/server/auth.ts

"use server";

import { dbconnection } from "@/Components/lib/dbconnection";
import bcrypt from "bcrypt";

type UserType = {
  _id?: any;
  name: string;
  email: string;
  password: string;
  accountType: string;
  messName: string;
  selectedMess: string;
};

export const postuser = async (payload: {
  name: string;
  email: string;
  password: string;
  accountType: string;
  messName: string;
  selectedMess: string;
}) => {
  const { email, password, name, messName, accountType, selectedMess } = payload;

  const usercollection = await dbconnection<UserType>("users");

  const isExist = await usercollection.findOne({ email });
  if (isExist) return { success: false, message: "User already exists" };

  const hashedPassword = await bcrypt.hash(password, 10);

  const newuser = {
    name,
    email,
    password: hashedPassword,
    accountType,
    messName,
    selectedMess,
  };

  const result = await usercollection.insertOne(newuser);

  if (result.acknowledged) {
    return {
      success: true,
      insertedId: result.insertedId.toString(),
    };
  }

  return { success: false, message: "Insert failed" };
};

export const loginuser = async (payload: {
  email: string;
  password: string;
}) => {
  try {
    const { email, password } = payload;

    if (!email || !password) {
      return { success: false, message: "Email and password are required" };
    }

    const usercollection = await dbconnection<UserType>("users");

    const user = await usercollection.findOne({ email });
    
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      return { success: false, message: "Incorrect password" };
    }

    return {
      success: true,
      user: {
        id: user._id?.toString(),
        name: user.name,
        email: user.email,
        accountType: user.accountType,
        messName: user.messName,
        selectedMess: user.selectedMess,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Login failed" };
  }
};