import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthContextType, User, LoginRequest } from "../types";
import { authService } from "../services/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar se há token salvo na inicialização
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem("auth_token");
        const savedUser = localStorage.getItem("auth_user");

        if (savedToken && savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            // Validar token com o servidor
            try {
              const serverUser = await authService.getCurrentUser();

              // Atualizar com dados do servidor
              setUser(serverUser);
              setToken(savedToken);
              authService.setAuthToken(savedToken);

              // Atualizar localStorage com dados do servidor
              localStorage.setItem("auth_user", JSON.stringify(serverUser));
            } catch (error) {
              console.error("❌ Token inválido ou expirado:", error);
              // Limpar dados inválidos
              clearAuthData();
            }
          } catch (error) {
            console.error("❌ Erro ao fazer parse dos dados salvos:", error);
            clearAuthData();
          }
        }
      } catch (error) {
        console.error("❌ Erro na inicialização da autenticação:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);

      // O backend retorna os dados diretamente, não em um objeto 'user'
      const {
        token: authToken,
        id,
        username,
        email,
        firstName,
        lastName,
        role,
      } = response;

      // Criar objeto User com os dados recebidos
      const userData: User = {
        id,
        username,
        email,
        firstName,
        lastName,
        role,
      };

      // Salvar no localStorage
      localStorage.setItem("auth_token", authToken);
      localStorage.setItem("auth_user", JSON.stringify(userData));

      // Configurar token para compatibilidade
      authService.setAuthToken(authToken);

      // Atualizar estado
      setUser(userData);
      setToken(authToken);

      // Pequeno delay para garantir que o estado seja atualizado
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error: any) {
      console.error("❌ Erro no login:", error);
      // Re-throw para que o componente possa tratar o erro
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearAuthData = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    authService.setAuthToken(null);
  };

  const logout = (): void => {
    clearAuthData();
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === "ADMIN",
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
