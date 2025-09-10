import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { docesApi } from "../../services/api";
import { Doce, FilterOptions } from "../../types";
import DoceCard from "../Products/DoceCard";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState<FilterOptions["orderBy"]>("nome");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [results, setResults] = useState<Doce[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);

    try {
      const filters: FilterOptions = {
        orderBy,
        ...(searchTerm && { search: searchTerm }),
        ...(minPrice && { minPrice: parseFloat(minPrice) }),
        ...(maxPrice && { maxPrice: parseFloat(maxPrice) }),
      };

      const response = await docesApi.getDoces(filters);
      setResults(response.doces);
    } catch (error) {
      console.error("Erro ao buscar doces:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setOrderBy("nome");
    setMinPrice("");
    setMaxPrice("");
    setResults([]);
    setHasSearched(false);
  };

  useEffect(() => {
    if (!isOpen) {
      clearFilters();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content search-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>🔍 Buscar Doces</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="search-filters">
            <div className="search-input-group">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="search-input"
              />
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label>Ordenar por:</label>
                <select
                  value={orderBy}
                  onChange={(e) =>
                    setOrderBy(e.target.value as FilterOptions["orderBy"])
                  }
                  className="filter-select"
                >
                  <option value="nome">Nome (A-Z)</option>
                  <option value="preco_asc">Preço (menor para maior)</option>
                  <option value="preco_desc">Preço (maior para menor)</option>
                  <option value="recentes">Mais recentes</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Preço mínimo:</label>
                <input
                  type="number"
                  placeholder="0,00"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min="0"
                  step="0.50"
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label>Preço máximo:</label>
                <input
                  type="number"
                  placeholder="100,00"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                  step="0.50"
                  className="filter-input"
                />
              </div>
            </div>

            <div className="search-actions">
              <button onClick={clearFilters} className="clear-btn">
                Limpar Filtros
              </button>
              <button
                onClick={handleSearch}
                className="search-btn"
                disabled={loading}
              >
                {loading ? "Buscando..." : "Buscar"}
              </button>
            </div>
          </div>

          <div className="search-results">
            {loading && (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Buscando doces...</p>
              </div>
            )}

            {hasSearched && !loading && results.length === 0 && (
              <div className="no-results">
                <h3>😔 Nenhum doce encontrado</h3>
                <p>Tente ajustar os filtros de busca.</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="results-grid">
                {results.map((doce) => (
                  <DoceCard key={doce.id} doce={doce} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;

