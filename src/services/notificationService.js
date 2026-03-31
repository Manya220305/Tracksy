import api from './api';

const notificationService = {
  getNotifications: async () => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  markAsRead: async () => {
    try {
      const response = await api.put('/notifications/mark-read');
      return response.data;
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw error;
    }
  }
};

export default notificationService;
