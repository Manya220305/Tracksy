import React, { useEffect, useState } from 'react';
import { X, TrendingUp, Award, Calendar, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import analyticsService from '../services/analyticsService';

const WeeklyReportModal = ({ isOpen, onClose }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchReport = async () => {
        try {
          setLoading(true);
          const data = await analyticsService.getWeeklyReport();
          setReport(data);
        } catch (error) {
          console.error("Failed to load weekly report:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchReport();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDayName = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        {/* Header/Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 sm:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-10 -translate-y-10">
            <Sparkles size={160} />
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <X size={20} />
          </button>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <Calendar size={24} className="text-white" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-indigo-100">Weekly Achievement</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-2 leading-tight">Your Weekly Digest</h2>
            {report && (
              <p className="text-indigo-100 font-medium">
                {formatDate(report.startDate)} — {formatDate(report.endDate)}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-10 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-primary" size={40} />
              <p className="text-[var(--color-text-secondary)] font-bold animate-pulse uppercase tracking-wider">Generating your statistics...</p>
            </div>
          ) : report ? (
            <div className="space-y-10">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--color-surface-raised)] p-6 rounded-3xl border border-[var(--color-border)] transform transition-transform hover:scale-[1.02]">
                  <div className="w-10 h-10 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
                    <Award size={22} />
                  </div>
                  <p className="text-[10px] sm:text-xs font-black text-[var(--color-text-secondary)] uppercase tracking-widest mb-1">Consistency</p>
                  <p className="text-2xl sm:text-3xl font-black text-[var(--color-foreground)]">{report.averageCompletionRate}%</p>
                </div>
                <div className="bg-[var(--color-surface-raised)] p-6 rounded-3xl border border-[var(--color-border)] transform transition-transform hover:scale-[1.02]">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                    <TrendingUp size={22} />
                  </div>
                  <p className="text-[10px] sm:text-xs font-black text-[var(--color-text-secondary)] uppercase tracking-widest mb-1">Total habits</p>
                  <p className="text-2xl sm:text-3xl font-black text-[var(--color-foreground)]">{report.totalCompleted}</p>
                </div>
              </div>

              {/* Weekly Performance Bar Chart */}
              <div>
                <h3 className="text-sm font-black text-[var(--color-foreground)] uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary rounded-full" />
                  Daily Performance
                </h3>
                <div className="flex items-end justify-between h-48 gap-2 px-2">
                  {Object.entries(report.dailyBreakdown).map(([date, rate], idx) => (
                    <div key={date} className="flex-1 flex flex-col items-center group">
                      <div className="relative w-full h-full flex items-end justify-center">
                        <div 
                          className="w-full sm:w-8 rounded-t-xl bg-gradient-to-t from-primary to-primary-hover transition-all duration-1000 ease-out relative group-hover:brightness-110"
                          style={{ height: `${Math.max(rate, 5)}%`, animationDelay: `${idx * 100}ms` }}
                        >
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[var(--color-foreground)] text-[var(--color-background)] text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {Math.round(rate)}%
                          </div>
                        </div>
                      </div>
                      <span className="mt-3 text-[10px] font-black text-[var(--color-text-secondary)] uppercase">{getDayName(date)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights */}
              <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/30">
                  <Sparkles size={28} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[var(--color-foreground)] mb-1 uppercase tracking-tight">Top Performer</h4>
                  <p className="text-xs text-[var(--color-text-secondary)] font-medium leading-relaxed">
                    You were most consistent with <span className="text-primary font-bold">"{report.mostConsistentHabit}"</span> this week. Keep up that momentum!
                  </p>
                </div>
              </div>

              {/* Action */}
              <button 
                onClick={onClose}
                className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all active:scale-95 flex items-center justify-center gap-2 group"
              >
                Keep Shining
                <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-[var(--color-text-secondary)]">No data available for this week yet. Start logging your habits!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyReportModal;
