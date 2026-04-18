import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../context/HabitContext';
import { ArrowRight } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CircularProgress = ({ value, label, statInfo }) => {
  const completed = Math.round(statInfo.completed);
  const total = statInfo.total;

  let strokeColor = 'var(--border)';
  if (value === 100) strokeColor = '#22c55e';
  else if (value > 60) strokeColor = '#6366f1';
  else if (value > 0)  strokeColor = '#f59e0b';

  return (
    <div
      className="flex flex-col items-center gap-1.5 group relative cursor-default"
      title={`${completed}/${total} ${label}s completed`}
    >
      <div className="relative w-10 h-10">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
          {/* Track */}
          <circle cx="20" cy="20" r="16" fill="none" stroke="var(--border)" strokeWidth="3" />
          {/* Progress */}
          <circle
            cx="20" cy="20" r="16"
            fill="none"
            stroke={strokeColor}
            strokeWidth="3"
            pathLength="100"
            strokeDasharray={`${value} 100`}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {value === 100 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          </div>
        )}
      </div>

      <span className="text-[10px] font-medium text-[var(--color-text-secondary)]">{label}</span>

      {/* Hover tooltip */}
      <div className="
        absolute -top-8 pointer-events-none
        bg-[var(--color-foreground)] text-[var(--color-background)]
        px-2 py-0.5 rounded text-[9px] whitespace-nowrap
        opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 shadow-lg
      ">
        {completed}/{total}
      </div>
    </div>
  );
};

const WeeklyProgress = () => {
  const navigate = useNavigate();
  const { stats, loading } = useHabits();

  const weekdayStats = Object.fromEntries(DAYS.map(d => [d, { completed: 0, total: 0 }]));

  if (stats?.dailyCompletionRates) {
    Object.entries(stats.dailyCompletionRates).forEach(([dateStr, rate]) => {
      const day = new Date(dateStr).toLocaleString('en-US', { weekday: 'short' });
      const total = stats.totalHabits || 0;
      if (weekdayStats[day]) {
        weekdayStats[day].total += total;
        weekdayStats[day].completed += (rate / 100) * total;
      }
    });
  }

  const progress = DAYS.map(day => {
    const { completed, total } = weekdayStats[day];
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  });

  if (loading) {
    return (
      <div className="h-full bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] animate-pulse" />
    );
  }

  return (
    <div className="
      bg-[var(--color-surface)] p-4 md:p-5 rounded-2xl h-full flex flex-col
      border border-[var(--color-border)]
      shadow-sm hover:shadow-md
      transition-all duration-300
    ">
      {/* Header */}
      <div className="mb-3 md:mb-4">
        <h3 className="text-sm md:text-base font-bold text-[var(--color-foreground)]">Monthly Consistency</h3>
        <p className="text-[10px] md:text-xs text-[var(--color-text-secondary)] mt-0.5">Performance by weekday</p>
      </div>

      {/* Circle grid */}
      <div className="grid grid-cols-7 gap-1 w-full">
        {DAYS.map((day, i) => (
          <CircularProgress
            key={day}
            label={day}
            value={progress[i]}
            statInfo={weekdayStats[day]}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-3 text-[10px] text-[var(--color-text-secondary)]">
        {[
          { color: '#22c55e', label: '100%' },
          { color: '#6366f1', label: '>60%' },
          { color: '#f59e0b', label: '>0%' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-[var(--color-border)]/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="
              w-8 h-8 rounded-full flex items-center justify-center
              bg-[var(--color-primary)]/10 text-[var(--color-primary)]
              font-bold text-sm
            ">
              {stats?.totalHabits || 0}
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--color-foreground)]">Active Habits</p>
              <p className="text-[10px] text-[var(--color-text-secondary)]">Your current goals</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/analytics')}
            className="
              flex items-center gap-1 text-[11px] font-medium
              text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]
              transition-colors duration-200
            "
          >
            Analytics <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyProgress;
