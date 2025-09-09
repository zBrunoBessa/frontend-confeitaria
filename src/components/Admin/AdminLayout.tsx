import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Package,
  BarChart3,
  LogOut,
  User,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goToMainSite = () => {
    navigate("/");
  };

  const isActiveRoute = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>🧁 Admin Panel</h2>
          <p className="user-info">
            <User size={16} />
            {user?.nome || user?.username}
          </p>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/admin"
            className={`nav-item ${
              isActiveRoute("/admin") && location.pathname === "/admin"
                ? "active"
                : ""
            }`}
          >
            <Home size={18} />
            Dashboard
          </Link>

          <Link
            to="/admin/products"
            className={`nav-item ${
              isActiveRoute("/admin/products") ? "active" : ""
            }`}
          >
            <Package size={18} />
            Produtos
          </Link>

          <Link
            to="/admin/reports"
            className={`nav-item ${
              isActiveRoute("/admin/reports") ? "active" : ""
            }`}
          >
            <BarChart3 size={18} />
            Relatórios
          </Link>

          <Link
            to="/admin/settings"
            className={`nav-item ${
              isActiveRoute("/admin/settings") ? "active" : ""
            }`}
          >
            <Settings size={18} />
            Configurações
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button onClick={goToMainSite} className="footer-button">
            <ArrowLeft size={16} />
            Voltar ao Site
          </button>

          <button onClick={handleLogout} className="footer-button logout">
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
