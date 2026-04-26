import axios from 'axios';

// Determine API URL based on environment
const getAPIUrl = () => {
  if (process.env.VITE_API_URL) {
    return process.env.VITE_API_URL;
  }
  
  // In production, use the same host as the frontend
  if (window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:5001/api`;
  }
  
  // Development: use localhost
  return 'http://localhost:5000/api';
};

const API_URL = getAPIUrl();

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
