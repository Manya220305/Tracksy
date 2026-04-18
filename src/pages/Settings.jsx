import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Bell, 
  Clock, 
  Moon, 
  Sun, 
  LogOut, 
  Trash2, 
  Shield, 
  Palette,
  Check,
  ChevronRight,
  Edit2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('08:00');
  
  const [notifications, setNotifications] = useState({
    achievements: true,
    streaks: true,
    missedHabits: false
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const SettingCard = ({ title, icon, children, description }) => (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm mb-6 transition-all duration-300">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--color-foreground)]">{title}</h3>
          {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const Toggle = ({ enabled, onToggle, label, subLabel }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <p className="text-sm font-semibold text-[var(--color-foreground)] line-height-none">{label}</p>
        {subLabel && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subLabel}</p>}
      </div>
      <button 
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${enabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Section */}
        <div className="md:col-span-2">
          <SettingCard 
            title="Profile Information" 
            icon={<User size={22} />}
            description="Manage your personal details and how others see you."
          >
            <div className="flex flex-col md:flex-row items-center gap-8 py-4">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center text-3xl font-bold text-primary shadow-inner">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 text-primary hover:scale-110 transition-transform">
                  <Edit2 size={16} />
                </button>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Username</label>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-[var(--color-border)]">
                    <span className="text-sm font-medium text-[var(--color-foreground)]">{user?.username || 'Username'}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email Address</label>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-[var(--color-border)]">
                    <span className="text-sm font-medium text-[var(--color-foreground)]">{user?.email || 'user@example.com'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all flex items-center gap-2">
                Update Profile
              </button>
            </div>
          </SettingCard>
        </div>

        {/* Reminders Section */}
        <SettingCard 
          title="Reminders" 
          icon={<Clock size={22} />}
          description="Never miss a habit with timely reminders."
        >
          <Toggle 
            label="Daily Reminders" 
            subLabel="Receive push notifications for your habits."
            enabled={remindersEnabled} 
            onToggle={() => setRemindersEnabled(!remindersEnabled)} 
          />
          
          <div className={`transition-all duration-300 ${remindersEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 mt-4 ml-1">Reminder Time</label>
            <div className="flex items-center gap-3">
              <input 
                type="time" 
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="flex-1 p-3 bg-gray-50 dark:bg-gray-800/50 border border-[var(--color-border)] rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-[var(--color-foreground)] font-medium"
              />
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <Clock size={20} />
              </div>
            </div>
          </div>
        </SettingCard>

        {/* Appearance Section */}
        <SettingCard 
          title="Appearance" 
          icon={<Palette size={22} />}
          description="Customize how the app looks and feels."
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-[var(--color-border)]">
              <button 
                onClick={() => darkMode && toggleDarkMode()}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${!darkMode ? 'bg-white dark:bg-gray-700 shadow-md text-primary font-bold' : 'text-gray-500'}`}
              >
                <Sun size={18} />
                <span className="text-sm">Light</span>
              </button>
              <button 
                onClick={() => !darkMode && toggleDarkMode()}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${darkMode ? 'bg-white dark:bg-gray-700 shadow-md text-primary font-bold' : 'text-gray-500'}`}
              >
                <Moon size={18} />
                <span className="text-sm">Dark</span>
              </button>
            </div>
            
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
              <p className="text-xs text-primary leading-relaxed">
                <span className="font-bold">Pro Tip:</span> Dark mode helps reduce eye strain during late-night habit tracking.
              </p>
            </div>
          </div>
        </SettingCard>

        {/* Notifications Section */}
        <div className="md:col-span-2">
          <SettingCard 
            title="Notification Preferences" 
            icon={<Bell size={22} />}
            description="Choose what you want to be notified about."
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <Toggle 
                label="Achievements" 
                subLabel="New badges & milestones"
                enabled={notifications.achievements} 
                onToggle={() => handleNotificationToggle('achievements')} 
              />
              <Toggle 
                label="Streak Updates" 
                subLabel="Progress milestone alerts"
                enabled={notifications.streaks} 
                onToggle={() => handleNotificationToggle('streaks')} 
              />
              <Toggle 
                label="Missed Habits" 
                subLabel="Daily end-of-day warnings"
                enabled={notifications.missedHabits} 
                onToggle={() => handleNotificationToggle('missedHabits')} 
              />
            </div>
          </SettingCard>
        </div>

        {/* Account Actions */}
        <div className="md:col-span-2">
          <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 shadow-sm transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2.5 bg-red-500/10 rounded-xl text-red-500">
                <Shield size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-500">Danger Zone</h3>
                <p className="text-xs text-red-500/60 mt-0.5">Permanent account actions. Proceed with caution.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <button 
                onClick={logout}
                className="flex-1 flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-red-500/30 hover:bg-red-500/5 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <LogOut size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                  <span className="text-sm font-semibold text-[var(--color-foreground)]">Sign out of account</span>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
              
              <button 
                className="flex-1 flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-red-500/30 hover:bg-red-500/5 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <Trash2 size={18} className="text-gray-400 group-hover:text-red-600 transition-colors" />
                  <span className="text-sm font-semibold text-red-500">Delete my account</span>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 pt-8 border-t border-[var(--color-border)] text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">Tracksy v1.2.0 • Made with ❤️ for Consistency</p>
      </div>
    </div>
  );
};

export default Settings;
