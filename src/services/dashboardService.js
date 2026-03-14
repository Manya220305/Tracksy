import api from './api';

const dashboardService = {
  getDashboardData: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },
  
  getAnalytics: async () => {
    const response = await api.get('/analytics/insights');
    return response.data;
  },

  getAchievements: async () => {
    const response = await api.get('/achievements');
    return response.data;
  },
};

export default dashboardService;
