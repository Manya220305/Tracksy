import React from 'react';
import HabitGrid from '../components/HabitGrid';
import HabitForm from '../components/HabitForm';
import { useHabits } from '../context/HabitContext';
import { Plus } from 'lucide-react';
import StatsCards from '../components/StatsCards';
import ProgressChart from '../components/ProgressChart';
import WeeklyProgress from '../components/WeeklyProgress';
import TasksWidget from '../components/TasksWidget';
import useDailyReminder from '../hooks/useDailyReminder';

const Dashboard = () => {
  const { addHabit } = useHabits();
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  // Invoke daily reminder
  useDailyReminder();

  const handleSubmit = async (formData) => {
    await addHabit(formData);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500 max-w-[1600px] mx-auto p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[var(--color-foreground)] tracking-tight">Dashboard</h1>
          <p className="text-xs md:text-sm text-[var(--color-text-secondary)] mt-0.5 font-medium">Here's your productivity overview for today.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="w-full sm:w-auto bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-5 py-2.5 md:py-2 rounded-xl font-medium shadow-md shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm min-h-[44px]"
        >
          <Plus size={16} /> New Habit
        </button>
      </div>

      {/* Section 1: Stat Cards */}
      <StatsCards />

      {/* Section 2: Daily Progress (primary) + Monthly Consistency (secondary) */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-4 md:gap-6">
        <div className="xl:col-span-7">
          <ProgressChart />
        </div>
        <div className="xl:col-span-3">
          <WeeklyProgress />
        </div>
      </div>

      {/* Section 3: Calendar + Today's Tasks */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-4 md:gap-6">
        <div className="xl:col-span-7">
          <HabitGrid />
        </div>
        <div className="xl:col-span-3">
          <TasksWidget />
        </div>
      </div>

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
