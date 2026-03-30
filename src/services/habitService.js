import api from './api';

const habitService = {
  getHabits: async () => {
    const response = await api.get('/habits');
    return response.data;
  },

  createHabit: async (habitData) => {
    const response = await api.post('/habits', habitData);
    return response.data;
  },

  updateHabit: async (id, habitData) => {
    const response = await api.put(`/habits/${id}`, habitData);
    return response.data;
  },

  deleteHabit: async (id) => {
    console.log('Calling DELETE /habits/' + id);
    await api.delete(`/habits/${id}`);
  },

  toggleHabit: async (id) => {
    const response = await api.post(`/habits/${id}/toggle`);
    return response.data;
  },

  getLogs: async (habitId, month, year) => {
    const params = {};
    if (month !== undefined) params.month = month;
    if (year !== undefined) params.year = year;
    const response = await api.get(`/habit-logs/${habitId}`, { params });
    return response.data;
  },

  logHabit: async (logData) => {
    const response = await api.post('/habit-logs', logData);
    return response.data;
  },
};

export default habitService;
