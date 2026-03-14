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
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  // Transform insights data for charts
  const successRateData = insights ? Object.entries(insights.habitSuccessRates).map(([name, value]) => ({
    name,
    success: value
  })) : [];

  const categoryData = habits.reduce((acc, habit) => {
    const existing = acc.find(i => i.name === habit.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: habit.category, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-foreground)] tracking-tight">Analytics Insights</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Deeper look into your consistency and patterns.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Heatmap Section */}
        <div className="col-span-1 lg:col-span-3 bg-[var(--color-surface)] p-8 rounded-2xl border border-[var(--color-border)] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="text-primary" />
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
          <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-2xl border border-primary/20 shadow-sm relative overflow-hidden group">
            <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp size={120} />
            </div>
            <h4 className="text-sm font-semibold text-primary mb-1 uppercase tracking-wider">Top Performer</h4>
            <h3 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">
              {insights?.mostConsistentHabit || 'No Data'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your most consistent habit this month.</p>
          </div>

          <div className="bg-orange-500/5 dark:bg-orange-500/10 p-6 rounded-2xl border border-orange-500/20 shadow-sm relative overflow-hidden group">
            <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-500 text-orange-500">
              <TrendingUp size={120} className="rotate-180" />
            </div>
            <h4 className="text-sm font-semibold text-orange-500 mb-1 uppercase tracking-wider">Needs Attention</h4>
            <h3 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">
              {insights?.leastConsistentHabit || 'No Data'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Try to focus more on this habit next week.</p>
          </div>
        </div>

        {/* Success Rate Bar Chart */}
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm col-span-1 lg:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <BarIcon className="text-primary" />
            <h3 className="text-lg font-bold text-[var(--color-foreground)]">Success Rate per Habit (%)</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={successRateData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, className: 'dark:fill-gray-300' }} axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="success" fill="var(--color-primary)" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <PieIcon className="text-primary" />
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
              <div key={entry.name} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
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
