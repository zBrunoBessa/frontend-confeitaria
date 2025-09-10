import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  CheckCircle,
  XCircle,
  DollarSign,
  Plus,
  Search,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { adminService } from "../../services/adminApi";
import { DashboardStats } from "../../types";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getDashboard();
      setStats(data);
    } catch (err: any) {
      console.error("Erro ao carregar estatísticas:", err);

      let errorMessage = "Erro ao carregar estatísticas do dashboard.";
      if (err.response?.status === 401) {
        errorMessage = "Sessão expirada. Faça login novamente.";
      } else if (err.response?.status === 403) {
        errorMessage = "Acesso negado. Apenas administradores podem acessar.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = `Erro de conexão: ${err.message}`;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-content">
          <h3>Erro no Dashboard</h3>
          <p>{error}</p>
          <button onClick={loadStats} className="retry-button">
            <RefreshCw size={16} />
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Dashboard Administrativo</h1>
        <p>Visão geral do sistema de doces</p>
      </div>

      {/* Estatísticas Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">
              <Package size={32} />
            </div>
            <div className="stat-content">
              <h3>Total de Doces</h3>
              <span className="stat-number">{stats.totalDoces}</span>
              <p>Produtos cadastrados</p>
            </div>
          </div>

          <div className="stat-card available">
            <div className="stat-icon">
              <CheckCircle size={32} />
            </div>
            <div className="stat-content">
              <h3>Disponíveis</h3>
              <span className="stat-number">{stats.docesDisponiveis}</span>
              <p>{stats.percentualDisponiveis.toFixed(1)}% do total</p>
            </div>
          </div>

          <div className="stat-card unavailable">
            <div className="stat-icon">
              <XCircle size={32} />
            </div>
            <div className="stat-content">
              <h3>Indisponíveis</h3>
              <span className="stat-number">{stats.docesIndisponiveis}</span>
              <p>{(100 - stats.percentualDisponiveis).toFixed(1)}% do total</p>
            </div>
          </div>

          {stats.precoMedio && (
            <div className="stat-card price">
              <div className="stat-icon">
                <DollarSign size={32} />
              </div>
              <div className="stat-content">
                <h3>Preço Médio</h3>
                <span className="stat-number">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(stats.precoMedio)}
                </span>
                <p>
                  {stats.precoMinimo && stats.precoMaximo && (
                    <>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(stats.precoMinimo)}{" "}
                      -{" "}
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(stats.precoMaximo)}
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ações Rápidas */}
      <div className="quick-actions">
        <h2>🚀 Ações Rápidas</h2>
        <div className="actions-grid">
          <Link to="/admin/products/new" className="action-card">
            <Plus size={24} />
            <h3>Adicionar Doce</h3>
            <p>Cadastrar novo produto</p>
          </Link>

          <Link to="/admin/products" className="action-card">
            <Search size={24} />
            <h3>Gerenciar Produtos</h3>
            <p>Ver e editar doces</p>
          </Link>

          <Link to="/admin/reports" className="action-card">
            <BarChart3 size={24} />
            <h3>Relatórios</h3>
            <p>Estatísticas detalhadas</p>
          </Link>

          <button onClick={loadStats} className="action-card refresh">
            <RefreshCw size={24} />
            <h3>Atualizar Dados</h3>
            <p>Recarregar estatísticas</p>
          </button>
        </div>
      </div>

      {/* Indicadores Visuais */}
      {stats && (
        <div className="dashboard-indicators">
          <h2>📈 Indicadores</h2>

          <div className="indicator-card">
            <h3>Disponibilidade dos Produtos</h3>
            <div className="progress-bar">
              <div
                className="progress-fill available"
                style={{ width: `${stats.percentualDisponiveis}%` }}
              ></div>
            </div>
            <div className="progress-labels">
              <span className="available">
                {stats.docesDisponiveis} Disponíveis (
                {stats.percentualDisponiveis.toFixed(1)}%)
              </span>
              <span className="unavailable">
                {stats.docesIndisponiveis} Indisponíveis (
                {(100 - stats.percentualDisponiveis).toFixed(1)}%)
              </span>
            </div>
          </div>

          {stats.totalDoces === 0 && (
            <div className="empty-state">
              <Package size={64} />
              <h3>Nenhum produto cadastrado</h3>
              <p>Comece adicionando seu primeiro doce ao sistema!</p>
              <Link to="/admin/products/new" className="cta-button">
                <Plus size={16} />
                Adicionar Primeiro Doce
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
