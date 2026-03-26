import { motion } from 'framer-motion';
import { MealState } from '@/types/meal';
import { canEditDate, getMealStatus, getAllMealsStatus, getPartialMealsStatus, getMealCount } from './helpers';
import MealToggle from './MealToggle';

interface Props {
  date: string;
  index: number;
  mealData: MealState;
  isLoading: boolean;
  today: string;
  getDayName: (date: string) => string;
  onMealToggle: (date: string, meal: 'breakfast' | 'lunch' | 'dinner') => void;
  onToggleAllMeals: (date: string) => void;
}

export default function DayCard({
  date,
  index,
  mealData,
  isLoading,
  today,
  getDayName,
  onMealToggle,
  onToggleAllMeals,
}: Props) {
  const dayNum = parseInt(date.split('-')[2]);
  const dayName = getDayName(date);
  const isThisToday = date === today;
  const allMealsOn = getAllMealsStatus(mealData, date);
  const partialMeals = getPartialMealsStatus(mealData, date);
  const mealCount = getMealCount(mealData, date);
  const canEdit = canEditDate(date);

  const borderClass = isThisToday
    ? 'border-emerald-500 ring-2 ring-emerald-400 ring-offset-2'
    : allMealsOn
    ? 'border-emerald-400'
    : partialMeals
    ? 'border-teal-300'
    : 'border-gray-200';

  const headerGradient = isThisToday
    ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
    : allMealsOn
    ? 'bg-gradient-to-r from-emerald-600 to-green-600'
    : partialMeals
    ? 'bg-gradient-to-r from-teal-600 to-emerald-600'
    : 'bg-gradient-to-r from-gray-600 to-gray-700';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.02 }}
      whileHover={{ y: -4 }}
      className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-300 border-2 ${borderClass} ${!canEdit ? 'opacity-60' : ''}`}
    >
      <div className={`px-5 py-4 text-white ${headerGradient}`}>
        <div className="text-center">
          <p className="text-sm font-semibold opacity-90">{dayName}</p>
          <p className="text-3xl font-black">{dayNum}</p>
          {isThisToday && (
            <span className="inline-block mt-2 text-xs font-bold bg-white/30 px-3 py-1 rounded-full backdrop-blur-sm">
              TODAY
            </span>
          )}
          {!canEdit && !isThisToday && (
            <span className="inline-block mt-2 text-xs font-bold bg-red-500/80 px-3 py-1 rounded-full backdrop-blur-sm">
              LOCKED
            </span>
          )}
          {allMealsOn && !isThisToday && canEdit && (
            <span className="inline-block mt-2 text-xs font-bold bg-white/30 px-3 py-1 rounded-full backdrop-blur-sm">
              COMPLETE
            </span>
          )}
          {mealCount > 0 && !allMealsOn && !isThisToday && canEdit && (
            <span className="inline-block mt-2 text-xs font-bold bg-white/30 px-3 py-1 rounded-full backdrop-blur-sm">
              {mealCount}/3 Meals
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3 bg-white">
        <button
          onClick={() => onToggleAllMeals(date)}
          disabled={isLoading || !canEdit}
          className={`w-full py-2.5 px-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            allMealsOn
              ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md'
              : partialMeals
              ? 'bg-teal-400 text-white hover:bg-teal-500 shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
          } ${isLoading || !canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="text-base">{allMealsOn ? '✓' : partialMeals ? '◐' : '○'}</span>
          {allMealsOn ? 'Turn All Off' : partialMeals ? 'Partial' : 'Turn All On'}
        </button>

        <div className="space-y-2">
          <MealToggle
            date={date}
            meal="breakfast"
            emoji="🌅"
            label="Breakfast"
            isActive={getMealStatus(mealData, date, 'breakfast')}
            isLoading={isLoading}
            canEdit={canEdit}
            bgGradient="from-amber-50 to-orange-50"
            borderColor="border-amber-200 hover:border-amber-300"
            onToggle={() => onMealToggle(date, 'breakfast')}
          />
          <MealToggle
            date={date}
            meal="lunch"
            emoji="🍽️"
            label="Lunch"
            isActive={getMealStatus(mealData, date, 'lunch')}
            isLoading={isLoading}
            canEdit={canEdit}
            bgGradient="from-green-50 to-emerald-50"
            borderColor="border-green-200 hover:border-green-300"
            onToggle={() => onMealToggle(date, 'lunch')}
          />
          <MealToggle
            date={date}
            meal="dinner"
            emoji="🌙"
            label="Dinner"
            isActive={getMealStatus(mealData, date, 'dinner')}
            isLoading={isLoading}
            canEdit={canEdit}
            bgGradient="from-indigo-50 to-blue-50"
            borderColor="border-indigo-200 hover:border-indigo-300"
            onToggle={() => onMealToggle(date, 'dinner')}
          />
        </div>
      </div>
    </motion.div>
  );
}