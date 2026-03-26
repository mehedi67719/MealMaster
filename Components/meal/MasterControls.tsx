import { motion } from 'framer-motion';

interface Props {
  isLoading: boolean;
  isBeforeTen: boolean;
  allBreakfastOn: boolean;
  allLunchOn: boolean;
  allDinnerOn: boolean;
  allMealsComplete: boolean;
  onBreakfastToggle: () => void;
  onLunchToggle: () => void;
  onDinnerToggle: () => void;
  onAllMealsToggle: () => void;
}

export default function MasterControls({
  isLoading,
  isBeforeTen,
  allBreakfastOn,
  allLunchOn,
  allDinnerOn,
  allMealsComplete,
  onBreakfastToggle,
  onLunchToggle,
  onDinnerToggle,
  onAllMealsToggle,
}: Props) {
  return (
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
        <ControlButton isLoading={isLoading} isBeforeTen={isBeforeTen} isActive={allBreakfastOn} emoji="🍳" label="All Breakfast" color="orange" onClick={onBreakfastToggle} />
        <ControlButton isLoading={isLoading} isBeforeTen={isBeforeTen} isActive={allLunchOn} emoji="🥗" label="All Lunch" color="cyan" onClick={onLunchToggle} />
        <ControlButton isLoading={isLoading} isBeforeTen={isBeforeTen} isActive={allDinnerOn} emoji="🌙" label="All Dinner" color="purple" onClick={onDinnerToggle} />
        <ControlButton isLoading={isLoading} isBeforeTen={isBeforeTen} isActive={allMealsComplete} emoji="⭐" label="All Meals" color="emerald" onClick={onAllMealsToggle} />
      </div>
    </motion.div>
  );
}

function ControlButton({ isLoading, isBeforeTen, isActive, emoji, label, color, onClick }: any) {
  const colorMap: any = {
    orange: { bg: 'bg-orange-500', toggle: 'bg-orange-500' },
    cyan: { bg: 'bg-cyan-500', toggle: 'bg-cyan-500' },
    purple: { bg: 'bg-purple-500', toggle: 'bg-purple-500' },
    emerald: { bg: 'bg-emerald-500', toggle: 'bg-emerald-500' },
  };

  const disabled = isLoading || !isBeforeTen;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
        isActive ? `${colorMap[color].bg} text-white shadow-lg` : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{emoji}</span>
        <span className="font-bold">{label}</span>
      </div>
      <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${isActive ? 'bg-white' : 'bg-gray-300'}`}>
        <span className={`inline-block h-5 w-5 transform rounded-full transition-transform duration-300 ${isActive ? `translate-x-5 ${colorMap[color].toggle}` : 'translate-x-0.5 bg-gray-600'}`} />
      </div>
    </button>
  );
}