import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import ProductsSection from "./components/Products/ProductsSection";
import CartModal from "./components/Cart/CartModal";
import FixedCartButton from "./components/Cart/FixedCartButton";
import SearchModal from "./components/Search/SearchModal";
import Login from "./pages/Login";
import AdminLayout from "./components/Admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AuthDebug from "./components/Debug/AuthDebug";
import ApiTest from "./components/Debug/ApiTest";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthDebug />
        <ApiTest />
        <Routes>
          {/* Página de Login */}
          <Route path="/login" element={<Login />} />

          {/* Rotas Administrativas */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route
              path="reports"
              element={<div>Relatórios em desenvolvimento</div>}
            />
            <Route
              path="settings"
              element={<div>Configurações em desenvolvimento</div>}
            />
          </Route>

          {/* Página Principal (Site do Cliente) */}
          <Route
            path="/"
            element={
              <CartProvider>
                <HomePage />
              </CartProvider>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Componente da página principal
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

export default App;
