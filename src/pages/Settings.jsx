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
  AlertTriangle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user, login, logout, updateUserDetails } = useAuth();
  const fileInputRef = React.useRef(null);
  const [uploading, setUploading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const handleEditAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file.');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB.');
      return;
    }

    try {
      setUploading(true);
      const res = await userService.uploadProfileImage(file);
      
      // Update local user state
      updateUserDetails({ profileImageUrl: res.url });
      
      toast.success('Profile picture updated successfully!');
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Failed to upload profile picture.');
    } finally {
      setUploading(false);
    }
  };

  const handleThemeChange = (isDark) => {
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('08:00');
  
  const [notifications, setNotifications] = useState({
    achievements: true,
    streaks: true,
    missedHabits: false
  });

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
          {description && <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{description}</p>}
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
        {subLabel && <p className="text-xs text-[var(--color-text-secondary)] mt-1">{subLabel}</p>}
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
        <p className="text-[var(--color-text-secondary)] mt-2 font-medium">Manage your account settings and preferences.</p>
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
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div className={`
                  w-24 h-24 rounded-3xl overflow-hidden bg-primary/10 border-2 border-dashed border-primary/30 
                  flex items-center justify-center text-3xl font-bold text-primary shadow-inner transition-all
                  ${uploading ? 'opacity-50' : ''}
                `}>
                  {user?.profileImageUrl ? (
                    <img 
                      src={`http://localhost:8080${user.profileImageUrl}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.username?.charAt(0).toUpperCase() || 'U'
                  )}
                  
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Loader2 className="animate-spin text-white" size={24} />
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleEditAvatar}
                  disabled={uploading}
                  className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 text-primary hover:scale-110 transition-transform disabled:opacity-50"
                >
                  <Edit2 size={16} />
                </button>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="space-y-4">
                  <p className="text-xs text-[var(--color-text-secondary)] font-medium">Recommended: Square, max 5MB</p>
                  <div className="flex items-center justify-between p-3 bg-[var(--color-surface-raised)] rounded-xl border border-[var(--color-border)]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-[var(--color-text-secondary)] font-bold uppercase tracking-wider">Email Address</p>
                        <p className="text-sm font-semibold text-[var(--color-foreground)]">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[var(--color-surface-raised)] rounded-xl border border-[var(--color-border)]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-[var(--color-text-secondary)] font-bold uppercase tracking-wider">Username</p>
                        <p className="text-sm font-semibold text-[var(--color-foreground)]">{user?.username}</p>
                      </div>
                    </div>
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
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-bold text-[var(--color-foreground)] mb-2">Reminder System Status</label>
              <div className="flex items-center gap-3 p-3 bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl">
                <div className={`p-2 rounded-lg ${remindersEnabled ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  <Bell size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-[var(--color-foreground)]">{remindersEnabled ? 'Notifications Active' : 'Notifications Paused'}</p>
                  <p className="text-[10px] text-[var(--color-text-secondary)] font-medium">Get alerted for your daily habits</p>
                </div>
                <button 
                  onClick={() => setRemindersEnabled(!remindersEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${remindersEnabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${remindersEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            <div className="flex-1 relative">
              <label className="block text-sm font-bold text-[var(--color-foreground)] mb-2">Preferred Alert Time</label>
              <Clock size={18} className="absolute left-3 bottom-3.5 text-[var(--color-text-secondary)] z-10" />
              <input 
                type="time" 
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full p-3 pl-10 bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-[var(--color-foreground)] font-medium"
              />
            </div>
          </div>

          <div className="p-4 bg-[var(--color-primary-muted)] border border-[var(--color-primary)]/10 rounded-2xl flex items-start gap-4 transition-theme">
            <div className="p-2 bg-primary text-white rounded-lg shadow-md shadow-primary/20">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--color-foreground)] mb-1">Weekly Digest</h4>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed font-medium">Receive a comprehensive report of your habit scores and productivity trends every Sunday.</p>
            </div>
          </div>
        </SettingCard>

        {/* Appearance Section */}
        <SettingCard 
          title="Appearance Preferences" 
          icon={<Palette size={22} />}
          description="Customize the look and feel of your dashboard."
        >
          <div className="flex items-center justify-between p-1 bg-[var(--color-surface-raised)] rounded-2xl border border-[var(--color-border)]">
            <button 
              onClick={() => handleThemeChange(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${!darkMode ? 'bg-[var(--color-surface)] shadow-md text-primary font-bold' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-foreground)]'}`}
            >
              <Sun size={18} />
              <span className="text-sm">Light Mode</span>
            </button>
            <button 
              onClick={() => handleThemeChange(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${darkMode ? 'bg-[var(--color-surface)] shadow-md text-primary font-bold' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-foreground)]'}`}
            >
              <Moon size={18} />
              <span className="text-sm">Dark Mode</span>
            </button>
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
