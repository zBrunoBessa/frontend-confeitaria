import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  RefreshCw,
  Package,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { adminService } from "../../services/adminApi";
import { AdminDoceResponse } from "../../types";

const Products: React.FC = () => {
  const [products, setProducts] = useState<AdminDoceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "available" | "unavailable"
  >("all");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (filterStatus !== "all")
        params.disponivel = filterStatus === "available";

      const response = await adminService.getAllDoces(params);
      setProducts(response.doces);
    } catch (err: any) {
      console.error("Erro ao carregar produtos:", err);
      setError("Erro ao carregar produtos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [searchTerm, filterStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleAvailability = async (id: number) => {
    try {
      await adminService.toggleAvailability(id);
      await loadProducts(); // Recarregar lista
    } catch (err) {
      console.error("Erro ao alterar disponibilidade:", err);
      alert("Erro ao alterar disponibilidade do produto.");
    }
  };

  const handleDeleteProduct = async (id: number, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${nome}"?`)) {
      return;
    }

    try {
      await adminService.deleteDoce(id);
      await loadProducts(); // Recarregar lista
    } catch (err) {
      console.error("Erro ao deletar produto:", err);
      alert("Erro ao deletar produto.");
    }
  };

  const handleSelectProduct = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p.id));
    }
  };

  const handleBatchAvailability = async (disponivel: boolean) => {
    if (selectedProducts.length === 0) return;

    try {
      await adminService.batchUpdateAvailability(selectedProducts, disponivel);
      setSelectedProducts([]);
      await loadProducts();
    } catch (err) {
      console.error("Erro na operação em lote:", err);
      alert("Erro ao atualizar produtos em lote.");
    }
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
        <p>Carregando produtos...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>📦 Gerenciar Produtos</h1>
        <Link to="/admin/products/new" className="add-button">
          <Plus size={16} />
          Adicionar Produto
        </Link>
      </div>

      {/* Filtros e Busca */}
      <div className="products-controls">
        <div className="search-group">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <Filter size={18} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">Todos</option>
            <option value="available">Disponíveis</option>
            <option value="unavailable">Indisponíveis</option>
          </select>
        </div>

        <button onClick={loadProducts} className="refresh-button">
          <RefreshCw size={16} />
          Atualizar
        </button>
      </div>

      {/* Ações em Lote */}
      {selectedProducts.length > 0 && (
        <div className="batch-actions">
          <span>{selectedProducts.length} produto(s) selecionado(s)</span>
          <button
            onClick={() => handleBatchAvailability(true)}
            className="batch-btn available"
          >
            <CheckCircle size={16} />
            Tornar Disponível
          </button>
          <button
            onClick={() => handleBatchAvailability(false)}
            className="batch-btn unavailable"
          >
            <XCircle size={16} />
            Tornar Indisponível
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadProducts} className="retry-button">
            Tentar Novamente
          </button>
        </div>
      )}

      {/* Lista de Produtos */}
      {products.length === 0 ? (
        <div className="empty-products">
          <Package size={64} />
          <h3>Nenhum produto encontrado</h3>
          <p>
            {searchTerm || filterStatus !== "all"
              ? "Tente ajustar os filtros de busca."
              : "Comece adicionando seu primeiro produto."}
          </p>
          <Link to="/admin/products/new" className="cta-button">
            <Plus size={16} />
            Adicionar Produto
          </Link>
        </div>
      ) : (
        <div className="products-table">
          <div className="table-header">
            <div className="header-cell checkbox">
              <input
                type="checkbox"
                checked={selectedProducts.length === products.length}
                onChange={handleSelectAll}
              />
            </div>
            <div className="header-cell">Produto</div>
            <div className="header-cell">Preço</div>
            <div className="header-cell">Status</div>
            <div className="header-cell">Atualizado</div>
            <div className="header-cell">Ações</div>
          </div>

          {products.map((product) => (
            <div key={product.id} className="table-row">
              <div className="table-cell checkbox">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => handleSelectProduct(product.id)}
                />
              </div>

              <div className="table-cell product-info">
                <div className="product-image">
                  {product.imagem ? (
                    <img src={product.imagem} alt={product.nome} />
                  ) : (
                    <div className="placeholder">🧁</div>
                  )}
                </div>
                <div className="product-details">
                  <h4>{product.nome}</h4>
                  {product.descricao && (
                    <p className="description">{product.descricao}</p>
                  )}
                </div>
              </div>

              <div className="table-cell price">{product.valorFormatado}</div>

              <div className="table-cell status">
                <span
                  className={`status-badge ${
                    product.disponivel ? "available" : "unavailable"
                  }`}
                >
                  {product.disponivel ? (
                    <>
                      <CheckCircle size={14} />
                      Disponível
                    </>
                  ) : (
                    <>
                      <XCircle size={14} />
                      Indisponível
                    </>
                  )}
                </span>
              </div>

              <div className="table-cell updated">
                {new Date(product.atualizadoEm).toLocaleDateString("pt-BR")}
              </div>

              <div className="table-cell actions">
                <button
                  onClick={() => handleToggleAvailability(product.id)}
                  className={`action-btn ${
                    product.disponivel ? "hide" : "show"
                  }`}
                  title={
                    product.disponivel
                      ? "Tornar indisponível"
                      : "Tornar disponível"
                  }
                >
                  {product.disponivel ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>

                <Link
                  to={`/admin/products/${product.id}/edit`}
                  className="action-btn edit"
                  title="Editar produto"
                >
                  <Edit size={16} />
                </Link>

                <button
                  onClick={() => handleDeleteProduct(product.id, product.nome)}
                  className="action-btn delete"
                  title="Excluir produto"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
