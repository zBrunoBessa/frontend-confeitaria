import React from "react";
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "../contexts/CartContext";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import Login from "../pages/Login";
import AdminLayout from "../components/Admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import ProductForm from "../pages/admin/ProductForm";
import HomePage from "../pages/HomePage";

const AppRoutes: React.FC = () => {
  return (
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
  );
};

export default AppRoutes;
