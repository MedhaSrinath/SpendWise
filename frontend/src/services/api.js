import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Dashboard
  getDashboardSummary: async () => {
    const response = await apiClient.get('/dashboard/summary');
    return response.data;
  },

  // Expenses
  getExpenses: async (params = {}) => {
    const response = await apiClient.get('/expenses', { params });
    return response.data;
  },

  addExpense: async (expenseData) => {
    const response = await apiClient.post('/expenses', expenseData);
    return response.data;
  },

  deleteExpense: async (id) => {
    const response = await apiClient.delete(`/expenses/${id}`);
    return response.data;
  },

  // Income
  getIncomes: async (params = {}) => {
    const response = await apiClient.get('/income', { params });
    return response.data;
  },

  addIncome: async (incomeData) => {
    const response = await apiClient.post('/income', incomeData);
    return response.data;
  },

  deleteIncome: async (id) => {
    const response = await apiClient.delete(`/income/${id}`);
    return response.data;
  },
};

export default api;
