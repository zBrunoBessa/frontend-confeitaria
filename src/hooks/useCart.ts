import { useState, useEffect } from 'react';
import { CartItem, Cart, Doce } from '../types';

const CART_STORAGE_KEY = 'confeitaria_cart';

export const useCart = () => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    totalFormatado: 'R$ 0,00'
  });

  // Carregar carrinho do localStorage na inicialização
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    }
  }, []);

  // Salvar carrinho no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + (item.doce.valor * item.quantidade), 0);
  };

  const addToCart = (doce: Doce, quantidade: number = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(item => item.doce.id === doce.id);
      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Item já existe, atualizar quantidade
        newItems = [...prevCart.items];
        newItems[existingItemIndex].quantidade += quantidade;
      } else {
        // Novo item
        newItems = [...prevCart.items, { doce, quantidade }];
      }

      const newTotal = calculateTotal(newItems);
      
      return {
        items: newItems,
        total: newTotal,
        totalFormatado: formatCurrency(newTotal)
      };
    });
  };

  const removeFromCart = (doceId: number) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.doce.id !== doceId);
      const newTotal = calculateTotal(newItems);
      
      return {
        items: newItems,
        total: newTotal,
        totalFormatado: formatCurrency(newTotal)
      };
    });
  };

  const updateQuantity = (doceId: number, quantidade: number) => {
    if (quantidade <= 0) {
      removeFromCart(doceId);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.doce.id === doceId ? { ...item, quantidade } : item
      );
      const newTotal = calculateTotal(newItems);
      
      return {
        items: newItems,
        total: newTotal,
        totalFormatado: formatCurrency(newTotal)
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      total: 0,
      totalFormatado: 'R$ 0,00'
    });
  };

  const getItemCount = (): number => {
    return cart.items.reduce((count, item) => count + item.quantidade, 0);
  };

  const generateWhatsAppMessage = (): string => {
    const whatsappNumber = '5515996747692';
    let message = '🧁 *Pedido da Confeitaria Doce Sabor*\n\n';
    
    cart.items.forEach((item, index) => {
      message += `${index + 1}. *${item.doce.nome}*\n`;
      message += `   Quantidade: ${item.quantidade}\n`;
      message += `   Valor unitário: ${item.doce.valorFormatado}\n`;
      message += `   Subtotal: ${formatCurrency(item.doce.valor * item.quantidade)}\n\n`;
    });
    
    message += `💰 *Total do Pedido: ${cart.totalFormatado}*\n\n`;
    message += `Gostaria de finalizar este pedido. Aguardo contato!`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
    generateWhatsAppMessage
  };
};

