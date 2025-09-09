import React from "react";
import { ShoppingCart, Search, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../contexts/AuthContext";

interface HeaderProps {
  onCartClick: () => void;
  onSearchClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, onSearchClick }) => {
  const { getItemCount } = useCart();
  const { isAuthenticated, isAdmin, user } = useAuth();
  const itemCount = getItemCount();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1
            className="logo"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            🧁 Confeitaria Doce Sabor
          </h1>
          <nav className="nav">
            <a href="#home">Home</a>
            <a href="#produtos">Produtos</a>
            <a href="#sobre">Sobre</a>
            <a href="#contato">Contato</a>
          </nav>
          <div className="header-actions">
            <button
              className="action-button"
              onClick={onSearchClick}
              title="Buscar produtos"
            >
              <Search size={20} />
            </button>
            <button
              className="cart-button"
              onClick={onCartClick}
              title="Ver carrinho"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>

            {isAuthenticated && isAdmin ? (
              <Link
                to="/admin"
                className="action-button admin-link"
                title={`Admin Panel - ${user?.nome}`}
              >
                <User size={20} />
              </Link>
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
