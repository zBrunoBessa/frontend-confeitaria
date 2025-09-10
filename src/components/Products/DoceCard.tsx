import React, { useState } from "react";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { Doce } from "../../types";
import { useCart } from "../../contexts/CartContext";

interface DoceCardProps {
  doce: Doce;
}

const DoceCard: React.FC<DoceCardProps> = ({ doce }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    if (!doce.disponivel) {
      return;
    }

    if (isAdding) {
      return;
    }

    setIsAdding(true);

    try {
      addToCart(doce, quantity);

      // Feedback visual
      setTimeout(() => {
        setIsAdding(false);
        setQuantity(1);
      }, 1000);
    } catch (error) {
      console.error("❌ Erro ao adicionar produto:", error);
      setIsAdding(false);
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="doce-card">
      <div className="doce-image">
        {doce.imagem ? (
          <img src={doce.imagem} alt={doce.nome} />
        ) : (
          <div className="image-placeholder">🧁</div>
        )}
        {!doce.disponivel && (
          <div className="unavailable-overlay">
            <span>Indisponível</span>
          </div>
        )}
      </div>

      <div className="doce-content">
        <h3 className="doce-name">{doce.nome}</h3>

        {doce.descricao && <p className="doce-description">{doce.descricao}</p>}

        <div className="doce-price">
          <span className="price">{doce.valorFormatado}</span>
          <span className="status">{doce.statusDisponibilidade}</span>
        </div>

        {doce.disponivel && (
          <div className="doce-actions">
            <div className="quantity-selector">
              <button
                onClick={decrementQuantity}
                className="quantity-btn"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="quantity-display">{quantity}</span>
              <button onClick={incrementQuantity} className="quantity-btn">
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`add-to-cart-btn ${isAdding ? "adding" : ""}`}
              disabled={isAdding}
              type="button"
            >
              <ShoppingCart size={16} />
              {isAdding ? "Adicionado!" : "Adicionar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoceCard;
