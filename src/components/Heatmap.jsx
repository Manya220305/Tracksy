import React, { useState, useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import habitService from '../services/habitService';
import { useHabits } from '../context/HabitContext';
import { Loader2 } from 'lucide-react';

const Heatmap = () => {
  const { habits } = useHabits();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeatmapData = async () => {
      if (habits.length === 0) {
        setLoading(false);
        return;
      }
      
      try {
        const allLogs = await Promise.all(habits.map(h => habitService.getLogs(h.id)));
        const flatLogs = allLogs.flat();
        
        // Count completions per date
        const counts = flatLogs.reduce((acc, log) => {
          if (log && log.completed && log.date) {
            acc[log.date] = (acc[log.date] || 0) + 1;
          }
          return acc;
        }, {});

        const heatmapValues = Object.entries(counts).map(([date, count]) => ({
          date,
          count
        }));

        setData(heatmapValues);
      } catch (err) {
        console.error('Heatmap fetch failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmapData();
  }, [habits]);

  const today = new Date();
  const shiftDate = (date, numDays) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
  };

  const startDate = shiftDate(today, -150);

  if (loading) return <div className="h-32 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="heatmap-container overflow-hidden">
      <CalendarHeatmap
        startDate={startDate}
        endDate={today}
        values={data}
        classForValue={(value) => {
          if (!value) return 'color-empty';
          return `color-scale-${Math.min(value.count, 4)}`;
        }}
        tooltipDataAttrs={value => {
          if (!value || !value.date) return null;
          return { 'data-tip': `${value.date}: ${value.count} habits` };
        }}
      />
      
      <style>{`
        .react-calendar-heatmap .color-empty { fill: #f1f5f9; }
        .dark .react-calendar-heatmap .color-empty { fill: #1e293b; }
        
        .react-calendar-heatmap .color-scale-1 { fill: #c7d2fe; }
        .react-calendar-heatmap .color-scale-2 { fill: #818cf8; }
        .react-calendar-heatmap .color-scale-3 { fill: #4f46e5; }
        .react-calendar-heatmap .color-scale-4 { fill: #3730a3; }
        
        .react-calendar-heatmap rect {
          rx: 2;
          ry: 2;
          width: 10px;
          height: 10px;
        }
      `}</style>
    </div>
  );
};

export default Heatmap;
