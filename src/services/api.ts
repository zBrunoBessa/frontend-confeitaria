import axios from 'axios';
import { Doce, DoceResponse, FilterOptions } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const docesApi = {
  // Listar todos os doces disponíveis
  getDoces: async (filters?: FilterOptions): Promise<DoceResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.orderBy) {
      params.append('orderBy', filters.orderBy);
    }
    if (filters?.minPrice !== undefined) {
      params.append('minPrice', filters.minPrice.toString());
    }
    if (filters?.maxPrice !== undefined) {
      params.append('maxPrice', filters.maxPrice.toString());
    }

    const response = await api.get(`/doces?${params.toString()}`);
    return response.data;
  },

  // Obter doce por ID
  getDoceById: async (id: number): Promise<Doce> => {
    const response = await api.get(`/doces/${id}`);
    return response.data;
  },

  // Buscar doces por nome
  searchDocesByNome: async (nome: string): Promise<DoceResponse> => {
    const response = await api.get(`/doces/search?nome=${encodeURIComponent(nome)}`);
    return response.data;
  },

  // Buscar doces por faixa de preço
  getDocesByPriceRange: async (min: number, max: number): Promise<DoceResponse> => {
    const response = await api.get(`/doces/price-range?min=${min}&max=${max}`);
    return response.data;
  },

  // Doces mais baratos
  getCheapestDoces: async (limit: number = 5): Promise<DoceResponse> => {
    const response = await api.get(`/doces/cheapest?limit=${limit}`);
    return response.data;
  },

  // Doces mais caros
  getExpensiveDoces: async (limit: number = 5): Promise<DoceResponse> => {
    const response = await api.get(`/doces/expensive?limit=${limit}`);
    return response.data;
  },

  // Doces recém-adicionados
  getRecentDoces: async (limit: number = 10): Promise<DoceResponse> => {
    const response = await api.get(`/doces/recent?limit=${limit}`);
    return response.data;
  },

  // Estatísticas
  getStats: async () => {
    const response = await api.get('/doces/stats');
    return response.data;
  },
};

export default api;
