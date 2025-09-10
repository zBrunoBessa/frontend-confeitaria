import React, { useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductsSection from "../components/Products/ProductsSection";
import CartModal from "../components/Cart/CartModal";
import FixedCartButton from "../components/Cart/FixedCartButton";
import SearchModal from "../components/Search/SearchModal";

const HomePage: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  return (
    <div className="App">
      <Header onCartClick={handleCartClick} onSearchClick={handleSearchClick} />

      {/* Produtos Section */}
      <ProductsSection />

      {/* Sobre Section */}
      <section id="sobre" className="sobre">
        <div className="container">
          <h2>Sobre Nós</h2>
          <p>
            A Confeitaria Doce Sabor nasceu do sonho de levar alegria através de
            doces únicos e especiais. Com mais de 20 anos de experiência, nossa
            equipe se dedica a criar produtos artesanais com ingredientes
            selecionados e muito carinho.
          </p>
          <p>
            Nossos doces são feitos diariamente com receitas tradicionais,
            sempre priorizando a qualidade e o sabor que nossos clientes
            merecem. Cada produto é uma obra de arte comestível, criada com
            dedicação e paixão pela confeitaria artesanal.
          </p>
        </div>
      </section>

      {/* Contato Section */}
      <section id="contato" className="contato">
        <div className="container">
          <h2>Entre em Contato</h2>
          <div className="contato-info">
            <div className="contato-item">
              <h3>📍 Endereço</h3>
              <p>
                Rua das Delícias, 123
                <br />
                Centro, Cidade - Estado
              </p>
            </div>
            <div className="contato-item">
              <h3>📞 WhatsApp</h3>
              <p>(15) 99674-7692</p>
              <p style={{ fontSize: "0.9rem", color: "#666" }}>
                Faça seu pedido direto pelo WhatsApp!
              </p>
            </div>
            <div className="contato-item">
              <h3>📧 Email</h3>
              <p>contato@docesabor.com.br</p>
            </div>
            <div className="contato-item">
              <h3>🕒 Horário</h3>
              <p>
                Seg-Sáb: 8h às 18h
                <br />
                Dom: 8h às 14h
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Modais */}
      <CartModal isOpen={isCartOpen} onClose={closeCart} />
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />

      {/* Botão Fixo do Carrinho */}
      <FixedCartButton onCartClick={handleCartClick} />
    </div>
  );
};

export default HomePage;
