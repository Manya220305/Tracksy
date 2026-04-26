import api from './api';

const chatService = {
  sendMessage: async (receiverId, content) => {
    const response = await api.post('/chat/send', { receiverId, content });
    return response.data;
  },

  getHistory: async (partnerId) => {
    const response = await api.get(`/chat/history/${partnerId}`);
    return response.data;
  }
};

export default chatService;
