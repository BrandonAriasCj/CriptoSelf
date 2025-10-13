import axios, { AxiosResponse } from 'axios';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  ChangePasswordRequest,
} from '../types/auth';
import {
  BacktestingResult,
  CustomBacktestingRequest,
  StrategyInfo,
  Task,
} from '../types/backtesting';

// Configuración base de Axios
const api = axios.create({
  baseURL: '/api', // Usa proxy de React
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Configuración OAuth2
const OAUTH_CONFIG = {
  client_id: process.env.REACT_APP_OAUTH_CLIENT_ID || 'your-client-id',
  client_secret: process.env.REACT_APP_OAUTH_CLIENT_SECRET || 'your-client-secret',
};

// Servicios de Autenticación
export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await api.post('/auth/token/', {
      username: email,
      password,
      ...OAUTH_CONFIG,
    });
    return response.data;
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response: AxiosResponse<RegisterResponse> = await api.post('/auth/register/', data);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response: AxiosResponse<User> = await api.get('/auth/profile/');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response: AxiosResponse<User> = await api.patch('/auth/profile/', data);
    return response.data;
  },

  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await api.post('/auth/change-password/', data);
    return response.data;
  },

  async logout(): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await api.post('/auth/logout/');
    return response.data;
  },

  async getUserInfo(): Promise<{ user: User; scopes: string[] }> {
    const response: AxiosResponse<{ user: User; scopes: string[] }> = await api.get('/auth/user-info/');
    return response.data;
  },
};

// Servicios de Backtesting
export const backtestingService = {
  async runDemo(): Promise<BacktestingResult> {
    const response: AxiosResponse<BacktestingResult> = await api.get('/backtesting/run-demo/');
    return response.data;
  },

  async runCustom(params: CustomBacktestingRequest): Promise<BacktestingResult> {
    const response: AxiosResponse<BacktestingResult> = await api.post('/backtesting/run-custom/', params);
    return response.data;
  },

  async getStrategyInfo(): Promise<StrategyInfo> {
    const response: AxiosResponse<StrategyInfo> = await api.get('/backtesting/strategy-info/');
    return response.data;
  },
};

// Servicios de Tareas
export const taskService = {
  async getTasks(): Promise<Task[]> {
    const response: AxiosResponse<{ results: Task[] }> = await api.get('/tasks/');
    return response.data.results || response.data;
  },

  async createTask(data: { title: string; description?: string }): Promise<Task> {
    const response: AxiosResponse<Task> = await api.post('/tasks/', data);
    return response.data;
  },

  async updateTask(id: number, data: Partial<Task>): Promise<Task> {
    const response: AxiosResponse<Task> = await api.patch(`/tasks/${id}/`, data);
    return response.data;
  },

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}/`);
  },

  async getTask(id: number): Promise<Task> {
    const response: AxiosResponse<Task> = await api.get(`/tasks/${id}/`);
    return response.data;
  },
};

// Servicio de salud de la API
export const healthService = {
  async checkHealth(): Promise<{ status: string; message: string }> {
    const response: AxiosResponse<{ status: string; message: string }> = await api.get('/health/');
    return response.data;
  },
};

export default api;