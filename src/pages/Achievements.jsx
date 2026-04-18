import React, { useState, useEffect } from 'react';
import AchievementCard from '../components/AchievementCard';
import { Award, Loader2, Trophy, Lock } from 'lucide-react';
import dashboardService from '../services/dashboardService';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await dashboardService.getAchievements();
        setAchievements(data);
      } catch (err) {
        console.error('Failed to fetch achievements', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-[var(--color-primary)]" size={48} />
      </div>
    );
  }

  const earned = achievements.filter(a => a.earned);
  const locked = achievements.filter(a => !a.earned);

  return (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-[var(--color-foreground)] tracking-tight">Achievements</h1>
          <p className="text-[var(--color-text-secondary)] mt-2 text-lg">Your productivity milestones and badges.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-[var(--color-primary)]/10 px-6 py-3 rounded-2xl border border-[var(--color-primary)]/20 flex items-center gap-3">
            <Trophy size={24} className="text-[var(--color-primary)]" />
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]/60">Total Unlocked</span>
              <span className="text-xl font-black text-[var(--color-primary)]">
                {earned.length} / {achievements.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Earned Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
          <div className="p-2 rounded-xl bg-green-500/10 text-green-500">
            <Award size={20} />
          </div>
          <h2 className="text-xl font-bold text-[var(--color-foreground)]">Earned Badges</h2>
        </div>
        
        {earned.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {earned.map((achievement, index) => (
              <AchievementCard 
                key={index} 
                {...achievement} 
              />
            ))}
          </div>
        ) : (
          <div className="py-12 bg-[var(--color-surface)]/30 rounded-3xl border border-dashed border-[var(--color-border)] text-center">
            <p className="text-[var(--color-text-secondary)]">Start completing habits to earn your first badge! 🚀</p>
          </div>
        )}
      </section>

      {/* Locked Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
          <div className="p-2 rounded-xl bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)]">
            <Lock size={20} />
          </div>
          <h2 className="text-xl font-bold text-[var(--color-foreground)]">Locked Badges</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {locked.map((achievement, index) => (
            <AchievementCard 
              key={index} 
              {...achievement} 
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Achievements;
