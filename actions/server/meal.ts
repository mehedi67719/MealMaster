// src/actions/server/meals.ts

'use server';

import { dbconnection } from "@/Components/lib/dbconnection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/Components/lib/authoptions";

interface DayMeals {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

interface MealState {
  [date: string]: DayMeals;
}

interface MealDocument {
  userEmail: string;
  userName: string;
  month: string;
  year: number;
  monthName: string;
  meals: MealState;
  totalDays: number;
  totalMeals: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function saveMealData(payload: {
  month: string;
  year: number;
  monthName: string;
  meals: MealState;
  totalDays: number;
  totalMeals: number;
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return {
        success: false,
        error: "Unauthorized - Please login first",
      };
    }

    const { month, year, monthName, meals, totalDays, totalMeals } = payload;

    if (!month || !year || !meals) {
      return {
        success: false,
        error: "Missing required fields",
      };
    }

    const userEmail = session.user.email;
    const userName = session.user.name || userEmail.split('@')[0];

    const mealCollection = await dbconnection<MealDocument>("meals");

    const existingData = await mealCollection.findOne({
      userEmail: userEmail,
      month: month,
      year: parseInt(year.toString()),
    });

    const currentDate = new Date();

    if (existingData) {
      const result = await mealCollection.updateOne(
        {
          userEmail: userEmail,
          month: month,
          year: parseInt(year.toString()),
        },
        {
          $set: {
            meals: meals,
            totalDays: totalDays,
            totalMeals: totalMeals,
            updatedAt: currentDate,
          },
        }
      );

      return {
        success: true,
        message: "✅ Meal data updated successfully",
        action: "update",
      };
    } else {
      const result = await mealCollection.insertOne({
        userEmail: userEmail,
        userName: userName,
        month: month,
        year: parseInt(year.toString()),
        monthName: monthName,
        meals: meals,
        totalDays: totalDays,
        totalMeals: totalMeals,
        createdAt: currentDate,
        updatedAt: currentDate,
      });

      return {
        success: true,
        message: "✅ Meal data saved successfully",
        action: "insert",
      };
    }
  } catch (error) {
    console.error("Error in saveMealData:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to save meal data";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function loadMealData(month: string, year: number) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return {
        success: false,
        error: "Unauthorized - Please login first",
      };
    }

    if (!month || !year) {
      return {
        success: false,
        error: "Month and year are required",
      };
    }

    const userEmail = session.user.email;

    const mealCollection = await dbconnection<MealDocument>("meals");

    const mealData = await mealCollection.findOne({
      userEmail: userEmail,
      month: month,
      year: parseInt(year.toString()),
    });

    if (!mealData) {
      return {
        success: true,
        data: {
          meals: {},
        },
      };
    }

    return {
      success: true,
      data: mealData,
    };
  } catch (error) {
    console.error("Error in loadMealData:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch meal data";
    return {
      success: false,
      error: errorMessage,
    };
  }
}