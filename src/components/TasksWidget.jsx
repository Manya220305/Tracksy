import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, ClipboardList, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'tracksy_planner_tasks';
const getTodayKey = () => new Date().toISOString().slice(0, 10);

const TasksWidget = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setTasks(data[getTodayKey()] || []);
      }
    } catch { /* silent */ }
  }, []);

  const toggleTask = (id) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, done: !t.done } : t);
      // persist
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const data = raw ? JSON.parse(raw) : {};
        data[getTodayKey()] = updated;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch { /* silent */ }
      return updated;
    });
  };

  // Show max 4 tasks on desktop, 3 on mobile for compact view
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const displayTasks = tasks.slice(0, isMobile ? 3 : 4);

  return (
    <div className="bg-[var(--color-surface)] p-4 md:p-5 rounded-2xl border border-[var(--color-border)] shadow-sm shadow-black/5 dark:shadow-black/20 transition-colors duration-300 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[var(--color-foreground)] flex items-center gap-2">
          <div className="p-1 rounded-md bg-gradient-to-br from-indigo-500/15 to-purple-500/15">
            <ClipboardList size={14} className="text-indigo-400" />
          </div>
          Today's Tasks
        </h3>
        {tasks.length > 0 && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400">
            {tasks.filter(t => t.done).length}/{tasks.length}
          </span>
        )}
      </div>

      <div className="flex-1">
        {displayTasks.length > 0 ? (
          <div className="divide-y divide-[var(--color-border)]/30">
            {displayTasks.map(task => (
              <div
                key={task.id}
                className={`flex items-center gap-2.5 py-2.5 transition-all duration-200 ${
                  task.done
                    ? 'opacity-40'
                    : ''
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`flex-shrink-0 transition-colors ${
                    task.done ? 'text-green-500' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  {task.done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                </button>
                <span
                  className={`text-xs font-medium flex-1 truncate ${
                    task.done
                      ? 'line-through text-[var(--color-text-secondary)] opacity-50'
                      : 'text-[var(--color-foreground)]'
                  }`}
                >
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-xs text-[var(--color-text-secondary)]">No tasks for today</p>
          </div>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-[var(--color-border)]/30">
        <button
          onClick={() => navigate('/planner')}
          className="w-full flex items-center justify-center gap-1.5 text-[11px] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-bold py-2 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-all shadow-sm"
        >
          View All <ArrowRight size={11} />
        </button>
      </div>
    </div>
  );
};

export default TasksWidget;
