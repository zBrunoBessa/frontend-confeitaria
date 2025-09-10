import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Login: React.FC = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirecionar se já estiver logado
  if (isAuthenticated && !loading) {
    const from = (location.state as any)?.from?.pathname || "/admin";
    return <Navigate to={from} replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpar erro quando usuário começar a digitar
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(formData);

      // Redirecionamento após login bem-sucedido
      const targetPath = (location.state as any)?.from?.pathname || "/admin";
      navigate(targetPath, { replace: true });
    } catch (err: any) {
      console.error("Erro no login:", err);

      // Tratar diferentes tipos de erro
      if (err.response?.status === 401) {
        setError("Credenciais inválidas. Verifique seu usuário/email e senha.");
      } else if (err.response?.status === 403) {
        setError("Acesso negado. Apenas administradores podem acessar.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="login-loading">
        <div className="loading-spinner"></div>
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>🧁 Confeitaria Doce Sabor</h1>
          <h2>Painel Administrativo</h2>
          <p>Faça login para gerenciar os produtos</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-alert">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="usernameOrEmail">
              <User size={18} />
              Usuário ou Email
            </label>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              placeholder="Digite seu usuário ou email"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <Lock size={18} />
              Senha
            </label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Digite sua senha"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={
              isSubmitting || !formData.usernameOrEmail || !formData.password
            }
          >
            {isSubmitting ? (
              <>
                <div className="button-spinner"></div>
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="demo-credentials">
            <h4>🔑 Credenciais de Demonstração</h4>
            <div className="credential-item">
              <strong>Administrador:</strong>
              <span>
                Usuário: <code>admin</code> | Senha: <code>admin123</code>
              </span>
            </div>
            <button
              type="button"
              className="demo-fill-btn"
              onClick={() =>
                setFormData({ usernameOrEmail: "admin", password: "admin123" })
              }
            >
              Preencher Automaticamente
            </button>
          </div>

          <p className="login-info">
            💡 <strong>Apenas administradores</strong> podem acessar este
            painel.
            <br />
            Os usuários comuns utilizam apenas o site principal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
