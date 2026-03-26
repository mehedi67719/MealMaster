import { motion } from 'framer-motion';
import { MealState } from '@/types/meal';
import DayCard from './DayCard';

interface Props {
  days: (string | null)[];
  mealData: MealState;
  isLoading: boolean;
  today: string;
  getDayName: (date: string) => string;
  onMealToggle: (date: string, meal: 'breakfast' | 'lunch' | 'dinner') => void;
  onToggleAllMeals: (date: string) => void;
}

export default function CalendarGrid({
  days,
  mealData,
  isLoading,
  today,
  getDayName,
  onMealToggle,
  onToggleAllMeals,
}: Props) {
  return (
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

          return (
            <DayCard
              key={date}
              date={date}
              index={index}
              mealData={mealData}
              isLoading={isLoading}
              today={today}
              getDayName={getDayName}
              onMealToggle={onMealToggle}
              onToggleAllMeals={onToggleAllMeals}
            />
          );
        })}
      </div>
    </motion.div>
  );
}