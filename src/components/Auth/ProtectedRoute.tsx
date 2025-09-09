import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="route-loading">
        <div className="loading-spinner"></div>
        <p>Verificando permissões...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Salvar a localização tentada para redirecionar após login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <h2>🚫 Acesso Negado</h2>
          <p>Você não tem permissão para acessar esta página.</p>
          <p>Apenas administradores podem acessar o painel administrativo.</p>
          <button onClick={() => window.history.back()} className="back-button">
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
