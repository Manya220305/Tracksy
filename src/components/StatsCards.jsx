import React from 'react';
import { Flame, Trophy, Target, TrendingUp } from 'lucide-react';
import { useHabits } from '../context/HabitContext';

const StatCard = ({ title, value, subtitle, icon: Icon, colorClass, trend }) => {
  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-[var(--color-foreground)]">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon size={24} className="opacity-80" />
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2">
        {trend !== undefined && (
          <span className={`text-xs font-semibold ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
        <span className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</span>
      </div>
    </div>
  );
};

const StatsCards = () => {
  const { stats, loading } = useHabits();

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-[var(--color-surface)] rounded-2xl animate-pulse border border-[var(--color-border)]"></div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Current Streak',
      value: `${stats.currentStreak} Days`,
      subtitle: stats.currentStreak > 0 ? 'Keep it up!' : 'Start today!',
      icon: Flame,
      colorClass: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    },
    {
      title: 'Overall Rate',
      value: `${stats.overallCompletionRate}%`,
      subtitle: 'All-time progress',
      icon: TrendingUp,
      colorClass: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    },
    {
      title: 'Total Habits',
      value: `${stats.totalHabits} Active`,
      subtitle: 'Your current goals',
      icon: Target,
      colorClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      title: 'Total Logs',
      value: stats.totalCompletions,
      subtitle: 'Completions tracked',
      icon: Trophy,
      colorClass: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsCards;
