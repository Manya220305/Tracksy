import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../context/HabitContext';

const WeeklyProgress = () => {
  const navigate = useNavigate();
  const { stats, loading } = useHabits();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const weekdayStats = {
    Mon: { completed: 0, total: 0 },
    Tue: { completed: 0, total: 0 },
    Wed: { completed: 0, total: 0 },
    Thu: { completed: 0, total: 0 },
    Fri: { completed: 0, total: 0 },
    Sat: { completed: 0, total: 0 },
    Sun: { completed: 0, total: 0 }
  };

  if (stats && stats.dailyCompletionRates) {
    Object.entries(stats.dailyCompletionRates).forEach(([dateStr, rate]) => {
      const date = new Date(dateStr);
      const day = date.toLocaleString("en-US", { weekday: "short" });
      const totalHabits = stats.totalHabits || 0;
      
      if (weekdayStats[day]) {
        weekdayStats[day].total += totalHabits;
        weekdayStats[day].completed += (rate / 100) * totalHabits;
      }
    });
  }

  const progress = days.map(day => {
    const { completed, total } = weekdayStats[day];
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  });

  const CircularProgress = ({ value, label, statInfo }) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    
    let colorClass = 'text-gray-200 dark:text-gray-700'; 
    if (value === 100) colorClass = 'text-green-500';
    else if (value > 0) colorClass = 'text-yellow-500';

    const completedCount = Math.round(statInfo.completed);
    const totalCount = statInfo.total;

    return (
      <div className="flex flex-col items-center justify-center gap-2 group relative" title={`${completedCount}/${totalCount} ${label}s completed`}>
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
              pathLength="100"
              strokeDasharray={`${value} 100`}
              strokeDashoffset="0"
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
        
        {/* Simple count text on hover */}
        <div className="absolute -top-8 bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm pointer-events-none">
          {completedCount} / {totalCount} completed
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="h-64 bg-[var(--color-surface)] rounded-2xl animate-pulse border border-[var(--color-border)]"></div>;
  }

  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm transition-colors duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[var(--color-foreground)]">Monthly Consistency</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Aggregated performance by weekday</p>
      </div>

      <div className="grid grid-cols-7 gap-4 w-full mt-8">
        {days.map((day, index) => (
          <CircularProgress 
            key={day} 
            label={day} 
            value={progress[index]} 
            statInfo={weekdayStats[day]}
          />
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {stats?.totalHabits || 0}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-foreground)]">Active Habits</p>
              <p className="text-xs text-gray-500">Your current goals</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/analytics')}
            className="text-sm text-primary hover:text-primary-hover font-medium"
          >
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyProgress;
