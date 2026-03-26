import { DayMeals, MealState } from '@/types/meal';

export const getToday = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const canEditDate = (dateString: string): boolean => {
  const today = getToday();
  const now = new Date();

  if (dateString > today) {
    return true;
  }

  if (dateString === today) {
    return now.getHours() < 10;
  }

  return false;
};

export const getMealStatus = (mealData: MealState, date: string, meal: keyof DayMeals): boolean => {
  return mealData[date]?.[meal] ?? false;
};

export const getAllMealsStatus = (mealData: MealState, date: string): boolean => {
  const day = mealData[date];
  return day?.breakfast && day?.lunch && day?.dinner;
};

export const getPartialMealsStatus = (mealData: MealState, date: string): boolean => {
  const day = mealData[date];
  if (!day) return false;
  const count = (day.breakfast ? 1 : 0) + (day.lunch ? 1 : 0) + (day.dinner ? 1 : 0);
  return count > 0 && count < 3;
};

export const getMealCount = (mealData: MealState, date: string): number => {
  const day = mealData[date];
  if (!day) return 0;
  return (day.breakfast ? 1 : 0) + (day.lunch ? 1 : 0) + (day.dinner ? 1 : 0);
};

export const getTotalMealsCount = (mealData: MealState): number => {
  return Object.values(mealData).reduce((sum, day) => {
    return sum + (day.breakfast ? 1 : 0) + (day.lunch ? 1 : 0) + (day.dinner ? 1 : 0);
  }, 0);
};

export const getBreakfastCount = (mealData: MealState): number => {
  return Object.values(mealData).filter(day => day.breakfast).length;
};

export const getLunchCount = (mealData: MealState): number => {
  return Object.values(mealData).filter(day => day.lunch).length;
};

export const getDinnerCount = (mealData: MealState): number => {
  return Object.values(mealData).filter(day => day.dinner).length;
};

export const generateAllDates = (daysInMonth: number, year: number, month: number): string[] => {
  const allDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    allDays.push(dateStr);
  }
  return allDays;
};

export const getMasterToggleStatus = (
  mealData: MealState,
  daysInMonth: number,
  year: number,
  month: number,
  mealType: keyof DayMeals
): boolean => {
  const allDays = generateAllDates(daysInMonth, year, month);
  return allDays.every(date => mealData[date]?.[mealType] === true);
};

export const getMasterAllMealsStatus = (
  mealData: MealState,
  daysInMonth: number,
  year: number,
  month: number
): boolean => {
  const allDays = generateAllDates(daysInMonth, year, month);
  return allDays.every(date => {
    const day = mealData[date];
    return day?.breakfast && day?.lunch && day?.dinner;
  });
};

export const createEmptyDayMeals = (): DayMeals => ({
  breakfast: false,
  lunch: false,
  dinner: false,
});