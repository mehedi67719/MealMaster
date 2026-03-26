'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { loadMealData, saveMealData } from '@/actions/server/meal';
import React, { useState, useEffect } from 'react';
import { MealState } from '@/types/meal';


import Header from '@/Components/meal/Header';
import ErrorScreen from '@/Components/meal/ErrorScreen';
import Stats from '@/Components/meal/Stats';
import MasterControls from '@/Components/meal/MasterControls';
import CalendarGrid from '@/Components/meal/CalendarGrid';
import SuccessNotification from '@/Components/meal/SuccessNotification';
import {
  getToday,
  canEditDate,
  getTotalMealsCount,
  getBreakfastCount,
  getLunchCount,
  getDinnerCount,
  generateAllDates,
  getMasterToggleStatus,
  getMasterAllMealsStatus,
  createEmptyDayMeals,
} from '@/Components/meal/helpers';

const MealPage = () => {
  const [currentDate] = useState<Date>(new Date());
  const [mealData, setMealData] = useState<MealState>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const monthString = `${year}-${String(month).padStart(2, '0')}`;
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();

  useEffect(() => {
    loadMealDataFromServer();
  }, []);

  const loadMealDataFromServer = async () => {
    try {
      setIsLoading(true);
      setError('');

      const result = await loadMealData(monthString, year);

      if (result.success && result.data) {
        setMealData(result.data.meals || {});
      } else {
        setError(result.error || 'Failed to load data');
        setMealData({});
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load meal data');
    } finally {
      setIsLoading(false);
    }
  };

  const saveMealDataToServer = async (updatedMeals: MealState) => {
    try {
      setIsLoading(true);
      setError('');

      const totalMealsCount = getTotalMealsCount(updatedMeals);

      const payload = {
        month: monthString,
        year: year,
        monthName: currentDate.toLocaleDateString('en-US', { month: 'long' }),
        meals: updatedMeals,
        totalDays: daysInMonth,
        totalMeals: totalMealsCount,
      };

      const result = await saveMealData(payload);

      if (result.success) {
        setSuccessMessage(result.message || '✅ Data saved successfully');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        throw new Error(result.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setError(error instanceof Error ? error.message : 'Failed to save meal data');
      setSuccessMessage('Failed to save!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMealToggle = async (date: string, meal: 'breakfast' | 'lunch' | 'dinner') => {
    if (!canEditDate(date)) {
      setSuccessMessage('❌ Cannot edit after 10 AM or past dates');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      return;
    }

    const currentValue = mealData[date]?.[meal] ?? false;
    const newValue = !currentValue;

    const updatedMeals = {
      ...mealData,
      [date]: {
        ...(mealData[date] || createEmptyDayMeals()),
        [meal]: newValue,
      },
    };

    setMealData(updatedMeals);
    await saveMealDataToServer(updatedMeals);
  };

  const handleToggleAllMeals = async (date: string) => {
    if (!canEditDate(date)) {
      setSuccessMessage('❌ Cannot edit after 10 AM or past dates');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      return;
    }

    const currentDay = mealData[date] || createEmptyDayMeals();
    const allOn = currentDay.breakfast && currentDay.lunch && currentDay.dinner;
    const newStatus = !allOn;

    const updatedMeals = {
      ...mealData,
      [date]: {
        breakfast: newStatus,
        lunch: newStatus,
        dinner: newStatus,
      },
    };

    setMealData(updatedMeals);
    await saveMealDataToServer(updatedMeals);
  };

  const handleMasterToggle = async (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const allDays = generateAllDates(daysInMonth, year, month);

    const allOn = allDays.every(date => mealData[date]?.[mealType] === true);
    const newStatus = !allOn;

    const updatedMeals = { ...mealData };
    allDays.forEach(date => {
      if (canEditDate(date)) {
        if (!updatedMeals[date]) {
          updatedMeals[date] = createEmptyDayMeals();
        }
        updatedMeals[date][mealType] = newStatus;
      }
    });

    setMealData(updatedMeals);
    await saveMealDataToServer(updatedMeals);
  };

  const handleMasterToggleAllMeals = async () => {
    const allDays = generateAllDates(daysInMonth, year, month);

    const allComplete = allDays.every(date => {
      const day = mealData[date];
      return day?.breakfast && day?.lunch && day?.dinner;
    });
    const newStatus = !allComplete;

    const updatedMeals = { ...mealData };
    allDays.forEach(date => {
      if (canEditDate(date)) {
        updatedMeals[date] = {
          breakfast: newStatus,
          lunch: newStatus,
          dinner: newStatus,
        };
      }
    });

    setMealData(updatedMeals);
    await saveMealDataToServer(updatedMeals);
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const totalMealsCount = getTotalMealsCount(mealData);
  const breakfastCount = getBreakfastCount(mealData);
  const lunchCount = getLunchCount(mealData);
  const dinnerCount = getDinnerCount(mealData);

  const allBreakfastOn = getMasterToggleStatus(mealData, daysInMonth, year, month, 'breakfast');
  const allLunchOn = getMasterToggleStatus(mealData, daysInMonth, year, month, 'lunch');
  const allDinnerOn = getMasterToggleStatus(mealData, daysInMonth, year, month, 'dinner');
  const allMealsComplete = getMasterAllMealsStatus(mealData, daysInMonth, year, month);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push(dateStr);
  }

  if (error) {
    return <ErrorScreen error={error} onRetry={loadMealDataFromServer} />;
  }

  const today = getToday();
  const now = new Date();
  const isBeforeTen = now.getHours() < 10;

  const getDayName = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Header monthName={monthName} daysInMonth={daysInMonth} isBeforeTen={isBeforeTen} />

        <Stats
          breakfastCount={breakfastCount}
          lunchCount={lunchCount}
          dinnerCount={dinnerCount}
          totalMealsCount={totalMealsCount}
          daysInMonth={daysInMonth}
        />

        <MasterControls
          isLoading={isLoading}
          isBeforeTen={isBeforeTen}
          allBreakfastOn={allBreakfastOn}
          allLunchOn={allLunchOn}
          allDinnerOn={allDinnerOn}
          allMealsComplete={allMealsComplete}
          onBreakfastToggle={() => handleMasterToggle('breakfast')}
          onLunchToggle={() => handleMasterToggle('lunch')}
          onDinnerToggle={() => handleMasterToggle('dinner')}
          onAllMealsToggle={handleMasterToggleAllMeals}
        />

        <CalendarGrid
          days={days}
          mealData={mealData}
          isLoading={isLoading}
          today={today}
          getDayName={getDayName}
          onMealToggle={handleMealToggle}
          onToggleAllMeals={handleToggleAllMeals}
        />

        <AnimatePresence>
          {showSuccess && <SuccessNotification message={successMessage} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MealPage;