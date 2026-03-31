import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, Moon, Sun, LogOut, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notificationService';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });
  
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Polling every 60s
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleMarkAsRead = async () => {
    try {
      await notificationService.markAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getTypeStyle = (type) => {
    switch(type) {
      case 'ALERT': return 'border-red-500 bg-red-500/10 text-red-500';
      case 'STREAK': return 'border-orange-500 bg-orange-500/10 text-orange-500';
      case 'ACHIEVEMENT': return 'border-yellow-500 bg-yellow-500/10 text-yellow-500';
      default: return 'border-blue-500 bg-blue-500/10 text-blue-500';
    }
  };

  return (
    <nav className="h-16 px-6 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-background)] transition-colors duration-300 relative z-50">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden md:block group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search habits, tasks, or resources..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm group-hover:bg-gray-200/50 dark:group-hover:bg-gray-700/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 ring-2 ring-[var(--color-background)] text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-[var(--color-foreground)]">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAsRead} className="text-xs text-primary hover:underline flex items-center gap-1">
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>
              
              <div className="max-h-80 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-sm text-gray-500">
                    <Bell className="mx-auto mb-2 opacity-50" size={24} />
                    You're all caught up!
                  </div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`p-3 mb-1 rounded-xl text-sm transition-colors border-l-4 ${getTypeStyle(n.type)} ${n.isRead ? 'opacity-70 bg-transparent' : 'bg-gray-50/50 dark:bg-gray-700/30 font-medium'} flex flex-col gap-1`}
                    >
                      <span className="text-[var(--color-foreground)]">{n.message}</span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-[1px] bg-[var(--color-border)] mx-2"></div>

        <div className="flex items-center gap-3 pl-2 group cursor-pointer relative">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[var(--color-foreground)] line-height-none capitalize">
              {user?.username || 'Guest User'}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Free Plan</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-sm transition-transform group-hover:scale-105">
            {user?.username?.charAt(0).toUpperCase() || 'G'}
          </div>
          
          <button 
            onClick={logout}
            className="p-2.5 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
