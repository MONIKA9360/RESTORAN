import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('supabase.auth.token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Menu API
export const menuAPI = {
  getMenu: () => api.get('/menu'),
  getMenuByCategory: (categoryId) => api.get(`/menu/category/${categoryId}`),
  getMenuItem: (itemId) => api.get(`/menu/item/${itemId}`),
};

// Bookings API
export const bookingsAPI = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getBookings: (params = {}) => api.get('/bookings', { params }),
  getBooking: (id) => api.get(`/bookings/${id}`),
  updateBookingStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
};

// Tables API
export const tablesAPI = {
  getTables: (params = {}) => api.get('/tables', { params }),
  getAvailableTables: (params) => api.get('/tables/available', { params }),
  getTable: (id) => api.get(`/tables/${id}`),
  getTableBookings: (id, params = {}) => api.get(`/tables/${id}/bookings`, { params }),
};

// Contact API
export const contactAPI = {
  sendMessage: (messageData) => api.post('/contact', messageData),
  getMessages: (params = {}) => api.get('/contact', { params }),
  markAsRead: (id) => api.patch(`/contact/${id}/read`),
  deleteMessage: (id) => api.delete(`/contact/${id}`),
};

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  resetPassword: (email) => api.post('/auth/reset-password', { email }),
};

export default api;