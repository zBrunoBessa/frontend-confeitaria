import axios from 'axios';
import { LoginRequest, LoginResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const authApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para adicionar token automaticamente
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  // Login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await authApi.post('/auth/login', credentials);
    return response.data;
  },

  // Validar token
  validateToken: async (token: string): Promise<boolean> => {
    try {
      const response = await authApi.get('/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },

  // Configurar token no cabeçalho (mantido para compatibilidade, mas agora usa interceptor)
  setAuthToken: (token: string | null) => {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  },
};

export default authApi;
