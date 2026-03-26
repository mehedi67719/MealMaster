interface Props {
  error: string;
  onRetry: () => void;
}

export default function ErrorScreen({ error, onRetry }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-emerald-600 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold"
        >
          Retry
        </button>
      </div>
    </div>
  );
}