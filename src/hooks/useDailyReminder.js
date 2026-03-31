import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useHabits } from '../context/HabitContext';

const useDailyReminder = () => {
  const { stats } = useHabits();

  useEffect(() => {
    // 1. Check if stats are loaded
    if (!stats) return;

    // 2. Determine if it's past 10 PM (22:00)
    const now = new Date();
    if (now.getHours() < 22) return;

    // 3. Get today's local date string to use as local storage key and map key
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    const storageKey = `hasSeenReminder_${todayStr}`;

    // 4. Check if we already showed the reminder today
    if (localStorage.getItem(storageKey)) return;

    // 5. Check if they have ANY completed habit today
    const dailyRates = stats.dailyCompletionRates || {};
    const todayRate = dailyRates[todayStr] || 0;

    // If the rate is 0, it means no habits were completed OR there are no habits.
    if (todayRate === 0) {
      toast.warn("⚠️ You haven't updated your habits today! Don't lose your streak!", {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });

      // Mark as seen so they don't get spammed on every navigation loop
      localStorage.setItem(storageKey, 'true');
    }
  }, [stats]);
};

export default useDailyReminder;
