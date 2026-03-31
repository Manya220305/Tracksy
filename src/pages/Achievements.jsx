import React, { useState, useEffect } from 'react';
import AchievementCard from '../components/AchievementCard';
import { Trophy, Award, Target, Star, Loader2 } from 'lucide-react';
import dashboardService from '../services/dashboardService';

const Achievements = () => {
  const [earnedAchievements, setEarnedAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await dashboardService.getAchievements();
        setEarnedAchievements(data);
      } catch (err) {
        console.error('Failed to fetch achievements', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  const allAchievements = [
    {
      title: 'First Completion',
      description: 'Completed your first habit!',
      icon: Trophy,
      color: 'blue',
    },
    {
      title: '7 Day Streak',
      description: 'Maintained a 7-day streak on any habit.',
      icon: Award,
      color: 'purple',
    },
    {
      title: 'Goal Setter',
      description: 'Tracking 5 or more habits.',
      icon: Target,
      color: 'green',
    },
    {
      title: '100 Habit Completions',
      description: 'Completed 100 habits total!',
      icon: Star,
      color: 'yellow',
    },
    {
      title: '30 Day Consistency',
      description: 'Achieved a 30-day streak on any habit.',
      icon: Award,
      color: 'indigo',
    },
    {
      title: 'Century Streak',
      description: 'Achieved a 100-day streak on any habit.',
      icon: Trophy,
      color: 'orange',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  // Map earned achievements to the full list to show locked/unlocked state
  const achievementsWithState = allAchievements.map(base => {
    const earned = earnedAchievements.find(e => e.title === base.title);
    let formattedDate = null;
    if (earned && earned.earnedAt) {
      const date = new Date(earned.earnedAt);
      formattedDate = date.toLocaleDateString();
    }
    return {
      ...base,
      isLocked: !earned,
      progress: earned ? 100 : 0, // Simplified progress
      target: 100,
      dateEarned: formattedDate
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-foreground)] tracking-tight">Achievements</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Badges you've earned on your productivity journey.</p>
        </div>
        
        <div className="bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 flex items-center gap-2">
          <Award size={18} className="text-primary" />
          <span className="text-sm font-bold text-primary">
            {earnedAchievements.length} / {allAchievements.length} Unlocked
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievementsWithState.map((achievement, index) => (
          <AchievementCard 
            key={index} 
            {...achievement} 
          />
        ))}
      </div>
    </div>
  );
};

export default Achievements;
