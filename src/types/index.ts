export interface Doce {
  id: number;
  nome: string;
  valor: number;
  valorFormatado: string;
  descricao?: string;
  imagem?: string;
  disponivel: boolean;
  statusDisponibilidade: string;
}

export interface DoceResponse {
  doces: Doce[];
  total: number;
  disponibilidade: string;
}

export interface CartItem {
  doce: Doce;
  quantidade: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  totalFormatado: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface FilterOptions {
  search?: string;
  orderBy?: 'nome' | 'preco_asc' | 'preco_desc' | 'recentes';
  minPrice?: number;
  maxPrice?: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface AdminDoceResponse {
  id: number;
  nome: string;
  valor: number;
  valorFormatado: string;
  descricao?: string;
  imagem?: string;
  disponivel: boolean;
  statusDisponibilidade: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface AdminDoceListResponse {
  doces: AdminDoceResponse[];
  total: number;
}

export interface CreateDoceRequest {
  nome: string;
  valor: number;
  descricao?: string;
  imagem?: string;
  disponivel?: boolean;
}

export interface UpdateDoceRequest {
  nome?: string;
  valor?: number;
  descricao?: string;
  imagem?: string;
  disponivel?: boolean;
}

export interface DashboardStats {
  totalDoces: number;
  docesDisponiveis: number;
  docesIndisponiveis: number;
  percentualDisponiveis: number;
  precoMinimo?: number;
  precoMaximo?: number;
  precoMedio?: number;
}
