import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import habitService from '../services/habitService';
import dashboardService from '../services/dashboardService';
import { useAuth } from './AuthContext';

const HabitContext = createContext();

export const HabitProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHabits = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await habitService.getHabits();
      setHabits(data);
    } catch (error) {
      console.error('Failed to fetch habits', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await dashboardService.getDashboardData();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  }, [isAuthenticated]);

  const refreshData = useCallback(() => {
    fetchHabits();
    fetchStats();
  }, [fetchHabits, fetchStats]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    } else {
      setHabits([]);
      setStats(null);
    }
  }, [isAuthenticated, refreshData]);

  const addHabit = async (habitData) => {
    const newHabit = await habitService.createHabit(habitData);
    setHabits(prev => [...prev, newHabit]);
    fetchStats(); // Update stats
    return newHabit;
  };

  const updateHabit = async (id, habitData) => {
    const updated = await habitService.updateHabit(id, habitData);
    setHabits(prev => prev.map(h => h.id === id ? updated : h));
    return updated;
  };

  const deleteHabit = async (id) => {
    await habitService.deleteHabit(id);
    setHabits(prev => prev.filter(h => h.id !== id));
    fetchStats();
  };

  const toggleHabit = async (id) => {
    await habitService.toggleHabit(id);
    // Optimistic UI update could be added here
    refreshData();
  };

  return (
    <HabitContext.Provider value={{ 
      habits, 
      stats, 
      loading, 
      refreshData, 
      addHabit, 
      updateHabit, 
      deleteHabit, 
      toggleHabit 
    }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => useContext(HabitContext);
