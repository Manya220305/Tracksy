import React from 'react';
import {
  ResponsiveContainer, Area, AreaChart,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { useHabits } from '../context/HabitContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="
      bg-[var(--color-surface)] text-[var(--color-foreground)]
      border border-[var(--color-border)]
      px-3 py-2.5 rounded-xl shadow-xl text-xs
    ">
      <p className="font-semibold mb-0.5">{label}</p>
      <p className="text-[var(--color-primary)] font-medium">
        {payload[0].value}% completed
      </p>
    </div>
  );
};

const ProgressChart = () => {
  const { stats, loading } = useHabits();

  if (loading || !stats) {
    return (
      <div className="h-[380px] bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] animate-pulse" />
    );
  }

  const chartData = stats?.dailyCompletionRates ? Object.entries(stats.dailyCompletionRates)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, rate]) => ({
      name: new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      completion: Math.round(rate),
    })) : [];

  return (
    <div className="
      bg-[var(--color-surface)] p-4 md:p-6 rounded-2xl h-full
      border border-[var(--color-border)]
      shadow-sm hover:shadow-md
      transition-all duration-300
    ">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 md:mb-5">
        <div>
          <h3 className="text-sm md:text-base font-bold text-[var(--color-foreground)]">Daily Progress</h3>
          <p className="text-[10px] md:text-xs text-[var(--color-text-secondary)] mt-0.5">Last 30 days overview</p>
        </div>
        <span className="
          flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] md:text-xs font-semibold
          bg-[var(--color-primary)]/10 text-[var(--color-primary)]
        ">
          <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
          Live
        </span>
      </div>

      <div className="h-[200px] md:h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="var(--color-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              opacity={0.08}
              className="text-[var(--color-text-secondary)]"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
              domain={[0, 100]}
              ticks={[0, 50, 100]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="completion"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#progressGradient)"
              activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--color-primary)', fill: 'var(--color-surface)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
