import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../contexts/CartContext";

interface FixedCartButtonProps {
  onCartClick: () => void;
}

const FixedCartButton: React.FC<FixedCartButtonProps> = ({ onCartClick }) => {
  const { cart, getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <button
      onClick={onCartClick}
      className="fixed-cart-button"
      style={{
        position: "fixed",
        bottom: "0",
        left: "0",
        right: "0",
        width: "100%",
        background: "linear-gradient(135deg, #ff6b6b, #e55a5a)",
        color: "white",
        border: "none",
        padding: "15px 20px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.15)",
        zIndex: 1000,
        transition: "all 0.3s ease",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background =
          "linear-gradient(135deg, #e55a5a, #d32f2f)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background =
          "linear-gradient(135deg, #ff6b6b, #e55a5a)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <ShoppingCart size={20} />
      <span>
        {itemCount > 0 ? (
          <>
            Carrinho ({itemCount} {itemCount === 1 ? "item" : "itens"}) -{" "}
            {cart.totalFormatado}
          </>
        ) : (
          "Ver Carrinho"
        )}
      </span>
    </button>
  );
};

export default FixedCartButton;
