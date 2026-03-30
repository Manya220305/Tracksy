import React from 'react';
import HabitGrid from '../components/HabitGrid';
import HabitForm from '../components/HabitForm';
import { useHabits } from '../context/HabitContext';
import { Plus } from 'lucide-react';
import StatsCards from '../components/StatsCards';
import ProgressChart from '../components/ProgressChart';
import WeeklyProgress from '../components/WeeklyProgress';

const Dashboard = () => {
  const { addHabit } = useHabits();
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const handleSubmit = async (formData) => {
    await addHabit(formData);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)] tracking-tight">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here's your productivity overview for today.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium shadow-md shadow-primary/20 transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus size={18} /> New Habit
        </button>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProgressChart />
        <WeeklyProgress />
      </div>

      <HabitGrid />

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsFormOpen(false)}
          ></div>
          <div className="relative z-10 w-full max-w-md">
            <HabitForm 
              onSubmit={handleSubmit} 
              onCancel={() => setIsFormOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
