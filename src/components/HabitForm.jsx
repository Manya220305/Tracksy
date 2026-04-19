import React, { useState } from 'react';
import { Plus, X, Edit2, Trash2, CalendarDays, BarChart, Tag, Clock } from 'lucide-react';

const HabitForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      category: 'Health',
      difficulty: 'Medium',
      frequency: 'Daily',
      scheduledTime: '',
    }
  );

  const categories = ['Health', 'Learning', 'Mindfulness', 'Productivity', 'Finance', 'Other'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const frequencies = ['Daily', 'Weekly', 'Weekdays', 'Weekends'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-2xl w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[var(--color-foreground)]">
          {initialData ? 'Edit Habit' : 'Create New Habit'}
        </h3>
        <button onClick={onCancel} className="text-[var(--color-text-secondary)] hover:text-[var(--color-foreground)] transition-colors bg-[var(--color-surface-raised)] border border-[var(--color-border)] p-2 rounded-full">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-1.5">Habit Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Morning Jog"
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all placeholder:text-[var(--color-text-secondary)]/50"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-1.5 flex items-center gap-1.5">
            <Tag size={16} /> Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat })}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  formData.category === cat
                    ? 'bg-[var(--color-primary)] text-white shadow-md shadow-primary/20'
                    : 'bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-foreground)] hover:border-[var(--color-text-secondary)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-1.5 flex items-center gap-1.5">
            <BarChart size={16} /> Difficulty
          </label>
          <div className="flex gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setFormData({ ...formData, difficulty: diff })}
                className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                  formData.difficulty === diff
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
                    : 'border-transparent bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] hover:text-[var(--color-foreground)] border-[var(--color-border)]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-1.5 flex items-center gap-1.5">
            <CalendarDays size={16} /> Frequency
          </label>
          <select
            value={formData.frequency}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all appearance-none font-medium"
          >
            {frequencies.map((freq) => (
              <option key={freq} value={freq} className="bg-[var(--color-surface)] text-[var(--color-foreground)]">{freq}</option>
            ))}
          </select>
        </div>
        
        {/* Scheduled Time */}
        <div>
          <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-1.5 flex items-center gap-1.5">
            <Clock size={16} /> Scheduled Time
          </label>
          <input
            type="time"
            value={formData.scheduledTime || ''}
            onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all appearance-none font-medium"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl font-bold text-[var(--color-text-secondary)] bg-[var(--color-surface-raised)] border border-[var(--color-border)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)] transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all active:scale-[0.98]"
          >
            {initialData ? 'Save Changes' : 'Create Habit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HabitForm;
