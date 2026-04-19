import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, Moon, Sun, LogOut, CheckCheck, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import notificationService from '../services/notificationService';
import { useTaskNotifications } from '../hooks/useTaskNotifications';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { toggle } = useSidebar();

  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  const [notifications, setNotifications] = useState([]);
  const [lastNotificationIds, setLastNotificationIds] = useState(new Set());
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [localNotifications, setLocalNotifications] = useState([]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const data = await notificationService.getNotifications();
      
      // Check for new achievements to show toast
      data.forEach(n => {
        if (n.type === 'ACHIEVEMENT' && !lastNotificationIds.has(n.id)) {
          toast.success(n.message, {
            icon: '🎉',
            className: 'achievement-toast',
            progressClassName: 'achievement-progress'
          });
        }
      });

      // Update seen IDs
      const newIds = new Set(data.map(n => n.id));
      setLastNotificationIds(newIds);

      // Merge with local ones that are not read
      setNotifications([...data, ...localNotifications]);
    } catch (e) {
      console.error(e);
    }
  };

  const addLocalNotification = (notif) => {
    setLocalNotifications(prev => [...prev, notif]);
    setNotifications(prev => [...prev, notif]);
  };

  useTaskNotifications(addLocalNotification);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('tracksy-theme', next ? 'dark' : 'light'); } catch (_) {}
  };

  const handleMarkAsRead = async () => {
    try {
      await notificationService.markAsRead();
      setNotifications([]);
      setLocalNotifications([]);
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.length;

  const formatTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " min ago";
    return Math.floor(seconds) + " sec ago";
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'ALERT':        return 'border-[var(--color-error)] bg-[var(--color-error)]/10 text-[var(--color-error)]';
      case 'STREAK':       return 'border-[var(--color-warning)] bg-[var(--color-warning)]/10 text-[var(--color-warning)]';
      case 'ACHIEVEMENT':  return 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]';
      case 'MISSED_HABIT': return 'border-[var(--color-error)] bg-[var(--color-error)]/10 text-[var(--color-error)]';
      default:             return 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]';
    }
  };

  return (
    <nav className="
      h-16 px-4 flex items-center justify-between flex-shrink-0
      bg-[var(--color-surface)] border-b border-[var(--color-border)]
      transition-theme relative z-40
    ">
      {/* Left — sidebar toggle (mobile) + search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={toggle}
          className="p-2 rounded-xl hover:bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] hover:text-[var(--color-foreground)] transition-all duration-200 md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Search bar */}
        <div className="relative w-full max-w-sm hidden sm:block group">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] group-focus-within:text-[var(--color-primary)] transition-colors duration-200"
          />
          <input
            type="text"
            placeholder="Search habits, tasks…"
            className="
              w-full pl-9 pr-4 py-2 text-sm rounded-xl outline-none
              bg-[var(--color-surface-raised)]
              border border-transparent
              focus:border-[var(--color-primary)]/40
              focus:ring-2 focus:ring-[var(--color-primary)]/10
              text-[var(--color-foreground)]
              placeholder:text-[var(--color-text-secondary)]
              transition-all duration-200
            "
          />
        </div>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="
            p-2.5 rounded-xl
            text-[var(--color-text-secondary)] hover:text-[var(--color-foreground)]
            hover:bg-[var(--color-surface-raised)]
            transition-all duration-200
          "
        >
          {darkMode
            ? <Sun size={19} className="text-amber-400" />
            : <Moon size={19} />
          }
        </button>

        {/* Notifications bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(v => !v)}
            className="
              relative p-2.5 rounded-xl
              text-[var(--color-text-secondary)] hover:text-[var(--color-foreground)]
              hover:bg-[var(--color-surface-raised)]
              transition-all duration-200
            "
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="
                absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center
                rounded-full bg-[var(--color-error)] ring-2 ring-[var(--color-surface)]
                text-[9px] font-bold text-white
              ">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {showDropdown && (
            <div className="
              absolute right-0 mt-2 w-80
              bg-[var(--color-surface)] rounded-2xl
              shadow-2xl shadow-black/20
              border border-[var(--color-border)]
              overflow-hidden
              animate-in fade-in slide-in-from-top-2 duration-150
            ">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
                <h3 className="font-semibold text-[var(--color-foreground)] text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAsRead}
                    className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1"
                  >
                    <CheckCheck size={13} /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto p-2 space-y-1">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-surface-raised)] flex items-center justify-center mb-3">
                      <Bell className="text-[var(--color-text-secondary)] opacity-30" size={24} />
                    </div>
                    <p className="text-sm font-medium text-[var(--color-foreground)]">No new notifications</p>
                    <p className="text-[11px] text-[var(--color-text-secondary)] mt-1">Check back later for updates</p>
                  </div>
                ) : (
                  notifications.slice(0, 5).map(n => (
                    <div
                      key={n.id}
                      className={`
                        p-3 rounded-xl text-xs border-l-4 flex flex-col gap-0.5
                        ${getTypeStyle(n.type)}
                        font-medium
                        hover:brightness-110 transition-all duration-200
                      `}
                    >
                      <span className="text-[var(--color-foreground)]">{n.message}</span>
                      <span className="text-[10px] opacity-70">
                        {formatTimeAgo(n.createdAt)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-[var(--color-border)] mx-1" />

        {/* User avatar + logout */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-[var(--color-foreground)] capitalize leading-tight">
              {user?.username || 'Guest'}
            </p>
            <p className="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold tracking-tight opacity-50">Free Plan</p>
          </div>

          <div className="
            w-9 h-9 rounded-xl flex items-center justify-center
            bg-[var(--color-primary-muted)]
            border border-[var(--color-primary)]/20
            text-[var(--color-primary)] font-bold text-sm
            select-none overflow-hidden
          ">
            {user?.profileImageUrl ? (
              <img 
                src={`http://localhost:8080${user.profileImageUrl}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              user?.username?.charAt(0).toUpperCase() || 'G'
            )}
          </div>

          <button
            onClick={logout}
            title="Logout"
            className="
              p-2 rounded-xl
              text-[var(--color-text-secondary)] hover:text-[var(--color-error)]
              hover:bg-[var(--color-error)]/10
              transition-all duration-200
            "
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
