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
  _id?: any;
  userEmail: string;
  userName: string;
  messName: string;
  messSecretCode: string;
  month: string;
  year: number;
  monthName: string;
  meals: MealState;
  totalDays: number;
  totalMeals: number;
  mealsUpToToday: number;
  createdAt: Date;
  updatedAt: Date;
}

const serializeMealData = (data: any): any => {
  if (!data) return null;

  return {
    _id: data._id?.toString() || '',
    userEmail: data.userEmail || '',
    userName: data.userName || '',
    messName: data.messName || '',
    messSecretCode: data.messSecretCode || '',
    month: data.month || '',
    year: data.year || 0,
    monthName: data.monthName || '',
    meals: data.meals || {},
    totalDays: data.totalDays || 0,
    totalMeals: data.totalMeals || 0,
    mealsUpToToday: data.mealsUpToToday || 0,
    createdAt: data.createdAt instanceof Date ? data.createdAt.toISOString() : data.createdAt || '',
    updatedAt: data.updatedAt instanceof Date ? data.updatedAt.toISOString() : data.updatedAt || '',
  };
};

const calculateMealsUpToToday = (meals: MealState): number => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  let totalMeals = 0;

  for (let day = 1; day <= currentDay; day++) {
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayMeal = meals[dateStr];
    
    if (dayMeal) {
      if (dayMeal.breakfast) totalMeals++;
      if (dayMeal.lunch) totalMeals++;
      if (dayMeal.dinner) totalMeals++;
    }
  }

  return totalMeals;
};

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

    if (!month || year === undefined || !meals) {
      return {
        success: false,
        error: "Missing required fields",
      };
    }

    const userEmail = session.user.email;
    const userName = session.user.name || userEmail.split('@')[0];
    const messName = (session.user as any)?.messName;
    const messSecretCode = (session.user as any)?.messSecretCode;

    const mealsUpToToday = calculateMealsUpToToday(meals);

    const mealCollection = await dbconnection<MealDocument>("meals");

    const existingData = await mealCollection.findOne({
      userEmail: userEmail,
      month: month,
      year: parseInt(year.toString()),
    });

    const currentDate = new Date();

    try {
      if (existingData) {
        await mealCollection.updateOne(
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
              mealsUpToToday: mealsUpToToday,
              messName: messName,
              messSecretCode: messSecretCode,
              updatedAt: currentDate,
            },
          }
        );

        return {
          success: true,
          message: "✅ Meal data updated successfully",
          action: "update",
          mealsUpToToday: mealsUpToToday,
        };
      } else {
        await mealCollection.insertOne({
          userEmail: userEmail,
          userName: userName,
          messName: messName,
          messSecretCode: messSecretCode,
          month: month,
          year: parseInt(year.toString()),
          monthName: monthName,
          meals: meals,
          totalDays: totalDays,
          totalMeals: totalMeals,
          mealsUpToToday: mealsUpToToday,
          createdAt: currentDate,
          updatedAt: currentDate,
        } as MealDocument);

        return {
          success: true,
          message: "✅ Meal data saved successfully",
          action: "insert",
          mealsUpToToday: mealsUpToToday,
        };
      }
    } catch (dbError) {
      console.error("Database operation error:", dbError);
      throw dbError;
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
        data: null,
      };
    }

    if (!month || year === undefined) {
      return {
        success: false,
        error: "Month and year are required",
        data: null,
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
          mealsUpToToday: 0,
          totalMeals: 0,
        },
      };
    }

    const mealsUpToToday = calculateMealsUpToToday(mealData.meals);

    await mealCollection.updateOne(
      {
        userEmail: userEmail,
        month: month,
        year: parseInt(year.toString()),
      },
      {
        $set: {
          mealsUpToToday: mealsUpToToday,
        },
      }
    );

    const serializedData = serializeMealData(mealData);

    return {
      success: true,
      data: {
        ...serializedData,
        mealsUpToToday: mealsUpToToday,
      },
    };
  } catch (error) {
    console.error("Error in loadMealData:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch meal data";
    return {
      success: false,
      error: errorMessage,
      data: null,
    };
  }
}