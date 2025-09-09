import React from "react";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "../../hooks/useCart";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    generateWhatsAppMessage,
  } = useCart();

  if (!isOpen) return null;

  const handleWhatsAppOrder = () => {
    if (cart.items.length === 0) return;

    const whatsappUrl = generateWhatsAppMessage();
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content cart-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>🛒 Seu Carrinho</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {cart.items.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={64} className="empty-cart-icon" />
              <h3>Seu carrinho está vazio</h3>
              <p>Adicione alguns doces deliciosos ao seu carrinho!</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.items.map((item) => (
                  <div key={item.doce.id} className="cart-item">
                    <div className="cart-item-image">
                      {item.doce.imagem ? (
                        <img src={item.doce.imagem} alt={item.doce.nome} />
                      ) : (
                        <div className="item-placeholder">🧁</div>
                      )}
                    </div>

                    <div className="cart-item-info">
                      <h4>{item.doce.nome}</h4>
                      <p className="item-price">{item.doce.valorFormatado}</p>
                    </div>

                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            updateQuantity(item.doce.id, item.quantidade - 1)
                          }
                          className="quantity-btn"
                          disabled={item.quantidade <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="quantity">{item.quantidade}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.doce.id, item.quantidade + 1)
                          }
                          className="quantity-btn"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="item-total">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item.doce.valor * item.quantidade)}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.doce.id)}
                        className="remove-btn"
                        title="Remover item"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <strong>Total: {cart.totalFormatado}</strong>
                </div>

                <div className="cart-actions">
                  <button onClick={clearCart} className="clear-cart-btn">
                    Limpar Carrinho
                  </button>

                  <button
                    onClick={handleWhatsAppOrder}
                    className="whatsapp-btn"
                  >
                    🟢 Finalizar pelo WhatsApp
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
