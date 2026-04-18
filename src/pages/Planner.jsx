import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Clock, CalendarDays, CheckCircle2, Circle, ClipboardList } from 'lucide-react';

const STORAGE_KEY = 'tracksy_planner_tasks';

const getToday = () => {
  const d = new Date();
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const loadTasks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    const todayKey = getTodayKey();
    return (data[todayKey] || []);
  } catch { return []; }
};

const saveTasks = (tasks) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    data[getTodayKey()] = tasks;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* silent */ }
};

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
  '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM',
];

const Planner = () => {
  const [tasks, setTasks] = useState(loadTasks);
  const [newTask, setNewTask] = useState('');
  const [newTime, setNewTime] = useState('');
  const [view, setView] = useState('day');
  const inputRef = useRef(null);

  useEffect(() => { saveTasks(tasks); }, [tasks]);

  const addTask = () => {
    const text = newTask.trim();
    if (!text) return;
    setTasks(prev => [
      ...prev,
      { id: Date.now(), title: text, time: newTime || null, done: false },
    ]);
    setNewTask('');
    setNewTime('');
    inputRef.current?.focus();
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') addTask(); };

  const pending = tasks.filter(t => !t.done);
  const completed = tasks.filter(t => t.done);
  const completionPct = tasks.length ? Math.round((completed.length / tasks.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)] tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
              <ClipboardList size={22} className="text-indigo-400" />
            </div>
            Planner
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Plan your day and stay organized</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date badge */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-gray-500 dark:text-gray-400">
            <CalendarDays size={16} />
            {getToday()}
          </div>

          {/* View toggle */}
          <div className="flex rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-1">
            <button
              onClick={() => setView('day')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                view === 'day'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-[var(--color-foreground)]'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                view === 'week'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-[var(--color-foreground)]'
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Today's Progress</span>
          <span className="text-sm font-bold text-[var(--color-foreground)]">{completionPct}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 ease-out"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          {completed.length} of {tasks.length} tasks completed
        </p>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left — Tasks (70%) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Add task input */}
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 shadow-sm">
            <h3 className="text-base font-semibold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500 inline-block" />
              Today's Tasks
            </h3>
            <div className="flex gap-3">
              <div className="flex-1 flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Add a new task..."
                  value={newTask}
                  onChange={e => setNewTask(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-gray-50 dark:bg-gray-800/60 border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all"
                />
                <input
                  type="text"
                  placeholder="Time (optional)"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-36 bg-gray-50 dark:bg-gray-800/60 border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all"
                />
              </div>
              <button
                onClick={addTask}
                disabled={!newTask.trim()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2"
              >
                <Plus size={18} />
                Add
              </button>
            </div>
          </div>

          {/* Pending tasks */}
          {pending.length > 0 && (
            <div className="space-y-2">
              {pending.map((task, i) => (
                <div
                  key={task.id}
                  className="group bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 flex items-center gap-4 hover:border-indigo-500/30 hover:shadow-sm transition-all duration-200"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <button onClick={() => toggleTask(task.id)} className="flex-shrink-0 text-gray-400 dark:text-gray-600 hover:text-indigo-500 transition-colors">
                    <Circle size={22} />
                  </button>
                  <span className="flex-1 text-sm font-medium text-[var(--color-foreground)]">
                    {task.title}
                  </span>
                  {task.time && (
                    <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                      <Clock size={12} /> {task.time}
                    </span>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Completed tasks */}
          {completed.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1 mb-2">
                Completed ({completed.length})
              </p>
              {completed.map(task => (
                <div
                  key={task.id}
                  className="group bg-[var(--color-surface)]/60 rounded-xl border border-[var(--color-border)] p-4 flex items-center gap-4 opacity-60 hover:opacity-80 transition-all"
                >
                  <button onClick={() => toggleTask(task.id)} className="flex-shrink-0 text-green-500">
                    <CheckCircle2 size={22} />
                  </button>
                  <span className="flex-1 text-sm font-medium text-gray-400 dark:text-gray-500 line-through">
                    {task.title}
                  </span>
                  {task.time && (
                    <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800/50 px-2.5 py-1 rounded-lg">
                      <Clock size={12} /> {task.time}
                    </span>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {tasks.length === 0 && (
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center mb-4">
                <ClipboardList size={28} className="text-indigo-400" />
              </div>
              <h4 className="text-base font-semibold text-[var(--color-foreground)] mb-1">No tasks yet</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                Start planning your day by adding your first task above.
              </p>
            </div>
          )}
        </div>

        {/* Right — Quick Schedule (30%) */}
        <div className="lg:col-span-3">
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 shadow-sm sticky top-6">
            <h3 className="text-base font-semibold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-purple-500 to-pink-500 inline-block" />
              Quick Schedule
            </h3>
            <div className="space-y-1">
              {timeSlots.map(slot => {
                const matchingTask = tasks.find(t => t.time && t.time.toLowerCase() === slot.toLowerCase() && !t.done);
                return (
                  <div
                    key={slot}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      matchingTask
                        ? 'bg-indigo-500/10 border border-indigo-500/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'
                    }`}
                  >
                    <span className="w-16 text-xs font-mono text-gray-400 dark:text-gray-500 flex-shrink-0">
                      {slot}
                    </span>
                    {matchingTask ? (
                      <span className="text-xs font-medium text-indigo-400 truncate">
                        {matchingTask.title}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300 dark:text-gray-700">—</span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
              <p className="text-[11px] text-gray-400 dark:text-gray-600 text-center">
                Add a time to your tasks to see them here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;
