import React, { useState, useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { docesApi } from "../../services/api";
import { Doce } from "../../types";
import DoceCard from "./DoceCard";

const ProductsSection: React.FC = () => {
  const [doces, setDoces] = useState<Doce[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "cheap" | "expensive" | "recent"
  >("all");

  const loadDoces = async (category: typeof selectedCategory = "all") => {
    setLoading(true);
    setError(null);

    try {
      let response;

      switch (category) {
        case "cheap":
          response = await docesApi.getCheapestDoces(8);
          break;
        case "expensive":
          response = await docesApi.getExpensiveDoces(8);
          break;
        case "recent":
          response = await docesApi.getRecentDoces(8);
          break;
        default:
          response = await docesApi.getDoces({ orderBy: "nome" });
      }

      setDoces(response.doces);
    } catch (err) {
      setError("Erro ao carregar produtos. Tente novamente.");
      console.error("Erro ao carregar doces:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoces(selectedCategory);
  }, [selectedCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCategoryChange = (category: typeof selectedCategory) => {
    setSelectedCategory(category);
  };

  const handleRetry = () => {
    loadDoces(selectedCategory);
  };

  if (error) {
    return (
      <section id="produtos" className="produtos-section">
        <div className="container">
          <h2>Nossos Doces</h2>
          <div className="error-message">
            <AlertCircle size={48} />
            <h3>Ops! Algo deu errado</h3>
            <p>{error}</p>
            <button onClick={handleRetry} className="retry-btn">
              <RefreshCw size={16} />
              Tentar Novamente
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="produtos" className="produtos-section">
      <div className="container">
        <h2>Nossos Doces</h2>

        <div className="category-filters">
          <button
            className={`category-btn ${
              selectedCategory === "all" ? "active" : ""
            }`}
            onClick={() => handleCategoryChange("all")}
          >
            🍰 Todos os Doces
          </button>
          <button
            className={`category-btn ${
              selectedCategory === "cheap" ? "active" : ""
            }`}
            onClick={() => handleCategoryChange("cheap")}
          >
            💰 Mais Baratos
          </button>
          <button
            className={`category-btn ${
              selectedCategory === "expensive" ? "active" : ""
            }`}
            onClick={() => handleCategoryChange("expensive")}
          >
            👑 Premium
          </button>
          <button
            className={`category-btn ${
              selectedCategory === "recent" ? "active" : ""
            }`}
            onClick={() => handleCategoryChange("recent")}
          >
            🆕 Novidades
          </button>
        </div>

        {loading ? (
          <div className="loading-products">
            <div className="loading-spinner"></div>
            <p>Carregando nossos deliciosos doces...</p>
          </div>
        ) : (
          <>
            {doces.length === 0 ? (
              <div className="no-products">
                <h3>😔 Nenhum doce disponível no momento</h3>
                <p>Volte em breve para conferir nossas novidades!</p>
              </div>
            ) : (
              <div className="produtos-grid">
                {doces.map((doce) => (
                  <DoceCard key={doce.id} doce={doce} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
