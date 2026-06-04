import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data)
};

export const storesAPI = {
  getAll: () => apiClient.get('/stores'),
  getById: (id) => apiClient.get(`/stores/${id}`),
  create: (data) => apiClient.post('/stores', data),
  update: (id, data) => apiClient.put(`/stores/${id}`, data),
  delete: (id) => apiClient.delete(`/stores/${id}`)
};

export const productsAPI = {
  getAll: () => apiClient.get('/products'),
  getById: (id) => apiClient.get(`/products/${id}`),
  create: (data) => apiClient.post('/products', data),
  update: (id, data) => apiClient.put(`/products/${id}`, data),
  delete: (id) => apiClient.delete(`/products/${id}`)
};

export const inventoryAPI = {
  getByStore: (storeId) => apiClient.get(`/inventory/store/${storeId}`),
  getAvailable: (storeId) => apiClient.get(`/inventory/${storeId}/available`),
  add: (data) => apiClient.post('/inventory', data),
  update: (id, data) => apiClient.put(`/inventory/${id}`, data)
};

export const transfersAPI = {
  getAll: () => apiClient.get('/transfers'),
  getById: (id) => apiClient.get(`/transfers/${id}`),
  create: (data) => apiClient.post('/transfers', data),
  approve: (id) => apiClient.put(`/transfers/${id}/approve`),
  receive: (id) => apiClient.put(`/transfers/${id}/receive`),
  cancel: (id) => apiClient.put(`/transfers/${id}/cancel`)
};

export const invoicesAPI = {
  getAll: () => apiClient.get('/invoices'),
  getById: (id) => apiClient.get(`/invoices/${id}`),
  create: (data) => apiClient.post('/invoices', data),
  updatePayment: (id, data) => apiClient.put(`/invoices/${id}/payment`, data)
};

export const reportsAPI = {
  getStockReport: () => apiClient.get('/reports/stock/current'),
  getLowStock: () => apiClient.get('/reports/stock/low'),
  getTransfersSummary: () => apiClient.get('/reports/transfers/summary'),
  getInvoicesSummary: () => apiClient.get('/reports/invoices/summary'),
  getDateRangeSales: (startDate, endDate) => 
    apiClient.get(`/reports/invoices/date-range?startDate=${startDate}&endDate=${endDate}`)
};

export default apiClient;
