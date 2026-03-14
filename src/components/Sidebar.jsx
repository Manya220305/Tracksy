import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, BarChart2, Medal, Settings } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Habits', path: '/habits', icon: <ListTodo size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart2 size={20} /> },
    { name: 'Achievements', path: '/achievements', icon: <Medal size={20} /> },
    { name: 'Settings', path: '#', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col transition-colors duration-300">
      <div className="h-16 flex items-center px-6 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <LayoutDashboard size={24} className="text-primary" />
          </div>
          <span className="text-[var(--color-foreground)]">HabitFlow</span>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive && item.path !== '#'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 m-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/10">
        <h4 className="font-semibold text-sm mb-1 text-[var(--color-foreground)]">Upgrade to Pro</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Get unlimited habits and advanced analytics.</p>
        <button className="w-full text-xs font-semibold bg-white dark:bg-gray-800 text-primary py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Upgrade Now
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
