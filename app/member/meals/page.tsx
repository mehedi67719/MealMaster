'use client';
import { motion, AnimatePresence } from 'framer-motion'; 

import { loadMealData, saveMealData } from '@/actions/server/meal';
import React, { useState, useEffect } from 'react';



interface DayMeals {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

interface MealState {
  [date: string]: DayMeals;
}

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

      const totalMealsCount = Object.values(updatedMeals).reduce((sum, day) => {
        return sum + (day.breakfast ? 1 : 0) + (day.lunch ? 1 : 0) + (day.dinner ? 1 : 0);
      }, 0);

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

  const handleMealToggle = async (date: string, meal: keyof DayMeals) => {
    const currentValue = mealData[date]?.[meal] ?? false;
    const newValue = !currentValue;

    const updatedMeals = {
      ...mealData,
      [date]: {
        ...(mealData[date] || { breakfast: false, lunch: false, dinner: false }),
        [meal]: newValue,
      },
    };

    setMealData(updatedMeals);
    await saveMealDataToServer(updatedMeals);
  };

  const handleToggleAllMeals = async (date: string) => {
    const currentDay = mealData[date] || { breakfast: false, lunch: false, dinner: false };
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
    const allDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      allDays.push(dateStr);
    }

    const allOn = allDays.every(date => mealData[date]?.[mealType] === true);
    const newStatus = !allOn;

    const updatedMeals = { ...mealData };
    allDays.forEach(date => {
      if (!updatedMeals[date]) {
        updatedMeals[date] = { breakfast: false, lunch: false, dinner: false };
      }
      updatedMeals[date][mealType] = newStatus;
    });

    setMealData(updatedMeals);
    await saveMealDataToServer(updatedMeals);
  };

  const handleMasterToggleAllMeals = async () => {
    const allDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      allDays.push(dateStr);
    }

    const allComplete = allDays.every(date => {
      const day = mealData[date];
      return day?.breakfast && day?.lunch && day?.dinner;
    });
    const newStatus = !allComplete;

    const updatedMeals = { ...mealData };
    allDays.forEach(date => {
      updatedMeals[date] = {
        breakfast: newStatus,
        lunch: newStatus,
        dinner: newStatus,
      };
    });

    setMealData(updatedMeals);
    await saveMealDataToServer(updatedMeals);
  };

  const getMealStatus = (date: string, meal: keyof DayMeals): boolean => {
    return mealData[date]?.[meal] ?? false;
  };

  const getAllMealsStatus = (date: string): boolean => {
    const day = mealData[date];
    return day?.breakfast && day?.lunch && day?.dinner;
  };

  const getPartialMealsStatus = (date: string): boolean => {
    const day = mealData[date];
    if (!day) return false;
    const count = (day.breakfast ? 1 : 0) + (day.lunch ? 1 : 0) + (day.dinner ? 1 : 0);
    return count > 0 && count < 3;
  };

  const getMealCount = (date: string): number => {
    const day = mealData[date];
    if (!day) return 0;
    return (day.breakfast ? 1 : 0) + (day.lunch ? 1 : 0) + (day.dinner ? 1 : 0);
  };

  const getMasterToggleStatus = (mealType: 'breakfast' | 'lunch' | 'dinner'): boolean => {
    const allDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      allDays.push(dateStr);
    }
    return allDays.every(date => mealData[date]?.[mealType] === true);
  };

  const getMasterAllMealsStatus = (): boolean => {
    const allDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      allDays.push(dateStr);
    }
    return allDays.every(date => {
      const day = mealData[date];
      return day?.breakfast && day?.lunch && day?.dinner;
    });
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const totalMealsCount = Object.values(mealData).reduce((sum, day) => {
    return sum + (day.breakfast ? 1 : 0) + (day.lunch ? 1 : 0) + (day.dinner ? 1 : 0);
  }, 0);
  const breakfastCount = Object.values(mealData).filter(day => day.breakfast).length;
  const lunchCount = Object.values(mealData).filter(day => day.lunch).length;
  const dinnerCount = Object.values(mealData).filter(day => day.dinner).length;

  const allBreakfastOn = getMasterToggleStatus('breakfast');
  const allLunchOn = getMasterToggleStatus('lunch');
  const allDinnerOn = getMasterToggleStatus('dinner');
  const allMealsComplete = getMasterAllMealsStatus();

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push(dateStr);
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-emerald-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => loadMealDataFromServer()}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="text-7xl sm:text-8xl animate-bounce">🍽️</div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
            Monthly Meal Planner
          </h1>
          <p className="text-emerald-700 text-base sm:text-lg font-medium mb-6">
            {monthName} • {daysInMonth} Days • Plan Your Breakfast, Lunch & Dinner
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl p-3 text-white shadow-lg">
              <p className="text-xs opacity-90">🌅 Breakfast</p>
              <p className="text-2xl font-bold">{breakfastCount}</p>
              <p className="text-[10px]">out of {daysInMonth} days</p>
            </div>
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl p-3 text-white shadow-lg">
              <p className="text-xs opacity-90">🍽️ Lunch</p>
              <p className="text-2xl font-bold">{lunchCount}</p>
              <p className="text-[10px]">out of {daysInMonth} days</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-3 text-white shadow-lg">
              <p className="text-xs opacity-90">🌙 Dinner</p>
              <p className="text-2xl font-bold">{dinnerCount}</p>
              <p className="text-[10px]">out of {daysInMonth} days</p>
            </div>
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-3 text-white shadow-lg">
              <p className="text-xs opacity-90">📊 Total</p>
              <p className="text-2xl font-bold">{totalMealsCount}</p>
              <p className="text-[10px]">scheduled this month</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="text-center mb-6">
            <h3 className="text-white text-2xl font-bold">Master Controls</h3>
            <p className="text-emerald-100 text-sm">Control all meals for the entire month at once</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <button
              onClick={() => handleMasterToggle('breakfast')}
              disabled={isLoading}
              className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                allBreakfastOn
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🍳</span>
                <span className="font-bold">All Breakfast</span>
              </div>
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                allBreakfastOn ? 'bg-white' : 'bg-gray-300'
              }`}>
                <span
                  className={`inline-block h-5 w-5 transform rounded-full transition-transform duration-300 ${
                    allBreakfastOn ? 'translate-x-5 bg-orange-500' : 'translate-x-0.5 bg-gray-600'
                  }`}
                />
              </div>
            </button>

            <button
              onClick={() => handleMasterToggle('lunch')}
              disabled={isLoading}
              className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                allLunchOn
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🥗</span>
                <span className="font-bold">All Lunch</span>
              </div>
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                allLunchOn ? 'bg-white' : 'bg-gray-300'
              }`}>
                <span
                  className={`inline-block h-5 w-5 transform rounded-full transition-transform duration-300 ${
                    allLunchOn ? 'translate-x-5 bg-cyan-500' : 'translate-x-0.5 bg-gray-600'
                  }`}
                />
              </div>
            </button>

            <button
              onClick={() => handleMasterToggle('dinner')}
              disabled={isLoading}
              className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                allDinnerOn
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌙</span>
                <span className="font-bold">All Dinner</span>
              </div>
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                allDinnerOn ? 'bg-white' : 'bg-gray-300'
              }`}>
                <span
                  className={`inline-block h-5 w-5 transform rounded-full transition-transform duration-300 ${
                    allDinnerOn ? 'translate-x-5 bg-purple-500' : 'translate-x-0.5 bg-gray-600'
                  }`}
                />
              </div>
            </button>

            <button
              onClick={handleMasterToggleAllMeals}
              disabled={isLoading}
              className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                allMealsComplete
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">⭐</span>
                <span className="font-bold">All Meals</span>
              </div>
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                allMealsComplete ? 'bg-white' : 'bg-gray-300'
              }`}>
                <span
                  className={`inline-block h-5 w-5 transform rounded-full transition-transform duration-300 ${
                    allMealsComplete ? 'translate-x-5 bg-emerald-500' : 'translate-x-0.5 bg-gray-600'
                  }`}
                />
              </div>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-emerald-200 p-6 sm:p-8 lg:p-10 mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {days.map((date, index) => {
              if (!date) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="h-[420px] bg-gradient-to-br from-gray-50 to-emerald-50 rounded-2xl opacity-40 border-2 border-dashed border-emerald-200"
                  />
                );
              }

              const dayNum = parseInt(date.split('-')[2]);
              const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
              const isToday = date === new Date().toISOString().split('T')[0];
              const allMealsOn = getAllMealsStatus(date);
              const partialMeals = getPartialMealsStatus(date);
              const mealCount = getMealCount(date);

              return (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ y: -4 }}
                  className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-300 border-2 ${
                    isToday
                      ? 'border-emerald-500 ring-2 ring-emerald-400 ring-offset-2'
                      : allMealsOn
                      ? 'border-emerald-400'
                      : partialMeals
                      ? 'border-teal-300'
                      : 'border-gray-200'
                  }`}
                >
                  <div
                    className={`px-5 py-4 text-white ${
                      isToday
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        : allMealsOn
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600'
                        : partialMeals
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600'
                        : 'bg-gradient-to-r from-gray-600 to-gray-700'
                    }`}
                  >
                    <div className="text-center">
                      <p className="text-sm font-semibold opacity-90">{dayName}</p>
                      <p className="text-3xl font-black">{dayNum}</p>
                      {isToday && (
                        <span className="inline-block mt-2 text-xs font-bold bg-white/30 px-3 py-1 rounded-full backdrop-blur-sm">
                          TODAY
                        </span>
                      )}
                      {allMealsOn && !isToday && (
                        <span className="inline-block mt-2 text-xs font-bold bg-white/30 px-3 py-1 rounded-full backdrop-blur-sm">
                          COMPLETE
                        </span>
                      )}
                      {mealCount > 0 && !allMealsOn && !isToday && (
                        <span className="inline-block mt-2 text-xs font-bold bg-white/30 px-3 py-1 rounded-full backdrop-blur-sm">
                          {mealCount}/3 Meals
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-3 bg-white">
                    <button
                      onClick={() => handleToggleAllMeals(date)}
                      disabled={isLoading}
                      className={`w-full py-2.5 px-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                        allMealsOn
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md'
                          : partialMeals
                          ? 'bg-teal-400 text-white hover:bg-teal-500 shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="text-base">
                        {allMealsOn ? '✓' : partialMeals ? '◐' : '○'}
                      </span>
                      {allMealsOn ? 'Turn All Off' : partialMeals ? 'Partial' : 'Turn All On'}
                    </button>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 hover:border-amber-300 transition-all group">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl group-hover:scale-110 transition-transform">🌅</span>
                          <div>
                            <p className="font-bold text-gray-800 text-sm">Breakfast</p>
                            <p className="text-xs text-gray-600">
                              {getMealStatus(date, 'breakfast') ? '✓ On' : '○ Off'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleMealToggle(date, 'breakfast')}
                          disabled={isLoading}
                          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
                            getMealStatus(date, 'breakfast') ? 'bg-emerald-500' : 'bg-gray-300'
                          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                              getMealStatus(date, 'breakfast') ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:border-green-300 transition-all group">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl group-hover:scale-110 transition-transform">🍽️</span>
                          <div>
                            <p className="font-bold text-gray-800 text-sm">Lunch</p>
                            <p className="text-xs text-gray-600">
                              {getMealStatus(date, 'lunch') ? '✓ On' : '○ Off'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleMealToggle(date, 'lunch')}
                          disabled={isLoading}
                          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
                            getMealStatus(date, 'lunch') ? 'bg-emerald-500' : 'bg-gray-300'
                          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                              getMealStatus(date, 'lunch') ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 hover:border-indigo-300 transition-all group">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl group-hover:scale-110 transition-transform">🌙</span>
                          <div>
                            <p className="font-bold text-gray-800 text-sm">Dinner</p>
                            <p className="text-xs text-gray-600">
                              {getMealStatus(date, 'dinner') ? '✓ On' : '○ Off'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleMealToggle(date, 'dinner')}
                          disabled={isLoading}
                          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
                            getMealStatus(date, 'dinner') ? 'bg-emerald-500' : 'bg-gray-300'
                          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                              getMealStatus(date, 'dinner') ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-8 right-8 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 font-semibold"
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MealPage;