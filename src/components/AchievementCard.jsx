import React from 'react';
import { 
  Trophy, Star, Award, Target, Flame, Calendar, Medal, 
  Lock, CheckCircle2 
} from 'lucide-react';

const icons = {
  TROPHY: Trophy,
  STAR: Star,
  AWARD: Award,
  TARGET: Target,
  FLAME: Flame,
  CALENDAR: Calendar,
  MEDAL: Medal
};

const AchievementCard = ({ 
  title, 
  description, 
  iconType, 
  color, 
  currentValue, 
  targetValue, 
  earnedAt, 
  earned 
}) => {
  const Icon = icons[iconType] || Trophy;
  const percentage = Math.min(100, Math.round((currentValue / targetValue) * 100));
  
  const colorMap = {
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    green: 'text-green-500 bg-green-500/10 border-green-500/20',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    pink: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
    indigo: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    yellow: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  };

  const progressColorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    pink: 'bg-pink-500',
    indigo: 'bg-indigo-500',
    yellow: 'bg-yellow-500',
  };

  const activeColor = colorMap[color] || colorMap.blue;
  const progressBarColor = progressColorMap[color] || progressColorMap.blue;

  return (
    <div className={`
      relative p-6 rounded-3xl border transition-all duration-300
      ${earned 
        ? 'bg-[var(--color-surface)] border-[var(--color-border)] shadow-lg shadow-black/5 hover:-translate-y-1' 
        : 'bg-[var(--color-surface)]/50 border-[var(--color-border)]/50 grayscale opacity-70'}
    `}>
      <div className="flex flex-col items-center text-center">
        {/* Badge Icon (Circular) */}
        <div className={`
          w-20 h-20 rounded-full flex items-center justify-center mb-4 border-4
          ${earned ? activeColor + ' border-white/10 shadow-inner' : 'bg-[var(--color-surface-raised)] border-[var(--color-border)] text-[var(--color-text-secondary)]'}
          transition-transform duration-500 group-hover:scale-110
        `}>
          {earned ? (
            <Icon size={36} strokeWidth={2.5} />
          ) : (
            <Lock size={32} strokeWidth={1.5} />
          )}
        </div>

        {/* Content */}
        <h3 className={`text-lg font-bold mb-1 ${earned ? 'text-[var(--color-foreground)]' : 'text-[var(--color-text-secondary)]'}`}>
          {title}
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] mb-6 leading-relaxed max-w-[200px]">
          {description}
        </p>

        {/* Progress */}
        <div className="w-full space-y-2">
          {!earned ? (
            <>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                <span>Progress</span>
                <span>{currentValue} / {targetValue}</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--color-surface-raised)] rounded-full border border-[var(--color-border)]/50 overflow-hidden">
                <div 
                  className="h-full bg-[var(--color-foreground-muted)] rounded-full transition-all duration-1000"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-success)] flex items-center gap-1">
                <CheckCircle2 size={12} /> Unlocked
              </span>
              {earnedAt && (
                <span className="text-[9px] text-[var(--color-text-secondary)]">
                  {new Date(earnedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Earned Glow Effect */}
      {earned && (
        <div className={`absolute -inset-px rounded-3xl opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none ${progressBarColor}`} />
      )}
    </div>
  );
};

export default AchievementCard;
