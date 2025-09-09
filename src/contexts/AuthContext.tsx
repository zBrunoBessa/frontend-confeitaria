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

        console.log("🔄 Inicializando autenticação...");
        console.log(
          "Token no localStorage:",
          savedToken ? "Presente" : "Ausente"
        );
        console.log(
          "User no localStorage:",
          savedUser ? "Presente" : "Ausente"
        );

        if (savedToken && savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            console.log("📝 Dados do usuário recuperados:", parsedUser);

            // Sempre restaurar os dados do localStorage
            authService.setAuthToken(savedToken);

            // Atualizar estado de forma síncrona
            setUser(parsedUser);
            setToken(savedToken);

            // Aguardar um tick para garantir que o estado foi atualizado
            await new Promise((resolve) => setTimeout(resolve, 50));

            console.log("✅ Autenticação restaurada do localStorage");
            console.log("👤 Usuário carregado:", parsedUser);
            console.log("🔑 Token configurado:", !!savedToken);
            console.log(
              "📊 Estado após restauração - User:",
              parsedUser?.nome,
              "Token:",
              !!savedToken
            );
          } catch (error) {
            console.error("❌ Erro ao fazer parse dos dados salvos:", error);
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
          }
        } else {
          console.log("🚫 Nenhum token encontrado no localStorage");
        }
      } catch (error) {
        console.error("❌ Erro na inicialização da autenticação:", error);
      } finally {
        setLoading(false);
        console.log("✅ Inicialização da autenticação concluída");
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);

      const { user: userData, token: authToken } = response;

      // Salvar no localStorage primeiro (o interceptor vai pegar automaticamente)
      localStorage.setItem("auth_token", authToken);
      localStorage.setItem("auth_user", JSON.stringify(userData));

      // Configurar token para compatibilidade
      authService.setAuthToken(authToken);

      // Atualizar estado
      setUser(userData);
      setToken(authToken);

      console.log("Token salvo:", authToken);
      console.log("Usuário logado:", userData);

      // Pequeno delay para garantir que o estado seja atualizado
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error: any) {
      // Re-throw para que o componente possa tratar o erro
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);

    // Remover do localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");

    // Remover token das requisições
    authService.setAuthToken(null);
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
