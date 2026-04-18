import React, { useState } from 'react';
import HabitForm from '../components/HabitForm';
import { Plus, Edit2, Trash2, Search, Filter, Loader2, Clock } from 'lucide-react';
import { useHabits } from '../context/HabitContext';

const Habits = () => {
  const { habits, addHabit, updateHabit, deleteHabit, loading } = useHabits();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateNew = () => {
    setEditingHabit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    console.log("Delete button clicked for habit id:", id);
    try {
      await deleteHabit(id);
      console.log("Delete completed for habit id:", id);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleSubmit = async (formData) => {
    if (editingHabit) {
      await updateHabit(editingHabit.id, formData);
    } else {
      await addHabit(formData);
    }
    setIsFormOpen(false);
  };

  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'Easy': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'Hard': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const filteredHabits = habits.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto relative transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-foreground)] tracking-tight">My Habits</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage and configure your tracking goals.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-primary/30 transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus size={20} /> Add New Habit
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search your habits..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm text-[var(--color-foreground)] placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden relative">
        {loading && habits.length === 0 && <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 flex items-center justify-center z-10"><Loader2 className="animate-spin text-primary" size={32} /></div>}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-500 dark:text-gray-400">
                <th className="p-4 pl-6">Habit Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Frequency</th>
                <th className="p-4 flex items-center gap-1.5"><Clock size={16} /> Time</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredHabits.map((habit) => (
                <tr key={habit.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                  <td className="p-4 pl-6 font-semibold text-[var(--color-foreground)]">
                    {habit.name}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
                      {habit.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md border text-xs font-bold ${getDifficultyColor(habit.difficulty)}`}>
                      {habit.difficulty}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                    {habit.frequency}
                  </td>
                  <td className="p-4 text-sm font-medium text-primary">
                    {habit.scheduledTime ? (
                      <span className="flex items-center gap-1.5">
                        {new Date(`2000-01-01T${habit.scheduledTime}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    ) : (
                      <span className="text-gray-400">---</span>
                    )}
                  </td>
                  <td className="p-4 pr-6">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(habit)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(habit.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredHabits.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500 space-y-3">
                    <div className="text-4xl mx-auto w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full mb-2 border border-gray-200 dark:border-gray-700">
                      📝
                    </div>
                    <p>No habits found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsFormOpen(false)}
          ></div>
          <div className="relative z-10 w-full max-w-md">
            <HabitForm 
              onSubmit={handleSubmit} 
              onCancel={() => setIsFormOpen(false)} 
              initialData={editingHabit} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Habits;
