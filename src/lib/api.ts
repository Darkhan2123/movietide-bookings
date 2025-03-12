
import axios from 'axios';

// Base URL for your Django API
const API_BASE_URL = 'http://localhost:8000/api';  // Change this to your Django API URL

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Or use 'Token' if using Django's TokenAuthentication
  }
  return config;
});

export default api;
