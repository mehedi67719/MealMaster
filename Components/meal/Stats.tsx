interface Props {
  breakfastCount: number;
  lunchCount: number;
  dinnerCount: number;
  totalMealsCount: number;
  daysInMonth: number;
}

export default function Stats({
  breakfastCount,
  lunchCount,
  dinnerCount,
  totalMealsCount,
  daysInMonth,
}: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mb-8">
      <StatCard emoji="🌅" label="Breakfast" count={breakfastCount} total={daysInMonth} gradient="from-orange-500 to-yellow-500" />
      <StatCard emoji="🍽️" label="Lunch" count={lunchCount} total={daysInMonth} gradient="from-cyan-500 to-blue-500" />
      <StatCard emoji="🌙" label="Dinner" count={dinnerCount} total={daysInMonth} gradient="from-purple-500 to-pink-500" />
      <StatCard emoji="📊" label="Total" count={totalMealsCount} total={daysInMonth} gradient="from-emerald-500 to-teal-500" />
    </div>
  );
}

function StatCard({ emoji, label, count, total, gradient }: any) {
  return (
    <div className={`bg-gradient-to-r ${gradient} rounded-xl p-3 text-white shadow-lg`}>
      <p className="text-xs opacity-90">{emoji} {label}</p>
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-[10px]">out of {total} days</p>
    </div>
  );
}