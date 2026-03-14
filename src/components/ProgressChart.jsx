import React from 'react';
import { ResponsiveContainer, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useHabits } from '../context/HabitContext';

const ProgressChart = () => {
  const { stats, loading } = useHabits();

  if (loading || !stats) {
    return <div className="h-[400px] bg-[var(--color-surface)] rounded-2xl animate-pulse col-span-1 lg:col-span-2 shadow-sm border border-[var(--color-border)]"></div>;
  }

  // Transform Map<LocalDate, Double> to Array<{ name, completion }>
  const chartData = Object.entries(stats.dailyCompletionRates)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .map(([date, rate]) => ({
      name: new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      completion: Math.round(rate),
      rawDate: date
    }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</p>
          <p className="text-sm text-primary font-medium">
            Completion: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm col-span-1 lg:col-span-2 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--color-foreground)]">Daily Progress</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Last 30 Days Overview</p>
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" opacity={0.5} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#6b7280' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              domain={[0, 100]}
              ticks={[0, 50, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="completion" 
              stroke="#4f46e5" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCompletion)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
