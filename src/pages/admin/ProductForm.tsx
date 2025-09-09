import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { adminService } from "../../services/adminApi";
import { CreateDoceRequest, UpdateDoceRequest } from "../../types";

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [formData, setFormData] = useState<CreateDoceRequest>({
    nome: "",
    valor: 0,
    descricao: "",
    imagem: "",
    disponivel: true,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Carregar dados se estiver editando
  useEffect(() => {
    if (isEditing && id) {
      loadProduct(parseInt(id));
    }
  }, [isEditing, id]);

  const loadProduct = async (productId: number) => {
    try {
      setLoading(true);
      // Como não temos endpoint específico para um produto, vamos buscar na lista
      const response = await adminService.getAllDoces();
      const product = response.doces.find((p) => p.id === productId);

      if (product) {
        setFormData({
          nome: product.nome,
          valor: product.valor,
          descricao: product.descricao || "",
          imagem: product.imagem || "",
          disponivel: product.disponivel,
        });
      } else {
        setError("Produto não encontrado.");
      }
    } catch (err) {
      console.error("Erro ao carregar produto:", err);
      setError("Erro ao carregar dados do produto.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseFloat(value) || 0
          : value,
    }));

    // Limpar erro de validação do campo
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      errors.nome = "Nome é obrigatório";
    } else if (formData.nome.length < 2 || formData.nome.length > 100) {
      errors.nome = "Nome deve ter entre 2 e 100 caracteres";
    }

    if (formData.valor <= 0) {
      errors.valor = "Valor deve ser maior que zero";
    }

    if (formData.descricao && formData.descricao.length > 1000) {
      errors.descricao = "Descrição deve ter no máximo 1000 caracteres";
    }

    if (formData.imagem && formData.imagem.length > 500) {
      errors.imagem = "URL da imagem deve ter no máximo 500 caracteres";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (isEditing && id) {
        const updateData: UpdateDoceRequest = {
          nome: formData.nome,
          valor: formData.valor,
          descricao: formData.descricao || undefined,
          imagem: formData.imagem || undefined,
          disponivel: formData.disponivel,
        };
        await adminService.updateDoce(parseInt(id), updateData);
      } else {
        await adminService.createDoce(formData);
      }

      navigate("/admin/products");
    } catch (err: any) {
      console.error("Erro ao salvar produto:", err);

      if (err.response?.status === 400) {
        setError("Dados inválidos. Verifique os campos e tente novamente.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro ao salvar produto. Tente novamente.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate("/admin/products");
  };

  if (loading) {
    return (
      <div className="form-loading">
        <div className="loading-spinner"></div>
        <p>Carregando dados do produto...</p>
      </div>
    );
  }

  return (
    <div className="product-form-page">
      <div className="form-header">
        <button onClick={handleBack} className="back-button">
          <ArrowLeft size={16} />
          Voltar
        </button>
        <h1>{isEditing ? "✏️ Editar Produto" : "➕ Adicionar Produto"}</h1>
      </div>

      {error && (
        <div className="error-alert">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nome">Nome do Produto *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Brigadeiro Gourmet"
              className={validationErrors.nome ? "error" : ""}
              required
            />
            {validationErrors.nome && (
              <span className="field-error">{validationErrors.nome}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="valor">Preço (R$) *</label>
            <input
              type="number"
              id="valor"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className={validationErrors.valor ? "error" : ""}
              required
            />
            {validationErrors.valor && (
              <span className="field-error">{validationErrors.valor}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Descreva o produto, ingredientes, sabores..."
            rows={4}
            className={validationErrors.descricao ? "error" : ""}
          />
          {validationErrors.descricao && (
            <span className="field-error">{validationErrors.descricao}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="imagem">URL da Imagem</label>
          <input
            type="url"
            id="imagem"
            name="imagem"
            value={formData.imagem}
            onChange={handleChange}
            placeholder="https://exemplo.com/imagem.jpg"
            className={validationErrors.imagem ? "error" : ""}
          />
          {validationErrors.imagem && (
            <span className="field-error">{validationErrors.imagem}</span>
          )}
          {formData.imagem && (
            <div className="image-preview">
              <img
                src={formData.imagem}
                alt="Preview"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="disponivel"
              checked={formData.disponivel}
              onChange={handleChange}
            />
            <span className="checkbox-text">
              {formData.disponivel ? (
                <>
                  <Eye size={16} />
                  Produto disponível para venda
                </>
              ) : (
                <>
                  <EyeOff size={16} />
                  Produto indisponível
                </>
              )}
            </span>
          </label>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleBack}
            className="cancel-button"
            disabled={saving}
          >
            Cancelar
          </button>

          <button type="submit" className="save-button" disabled={saving}>
            {saving ? (
              <>
                <div className="button-spinner"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save size={16} />
                {isEditing ? "Atualizar" : "Criar"} Produto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
