import React from 'react';

const WeeklyProgress = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const progress = [100, 80, 100, 40, 0, 0, 0]; 

  const CircularProgress = ({ value, label }) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;
    
    let colorClass = 'text-gray-200 dark:text-gray-700'; 
    if (value === 100) colorClass = 'text-green-500';
    else if (value > 0) colorClass = 'text-yellow-500';

    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-14 h-14 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 50 50">
            <circle
              cx="25"
              cy="25"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              className="text-gray-100 dark:text-gray-800"
            />
            <circle
              cx="25"
              cy="25"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`${colorClass} transition-all duration-1000 ease-out`}
            />
          </svg>
          {value === 100 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          )}
        </div>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
      </div>
    );
  };

  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm transition-colors duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[var(--color-foreground)]">This Week</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Weekly completion preview</p>
      </div>

      <div className="flex justify-between items-center mt-8 gap-1">
        {days.map((day, index) => (
          <CircularProgress key={day} label={day} value={progress[index]} />
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              4
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-foreground)]">Habits Left Today</p>
              <p className="text-xs text-gray-500">Out of 8 total</p>
            </div>
          </div>
          <button className="text-sm text-primary hover:text-primary-hover font-medium">
            View All
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyProgress;
