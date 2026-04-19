import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useHabits } from '../context/HabitContext';
import dashboardService from '../services/dashboardService';
import Heatmap from '../components/Heatmap';
import ProgressChart from '../components/ProgressChart';
import { Loader2, TrendingUp, Calendar, PieChart as PieIcon, BarChart as BarIcon } from 'lucide-react';

const Analytics = () => {
  const { habits } = useHabits();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const data = await dashboardService.getAnalytics();
        setInsights(data);
      } catch (err) {
        console.error('Failed to fetch insights', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-[var(--color-primary)]" size={48} />
      </div>
    );
  }

  // Transform insights data for charts
  const successRateData = insights?.habitSuccessRates ? Object.entries(insights.habitSuccessRates).map(([name, value]) => {
    const habit = habits.find(h => h.name === name);
    return {
      name,
      success: value,
      category: habit ? habit.category : 'Other'
    };
  }) : [];

  const categoryColors = {
    'Learning': '#8b5cf6', // purple-500
    'Health': '#3b82f6',   // blue-500
    'Mindfulness': '#10b981', // green-500
    'Other': '#94a3b8'         // slate-400
  };

  const categoryData = habits.reduce((acc, habit) => {
    const existing = acc.find(i => i.name === habit.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: habit.category, value: 1 });
    }
    return acc;
  }, []);

  // Calculate Top Performer and Needs Attention
  const performerInsights = React.useMemo(() => {
    if (!insights || !insights.habitSuccessRates || Object.keys(insights.habitSuccessRates).length === 0) {
      return { 
        top: { name: 'No Data', score: 0 }, 
        bottom: { name: 'No Data', score: 0 },
        count: 0
      };
    }

    const rates = Object.entries(insights.habitSuccessRates);
    
    const top = rates.reduce((prev, curr) => (curr[1] > prev[1] ? curr : prev));
    const bottom = rates.reduce((prev, curr) => (curr[1] < prev[1] ? curr : prev));

    return {
      top: { name: top[0], score: top[1] },
      bottom: { name: bottom[0], score: bottom[1] },
      count: rates.length
    };
  }, [insights]);

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-foreground)] tracking-tight">Analytics Insights</h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">Deeper look into your consistency and patterns.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Heatmap Section */}
        <div className="col-span-1 lg:col-span-3 bg-[var(--color-surface)] p-8 rounded-2xl border border-[var(--color-border)] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="text-[var(--color-primary)]" />
            <h3 className="text-xl font-bold text-[var(--color-foreground)]">Consistency Heatmap</h3>
          </div>
          <Heatmap />
        </div>

        {/* Detailed Progress Chart */}
        <div className="col-span-1 lg:col-span-2">
          <ProgressChart />
        </div>

        {/* Insights Cards */}
        <div className="space-y-6">
          <div className="bg-[var(--color-primary-muted)] p-6 rounded-2xl border border-[var(--color-primary)]/10 shadow-sm relative overflow-hidden group">
            <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp size={120} className="text-[var(--color-primary)]" />
            </div>
            <h4 className="text-xs font-bold text-[var(--color-primary)] mb-1 uppercase tracking-widest">Top Performer</h4>
            <h3 className="text-2xl font-black text-[var(--color-foreground)] mb-2 truncate pr-10">
              {performerInsights.top.name}
            </h3>
            <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-tight">
              {performerInsights.top.name === 'No Data' 
                ? 'Add more logs to see insights.' 
                : `Highest consistency at ${performerInsights.top.score}% success.`}
            </p>
          </div>

          <div className="bg-[var(--color-warning)]/5 p-6 rounded-2xl border border-[var(--color-warning)]/20 shadow-sm relative overflow-hidden group">
            <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-500 text-[var(--color-warning)]">
              <TrendingUp size={120} className="rotate-180" />
            </div>
            <h4 className="text-xs font-bold text-[var(--color-warning)] mb-1 uppercase tracking-widest">Needs Attention</h4>
            <h3 className="text-2xl font-black text-[var(--color-foreground)] mb-2 truncate pr-10">
              {performerInsights.count === 1 ? 'Stay Focused' : performerInsights.bottom.name}
            </h3>
            <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-tight">
              {performerInsights.count === 0 
                ? 'Keep tracking to identify trends.' 
                : performerInsights.count === 1
                  ? `You only have one habit active! Add more goals.`
                  : `Lowest consistency at ${performerInsights.bottom.score}% success.`}
            </p>
          </div>
        </div>

        {/* Success Rate Bar Chart */}
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm col-span-1 lg:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <BarIcon className="text-[var(--color-primary)]" />
            <h3 className="text-lg font-bold text-[var(--color-foreground)]">Success Rate (%)</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={successRateData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.1} stroke="var(--color-border)" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="success" radius={[0, 4, 4, 0]} barSize={16}>
                  {successRateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[entry.category] || categoryColors.Other} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <PieIcon className="text-[var(--color-primary)]" />
            <h3 className="text-lg font-bold text-[var(--color-foreground)]">Category Mix</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-tight">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
