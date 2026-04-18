import React from 'react';
import { Flame, Trophy, Target, TrendingUp } from 'lucide-react';
import { useHabits } from '../context/HabitContext';

const StatCard = ({ title, value, subtitle, icon: Icon, accent }) => {
  return (
    <div className="
      group relative overflow-hidden
      bg-[var(--color-surface)] rounded-2xl px-5 py-4
      border border-[var(--color-border)]
      shadow-sm hover:shadow-md
      transition-all duration-300 ease-out
      hover:-translate-y-0.5
    ">
      {/* Subtle accent glow top-right */}
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 blur-xl transition-opacity duration-300 group-hover:opacity-20"
        style={{ background: accent }}
      />

      <div className="flex justify-between items-start relative">
        <div>
          <p className="text-[var(--color-text-secondary)] text-xs font-medium mb-1 uppercase tracking-widest">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-[var(--color-foreground)] leading-tight">{value}</h3>
        </div>

        <div
          className="p-2.5 rounded-xl opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
          style={{ background: `${accent}22`, color: accent }}
        >
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[var(--color-border)]/60">
        <span className="text-[11px] text-[var(--color-text-secondary)]">{subtitle}</span>
      </div>
    </div>
  );
};

const StatsCards = () => {
  const { stats, loading } = useHabits();

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="h-28 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] animate-pulse"
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Current Streak',
      value: `${stats.currentStreak} Days`,
      subtitle: stats.currentStreak > 0 ? '🔥 Keep it up!' : 'Start today!',
      icon: Flame,
      accent: '#f97316',
    },
    {
      title: 'Overall Rate',
      value: `${stats.overallCompletionRate}%`,
      subtitle: 'All-time progress',
      icon: TrendingUp,
      accent: '#22c55e',
    },
    {
      title: 'Total Habits',
      value: `${stats.totalHabits} Active`,
      subtitle: 'Your current goals',
      icon: Target,
      accent: '#6366f1',
    },
    {
      title: 'Total Logs',
      value: stats.totalCompletions,
      subtitle: 'Completions tracked',
      icon: Trophy,
      accent: '#eab308',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
      {cards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsCards;
