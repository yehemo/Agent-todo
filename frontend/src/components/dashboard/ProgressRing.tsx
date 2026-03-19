interface ProgressRingProps {
  percentage: number
}

export function ProgressRing({ percentage }: ProgressRingProps) {
  const radius = 56
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="relative inline-flex">
          <svg className="w-36 h-36 -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r={radius} strokeWidth="12" stroke="#f3f4f6" fill="none" />
            <circle
              cx="64" cy="64" r={radius} strokeWidth="12"
              stroke="#6366f1" fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div>
              <p className="text-3xl font-bold text-gray-900">{Math.round(percentage)}%</p>
            </div>
          </div>
        </div>
        <p className="mt-2 text-sm font-medium text-gray-500">Completion Rate</p>
      </div>
    </div>
  )
}
