interface Props {
  date: string;
  meal: string;
  emoji: string;
  label: string;
  isActive: boolean;
  isLoading: boolean;
  canEdit: boolean;
  bgGradient: string;
  borderColor: string;
  onToggle: () => void;
}

export default function MealToggle({
  emoji,
  label,
  isActive,
  isLoading,
  canEdit,
  bgGradient,
  borderColor,
  onToggle,
}: Props) {
  const disabled = isLoading || !canEdit;

  return (
    <div className={`flex items-center justify-between p-3 bg-gradient-to-r ${bgGradient} rounded-xl ${borderColor} transition-all group`}>
      <div className="flex items-center gap-2">
        <span className="text-2xl group-hover:scale-110 transition-transform">{emoji}</span>
        <div>
          <p className="font-bold text-gray-800 text-sm">{label}</p>
          <p className="text-xs text-gray-600">{isActive ? '✓ On' : '○ Off'}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
          isActive ? 'bg-emerald-500' : 'bg-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
            isActive ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}