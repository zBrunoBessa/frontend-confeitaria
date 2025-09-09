import axios from 'axios';
import { 
  AdminDoceResponse, 
  AdminDoceListResponse, 
  CreateDoceRequest, 
  UpdateDoceRequest,
  DashboardStats 
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para adicionar token automaticamente
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('AdminAPI Request:', config.method?.toUpperCase(), config.url, 'Token:', token ? 'Presente' : 'Ausente');
  return config;
});

// Interceptor para lidar com respostas e erros de autenticação
adminApi.interceptors.response.use(
  (response) => {
    console.log('AdminAPI Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('AdminAPI Error:', error.response?.status, error.response?.data, error.config?.url);
    
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const adminService = {
  // Dashboard
  getDashboard: async (): Promise<DashboardStats> => {
    const response = await adminApi.get('/admin/doces/dashboard');
    return response.data;
  },

  // Listar todos os doces (disponíveis e indisponíveis)
  getAllDoces: async (params?: { 
    disponivel?: boolean; 
    search?: string 
  }): Promise<AdminDoceListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.disponivel !== undefined) {
      queryParams.append('disponivel', params.disponivel.toString());
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    
    const response = await adminApi.get(`/admin/doces?${queryParams.toString()}`);
    return response.data;
  },

  // Criar novo doce
  createDoce: async (doce: CreateDoceRequest): Promise<AdminDoceResponse> => {
    const response = await adminApi.post('/admin/doces', doce);
    return response.data;
  },

  // Atualizar doce existente
  updateDoce: async (id: number, doce: UpdateDoceRequest): Promise<AdminDoceResponse> => {
    const response = await adminApi.put(`/admin/doces/${id}`, doce);
    return response.data;
  },

  // Deletar doce
  deleteDoce: async (id: number): Promise<void> => {
    await adminApi.delete(`/admin/doces/${id}`);
  },

  // Alternar disponibilidade
  toggleAvailability: async (id: number): Promise<AdminDoceResponse> => {
    const response = await adminApi.put(`/admin/doces/${id}/toggle-availability`);
    return response.data;
  },

  // Definir disponibilidade específica
  setAvailability: async (id: number, disponivel: boolean): Promise<AdminDoceResponse> => {
    const response = await adminApi.put(`/admin/doces/${id}/availability?disponivel=${disponivel}`);
    return response.data;
  },

  // Listar apenas disponíveis
  getAvailableDoces: async (): Promise<AdminDoceListResponse> => {
    const response = await adminApi.get('/admin/doces/available');
    return response.data;
  },

  // Listar apenas indisponíveis
  getUnavailableDoces: async (): Promise<AdminDoceListResponse> => {
    const response = await adminApi.get('/admin/doces/unavailable');
    return response.data;
  },

  // Estatísticas detalhadas
  getDetailedStats: async (): Promise<DashboardStats> => {
    const response = await adminApi.get('/admin/doces/reports/statistics');
    return response.data;
  },

  // Alterar disponibilidade em lote
  batchUpdateAvailability: async (ids: number[], disponivel: boolean): Promise<void> => {
    await adminApi.put(`/admin/doces/batch/availability?disponivel=${disponivel}`, ids);
  },
};

export default adminApi;
