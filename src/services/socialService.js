import api from './api';

const socialService = {
  sendRequest: async (username) => {
    const response = await api.post(`/social/request/${username}`);
    return response.data;
  },

  getRequests: async () => {
    const response = await api.get('/social/requests');
    return response.data;
  },

  acceptRequest: async (requestId) => {
    const response = await api.post(`/social/accept/${requestId}`);
    return response.data;
  },

  getPartners: async () => {
    const response = await api.get('/social/partners');
    return response.data;
  }
};

export default socialService;
