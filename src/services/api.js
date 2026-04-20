import axios from 'axios';

/**
 * SERVICE LAYER (API Configuration)
 * 
 * SYSTEM DESIGN NOTE:
 * This file centralizes all outgoing HTTP requests.
 * By using Axios interceptors, we cleanly enforce global behaviors:
 * 1. Automatic JWT token injection on every request.
 * 2. Global error handling (e.g., auto-logout on 401 Unauthorized)
 * 
 * This ensures components don't need to reinvent the wheel for basic API auth logic.
 */
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
