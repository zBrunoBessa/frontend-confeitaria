import React from "react";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import WebsiteLogo from "../../assets/WebsiteLogo.png";
interface HeaderProps {
  onCartClick: () => void;
  onSearchClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, onSearchClick }) => {
  const { getItemCount } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const itemCount = getItemCount();

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      logout();
      // Redirecionar para a página inicial após logout
      window.location.href = "/";
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-left">
            <img
              src={WebsiteLogo}
              className="logo-image"
              alt="Confeitaria Beeem Doce"
            />
          </div>

          <h1
            className="logo-centered"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Confeitaria Beeem Doce
          </h1>

          <div className="header-actions">
            <button
              className="cart-button"
              onClick={onCartClick}
              title="Ver carrinho"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="action-button admin-link"
                    title={`Admin Panel - ${
                      user?.firstName
                        ? `${user.firstName} ${user.lastName}`
                        : user?.username
                    }`}
                  >
                    <User size={20} />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="action-button logout-button"
                  title={`Logout - ${
                    user?.firstName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.username
                  }`}
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="action-button login-link"
                title="Login Administrativo"
              >
                <User size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
