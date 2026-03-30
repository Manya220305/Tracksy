import React, { useState, useEffect } from 'react';
import { Check, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import habitService from '../services/habitService';

const HabitGrid = () => {
  const { habits, loading: habitsLoading } = useHabits();
  const [logs, setLogs] = useState({}); // dateString -> completed (bool)
  const [fetchingLogs, setFetchingLogs] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedHabitId, setSelectedHabitId] = useState(null);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Force correct date format: YYYY-MM-DD
  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const todayString = formatDate(today.getFullYear(), today.getMonth(), today.getDate());

  useEffect(() => {
    if (habits.length > 0 && !selectedHabitId) {
      setSelectedHabitId(habits[0].id);
    }
  }, [habits, selectedHabitId]);

  useEffect(() => {
    const fetchHabitLogs = async () => {
      if (!selectedHabitId) return;
      setFetchingLogs(true);
      try {
        const data = await habitService.getLogs(selectedHabitId, currentMonth + 1, currentYear);
        
        const habitMap = {};
        if (Array.isArray(data)) {
          data.forEach(item => {
            habitMap[item.date] = item.completed;
          });
        }
        
        setLogs(habitMap);
      } catch (err) {
        console.error('Failed to fetch logs', err);
      } finally {
        setFetchingLogs(false);
      }
    };

    fetchHabitLogs();
  }, [selectedHabitId, currentMonth, currentYear]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToggle = async (dateStr) => {
    if (!selectedHabitId) return;
    
    // Prevent modifying past or future days
    if (dateStr !== todayString) {
      console.warn("Only today's habits can be modified.");
      return; 
    }
    
    // Optimistic Update: Show the cross immediately
    const currentStatus = logs[dateStr];
    const newStatus = currentStatus !== true;
    
    console.log(`CLicking date: ${dateStr}, Old status: ${currentStatus}, New status: ${newStatus}`);
    setLogs(prev => ({ ...prev, [dateStr]: newStatus }));

    try {
      await habitService.logHabit({
        habitId: selectedHabitId,
        date: dateStr,
        completed: newStatus
      });
      console.log(`API success for ${dateStr}`);
    } catch (err) {
      console.error('Failed to log habit', err);
      // Rollback on error
      setLogs(prev => ({ ...prev, [dateStr]: currentStatus }));
    }
  };

  const getDaysInMonth = (month, year) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const calendarDays = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfWeek = calendarDays[0].getDay();
  const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => null);
  const totalSlots = [...blanks, ...calendarDays];

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (habitsLoading && habits.length === 0) {
    return <div className="h-64 bg-[var(--color-surface)] rounded-2xl animate-pulse border border-[var(--color-border)] shadow-sm"></div>;
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-[var(--color-foreground)]">Tracksy</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track your daily progress</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={selectedHabitId || ''} 
            onChange={(e) => setSelectedHabitId(Number(e.target.value))}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs font-semibold text-[var(--color-foreground)] outline-none cursor-pointer"
          >
            {habits.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>

          <div className="flex items-center gap-4 text-xs font-medium mr-4">
            <div className="flex items-center gap-1.5 text-[var(--color-foreground)]">
              <div className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center font-bold text-xs">
                X
              </div>
              Completed
            </div>
            <div className="flex items-center gap-1.5 text-[var(--color-foreground)]">
              <div className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600"></div>
              Missed / No Data
            </div>
          </div>
          
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button onClick={handlePrevMonth} className="p-1.5 rounded-md hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-sm transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="px-4 text-sm font-semibold text-[var(--color-foreground)]">{monthName}</span>
            <button onClick={handleNextMonth} className="p-1.5 rounded-md hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-sm transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-[10px] font-bold uppercase text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="relative">
          {(fetchingLogs || habitsLoading) && (
            <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 flex items-center justify-center z-10">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          )}
          
          <div className="grid grid-cols-7 gap-2">
            {totalSlots.map((date, idx) => {
              const dateString = date ? formatDate(date.getFullYear(), date.getMonth(), date.getDate()) : null;
              
              const status = dateString ? logs[dateString] : undefined;

              const isToday = dateString === todayString;
              const isPastDay = dateString && dateString < todayString;
              const isFutureDay = dateString && dateString > todayString;

              // NO BACKGROUND COLORS
              const colorClass = "bg-transparent text-[var(--color-foreground)]";

              const todayClass = isToday ? "border-2 border-blue-500 z-10" : "border-gray-200 dark:border-gray-700";
              const cursorClass = (isPastDay || isFutureDay) ? "cursor-not-allowed opacity-70" : "cursor-pointer";

              return (
                <button
                  key={idx}
                  disabled={!date || isPastDay || isFutureDay}
                  onClick={() => date && !isPastDay && !isFutureDay && handleToggle(dateString)}
                  className={`relative h-14 w-full rounded-md border flex items-center justify-center transition-all duration-200 shadow-sm ${colorClass} ${todayClass} ${cursorClass} ${!date ? 'opacity-0' : ''}`}
                >
                  {date && (
                    <span className="text-sm font-bold select-none">
                      {status === true ? (
                        <span className="text-xl font-black text-primary">X</span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">{date.getDate()}</span>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitGrid;
