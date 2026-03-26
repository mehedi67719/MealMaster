import { motion } from 'framer-motion';

interface Props {
  monthName: string;
  daysInMonth: number;
  isBeforeTen: boolean;
}

export default function Header({ monthName, daysInMonth, isBeforeTen }: Props) {
  return (
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
      <p className="text-emerald-700 text-base sm:text-lg font-medium mb-2">
        {monthName} • {daysInMonth} Days • Plan Your Breakfast, Lunch & Dinner
      </p>
      {isBeforeTen && (
        <p className="text-green-600 font-semibold mb-4">⏰ Editing enabled (before 10 AM)</p>
      )}
      {!isBeforeTen && (
        <p className="text-red-600 font-semibold mb-4">🔒 Editing disabled (after 10 AM)</p>
      )}
    </motion.div>
  );
}