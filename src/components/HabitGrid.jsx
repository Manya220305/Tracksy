import React, { useState, useEffect } from 'react';
import { Check, X, ChevronLeft, ChevronRight, Loader2, Clock } from 'lucide-react';
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
    return <div className="h-64 bg-[var(--color-surface)] rounded-2xl animate-pulse shadow-sm"></div>;
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm shadow-black/5 dark:shadow-black/20 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 md:px-5 py-3 md:py-4 border-b border-[var(--color-border)]/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="hidden sm:block">
          <h3 className="text-sm font-bold text-[var(--color-foreground)]">Tracksy</h3>
          <p className="text-[11px] text-[var(--color-text-secondary)]">Track your daily progress</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full sm:w-auto">
          <select 
            value={selectedHabitId || ''} 
            onChange={(e) => setSelectedHabitId(Number(e.target.value))}
            className="flex-1 sm:flex-none bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-lg px-2 py-1.5 text-[10px] md:text-[11px] font-semibold text-[var(--color-foreground)] outline-none cursor-pointer min-h-[36px] transition-theme shadow-sm"
          >
            {habits.map(h => (
              <option key={h.id} value={h.id} className="bg-[var(--color-surface)] text-[var(--color-foreground)]">
                {h.name} {h.scheduledTime ? `(${new Date(`2000-01-01T${h.scheduledTime}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })})` : ''}
              </option>
            ))}
          </select>

          <div className="hidden lg:flex items-center gap-3 text-[10px] font-medium mr-2">
            <div className="flex items-center gap-1 text-[var(--color-foreground)]">
              <div className="w-4 h-4 rounded border border-gray-400 dark:border-gray-500 bg-slate-900 dark:bg-white flex items-center justify-center font-bold text-[9px] text-white dark:text-slate-900">
                X
              </div>
              Done
            </div>
          </div>
          
          <div className="flex items-center bg-[var(--color-surface-raised)] border border-[var(--color-border)]/50 rounded-lg p-0.5 ml-auto sm:ml-0 transition-theme shadow-sm">
            <button onClick={handlePrevMonth} className="p-1.5 rounded-md hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-foreground)] transition-colors">
              <ChevronLeft size={14} />
            </button>
            <span className="px-2 md:px-2.5 text-[10px] md:text-[11px] font-bold text-[var(--color-foreground)] whitespace-nowrap min-w-[100px] text-center">{monthName}</span>
            <button onClick={handleNextMonth} className="p-1.5 rounded-md hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-foreground)] transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-3 md:p-5">
        <div className="grid grid-cols-7 mb-1">
          {weekDays.map(day => (
            <div key={day} className="text-center text-[9px] font-bold uppercase text-gray-500 dark:text-gray-400 py-1.5">
              {day}
            </div>
          ))}
        </div>

        <div className="relative">
          {(fetchingLogs || habitsLoading) && (
            <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-sm flex items-center justify-center z-10 transition-all">
              <Loader2 className="animate-spin text-primary" size={28} />
            </div>
          )}
          
          <div className="grid grid-cols-7 gap-1.5">
            {totalSlots.map((date, idx) => {
              const dateString = date ? formatDate(date.getFullYear(), date.getMonth(), date.getDate()) : null;
              
              const status = dateString ? logs[dateString] : undefined;

              const isToday = dateString === todayString;
              const isPastDay = dateString && dateString < todayString;
              const isFutureDay = dateString && dateString > todayString;

              // NO BACKGROUND COLORS
              const colorClass = status === true 
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" 
                : "bg-transparent text-[var(--color-foreground)]";

              const todayClass = isToday ? "border-2 border-blue-500/70 z-10 shadow-sm" : "border border-[var(--color-border)]/40";
              const cursorClass = (isPastDay || isFutureDay) ? "cursor-not-allowed" : "cursor-pointer";
              const dimClass = (isPastDay || isFutureDay) ? "opacity-30" : "";

              return (
                <button
                  key={idx}
                  disabled={!date || isPastDay || isFutureDay}
                  onClick={() => date && !isPastDay && !isFutureDay && handleToggle(dateString)}
                  className={`relative h-11 w-full rounded-md flex items-center justify-center transition-all duration-200 ${colorClass} ${todayClass} ${cursorClass} ${dimClass} ${!date ? 'opacity-0 pointer-events-none' : ''}`}
                >
                  {date && (
                    <span className="text-xs font-bold select-none">
                      {status === true ? (
                        <span className="text-base font-bold">X</span>
                      ) : (
                        <span className="text-[var(--color-text-secondary)]">{date.getDate()}</span>
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
