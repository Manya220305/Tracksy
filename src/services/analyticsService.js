import api from './api';

const analyticsService = {
  getWeeklyReport: async () => {
    try {
      const response = await api.get('/analytics/weekly-report');
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly report:', error);
      throw error;
    }
  },

  getInsights: async () => {
    try {
      const response = await api.get('/analytics/insights');
      return response.data;
    } catch (error) {
      console.error('Error fetching insights:', error);
      throw error;
    }
  },

  getProgress: async () => {
    try {
      const response = await api.get('/analytics/progress');
      return response.data;
    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  }
};

export default analyticsService;
