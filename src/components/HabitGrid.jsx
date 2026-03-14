import React, { useState, useEffect } from 'react';
import { Check, X, Minus, ChevronLeft, ChevronRight, MoreVertical, Loader2 } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import habitService from '../services/habitService';

const HabitGrid = () => {
  const { habits, toggleHabit, loading } = useHabits();
  const [logs, setLogs] = useState({}); // habitId -> { dateString -> status }
  const [fetchingLogs, setFetchingLogs] = useState(false);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    const fetchAllLogs = async () => {
      if (habits.length === 0) return;
      setFetchingLogs(true);
      const allLogs = {};
      try {
        await Promise.all(habits.map(async (habit) => {
          const habitLogs = await habitService.getLogs(habit.id);
          const logMap = {};
          habitLogs.forEach(log => {
            logMap[log.date] = log.completed ? 1 : 0; // 1: completed, 0: missed (if exists)
          });
          allLogs[habit.id] = logMap;
        }));
        setLogs(allLogs);
      } catch (err) {
        console.error('Failed to fetch logs', err);
      } finally {
        setFetchingLogs(false);
      }
    };

    fetchAllLogs();
  }, [habits]);

  const handleToggle = async (habitId, dayNumber) => {
    const date = new Date(currentYear, currentMonth, dayNumber);
    const dateStr = date.toISOString().split('T')[0];
    
    // Check if it's today
    if (dayNumber === today.getDate()) {
      await toggleHabit(habitId);
    } else if (dayNumber < today.getDate()) {
      // Historical toggling via log endpoint directly
      const currentStatus = logs[habitId]?.[dateStr];
      await habitService.logHabit({
        habitId,
        date: dateStr,
        completed: currentStatus !== 1
      });
      // Refresh local logs
      const updatedLogs = await habitService.getLogs(habitId);
      const logMap = { ...logs[habitId] };
      updatedLogs.forEach(l => logMap[l.date] = l.completed ? 1 : 0);
      setLogs({ ...logs, [habitId]: logMap });
    }
  };

  const getCellColor = (status, isToday, isFuture) => {
    if (isFuture) return 'bg-gray-50 border-gray-100 dark:bg-gray-800/50 dark:border-gray-800 text-transparent cursor-not-allowed';
    
    switch(status) {
      case 1: 
        return 'bg-green-500 border-green-600 text-white shadow-sm shadow-green-500/20';
      case 0: 
        return 'bg-gray-200 border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-gray-400 dark:text-gray-500';
      default: 
        return `bg-white dark:bg-[#1e293b] border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors cursor-pointer ${isToday ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-[#1e293b]' : ''}`;
    }
  };

  const currentMonthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });

  if (loading && habits.length === 0) {
    return <div className="h-64 bg-[var(--color-surface)] rounded-2xl animate-pulse border border-[var(--color-border)] shadow-sm"></div>;
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-[var(--color-foreground)]">Habit Tracker</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track your daily progress</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 text-xs font-medium mr-4">
            <div className="flex items-center gap-1.5 text-[var(--color-foreground)]"><div className="w-3 h-3 rounded bg-green-500"></div>Completed</div>
            <div className="flex items-center gap-1.5 text-[var(--color-foreground)]"><div className="w-3 h-3 rounded bg-gray-200 dark:bg-gray-700"></div>Missed</div>
          </div>
          
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button className="p-1.5 rounded-md hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-sm transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="px-4 text-sm font-semibold text-[var(--color-foreground)]">{currentMonthName}</span>
            <button className="p-1.5 rounded-md hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-sm transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px] p-6 relative">
          {(loading || fetchingLogs) && <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 flex items-center justify-center z-10"><Loader2 className="animate-spin text-primary" size={32} /></div>}
          
          <div className="flex mb-2">
            <div className="w-48 shrink-0"></div>
            <div className="flex-1 flex justify-between">
              {days.map((day) => {
                const isToday = day === today.getDate();
                return (
                  <div 
                    key={day} 
                    className={`w-8 flex justify-center text-xs font-medium ${
                      isToday ? 'text-primary font-bold' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            {habits.map((habit) => (
              <div key={habit.id} className="flex group items-center">
                <div className="w-48 shrink-0 flex items-center justify-between pr-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">✨</span>
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--color-foreground)] truncate max-w-[110px]" title={habit.name}>
                        {habit.name}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{habit.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex justify-between">
                  {days.map((day) => {
                    const date = new Date(currentYear, currentMonth, day);
                    const dateStr = date.toISOString().split('T')[0];
                    const status = logs[habit.id]?.[dateStr];
                    const isToday = day === today.getDate();
                    const isFuture = day > today.getDate();
                    
                    return (
                      <button
                        key={day}
                        onClick={() => handleToggle(habit.id, day)}
                        disabled={isFuture}
                        className={`w-7 h-7 rounded-md border flex items-center justify-center transition-all duration-200 ${getCellColor(status, isToday, isFuture)}`}
                        title={`${habit.name} - ${dateStr}`}
                      >
                        {status === 1 && <Check size={14} strokeWidth={3} />}
                        {status === 0 && <X size={14} strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {habits.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-500">No habits added yet. Start by adding one from the "My Habits" page!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitGrid;
