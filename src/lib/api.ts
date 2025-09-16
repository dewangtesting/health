import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};

// Patients API
export const patientsAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/patients', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },
  
  create: async (patientData: any) => {
    const response = await api.post('/patients', patientData);
    return response.data;
  },
  
  update: async (id: string, patientData: any) => {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },
};

// Doctors API
export const doctorsAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/doctors', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },
  
  create: async (doctorData: any) => {
    // Remove file fields from data before sending to API
    const { profilePicture, additionalDocs, ...cleanData } = doctorData;
    
    const response = await api.post('/doctors', cleanData);
    return response.data;
  },
  
  update: async (id: string, doctorData: any) => {
    const response = await api.put(`/doctors/${id}`, doctorData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/doctors/${id}`);
    return response.data;
  },
  
  getSchedules: async (id: string) => {
    const response = await api.get(`/doctors/${id}/schedules`);
    return response.data;
  },
  
  updateSchedules: async (id: string, schedules: any) => {
    const response = await api.put(`/doctors/${id}/schedules`, { schedules });
    return response.data;
  },
};

// Appointments API
export const appointmentsAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },
  
  create: async (appointmentData: any) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },
  
  update: async (id: string, appointmentData: any) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },
  
  cancel: async (id: string) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },
  
  getAvailableSlots: async (doctorId: string, date: string) => {
    const response = await api.get(`/appointments/doctor/${doctorId}/available-slots`, {
      params: { date }
    });
    return response.data;
  },
};

// Medicines API
export const medicinesAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/medicines', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/medicines/${id}`);
    return response.data;
  },
  
  create: async (medicineData: any) => {
    const response = await api.post('/medicines', medicineData);
    return response.data;
  },
  
  update: async (id: string, medicineData: any) => {
    const response = await api.put(`/medicines/${id}`, medicineData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/medicines/${id}`);
    return response.data;
  },
  
  updateStock: async (id: string, stock: number, operation: 'set' | 'add' | 'subtract' = 'set') => {
    const response = await api.patch(`/medicines/${id}/stock`, { stock, operation });
    return response.data;
  },
  
  getLowStock: async () => {
    const response = await api.get('/medicines/alerts/low-stock');
    return response.data;
  },
  
  getExpired: async () => {
    const response = await api.get('/medicines/alerts/expired');
    return response.data;
  },
  
  getExpiringSoon: async () => {
    const response = await api.get('/medicines/alerts/expiring-soon');
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
  
  getTodayAppointments: async () => {
    const response = await api.get('/dashboard/today-appointments');
    return response.data;
  },
  
  getUpcomingAppointments: async () => {
    const response = await api.get('/dashboard/upcoming-appointments');
    return response.data;
  },
  
  getRecentPatients: async () => {
    const response = await api.get('/dashboard/recent-patients');
    return response.data;
  },
  
  getMedicineAlerts: async () => {
    const response = await api.get('/dashboard/medicine-alerts');
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/users', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  update: async (id: string, userData: any) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  
  toggleStatus: async (id: string) => {
    const response = await api.patch(`/users/${id}/toggle-status`);
    return response.data;
  },
};

export default api;
