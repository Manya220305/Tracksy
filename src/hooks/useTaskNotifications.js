import { useState, useEffect } from 'react';

const TASKS_STORAGE_KEY = 'tracksy_planner_tasks';
const NOTIFS_STORAGE_KEY = 'tracksy_local_notifications';

const getTodayKey = () => new Date().toISOString().slice(0, 10);

export const useTaskNotifications = (addNotification) => {
  useEffect(() => {
    const checkTasks = () => {
      try {
        const rawTasks = localStorage.getItem(TASKS_STORAGE_KEY);
        if (!rawTasks) return;

        const tasksData = JSON.parse(rawTasks);
        const todayTasks = tasksData[getTodayKey()] || [];
        
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        // Already notified task IDs for today
        const rawLocalNotifs = localStorage.getItem(NOTIFS_STORAGE_KEY);
        const localNotifs = rawLocalNotifs ? JSON.parse(rawLocalNotifs) : {};
        const todayNotified = localNotifs[getTodayKey()] || [];

        const newNotified = [...todayNotified];
        let changed = false;

        todayTasks.forEach(task => {
          if (!task.done && task.time && !todayNotified.includes(task.id)) {
            const [hours, minutes] = task.time.split(':').map(Number);
            const taskTime = hours * 60 + minutes;

            if (currentTime > taskTime) {
              // Missed task!
              addNotification({
                id: `task-${task.id}`,
                message: `You missed your scheduled task: ${task.title}`,
                type: 'ALERT',
                createdAt: new Date().toISOString(),
                isRead: false
              });
              newNotified.push(task.id);
              changed = true;
            }
          }
        });

        if (changed) {
          localNotifs[getTodayKey()] = newNotified;
          localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(localNotifs));
        }
      } catch (e) {
        console.error('Error in useTaskNotifications:', e);
      }
    };

    checkTasks();
    const interval = setInterval(checkTasks, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [addNotification]);
};
