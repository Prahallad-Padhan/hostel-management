import api from './api';

export const authApi = {
  register: (username, password) => api.post('/auth/register', { username, password }),
  login: (username, password) => api.post('/auth/login', { username, password }),
};

export const studentApi = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

export const roomApi = {
  getAll: () => api.get('/rooms'),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
};

export const bookingApi = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  checkout: (id) => api.post(`/bookings/${id}/checkout`),
};

export const feeApi = {
  getAll: () => api.get('/fees'),
  getByBooking: (bookingId) => api.get(`/fees/booking/${bookingId}`),
  create: (data) => api.post('/fees', data),
  markAsPaid: (id) => api.put(`/fees/${id}/pay`),
  getPending: () => api.get('/fees/status/pending'),
};
