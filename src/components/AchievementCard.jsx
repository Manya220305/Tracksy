import React from 'react';
import { Award, Flame, Target, Star, Calendar, Zap, Heart, CheckCircle2 } from 'lucide-react';

const AchievementCard = ({ title, description, icon: Icon, color, progress, target, dateEarned, isLocked }) => {
  const percentage = Math.min(100, Math.round((progress / target) * 100));
  
  // Custom color mapping for the badges
  const colorMap = {
    orange: 'bg-orange-100 text-orange-500 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
    blue: 'bg-blue-100 text-blue-500 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    purple: 'bg-purple-100 text-purple-500 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
    pink: 'bg-pink-100 text-pink-500 border-pink-200 dark:bg-pink-500/10 dark:text-pink-400 dark:border-pink-500/20',
    green: 'bg-green-100 text-green-500 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
    yellow: 'bg-yellow-100 text-yellow-500 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20',
    indigo: 'bg-indigo-100 text-indigo-500 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
    locked: 'bg-gray-100 text-gray-400 border-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700',
  };

  const badgeClass = colorMap[isLocked ? 'locked' : color] || colorMap.blue;

  return (
    <div className={`relative bg-white dark:bg-[#1e293b] rounded-2xl border p-6 transition-all duration-300 ${
      isLocked 
        ? 'border-gray-200 dark:border-gray-700 opacity-60 grayscale-[0.8]' 
        : 'border-transparent shadow-md hover:shadow-lg hover:-translate-y-1'
    }`}>
      
      {/* Background Glow (only for unlocked) */}
      {!isLocked && (
        <div className={`absolute -inset-0.5 rounded-2xl opacity-20 blur-sm transition duration-1000 group-hover:duration-200 ${badgeClass.split(' ')[0]}`}></div>
      )}

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-sm ${badgeClass}`}>
            <Icon size={28} strokeWidth={isLocked ? 1.5 : 2} />
          </div>
          {dateEarned && !isLocked && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-green-500 bg-green-50 dark:bg-green-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 size={12} /> Unlocked
            </span>
          )}
        </div>

        <h4 className={`text-lg font-bold mb-1 ${isLocked ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
          {title}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 h-10 line-clamp-2">
          {description}
        </p>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className={isLocked ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'}>Progress</span>
            <span className={isLocked ? 'text-gray-400' : 'text-primary'}>{progress} / {target}</span>
          </div>
          <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                isLocked ? 'bg-gray-300 dark:bg-gray-600' : 'bg-primary'
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          {dateEarned && !isLocked && (
            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              Earned on {dateEarned}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;
