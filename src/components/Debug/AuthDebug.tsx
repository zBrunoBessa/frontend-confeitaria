import React from "react";
import { useAuth } from "../../contexts/AuthContext";

const AuthDebug: React.FC = () => {
  const { user, token, isAuthenticated, isAdmin, loading } = useAuth();

  // Só mostrar em desenvolvimento
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const forceRefresh = () => {
    console.log("🔄 Forçando refresh da página...");
    window.location.reload();
  };

  const savedUser = localStorage.getItem("auth_user");
  let parsedUser = null;
  try {
    parsedUser = savedUser ? JSON.parse(savedUser) : null;
  } catch (e) {
    console.error("Erro ao fazer parse do usuário salvo:", e);
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        zIndex: 9999,
        maxWidth: "350px",
        maxHeight: "400px",
        overflow: "auto",
      }}
    >
      <h4 style={{ margin: "0 0 5px 0" }}>🔍 Auth Debug</h4>

      <div
        style={{
          marginBottom: "8px",
          borderBottom: "1px solid #444",
          paddingBottom: "5px",
        }}
      >
        <strong>📊 Estado do Context:</strong>
      </div>
      <div>
        • <strong>Loading:</strong> {loading ? "true" : "false"}
      </div>
      <div>
        • <strong>Authenticated:</strong> {isAuthenticated ? "true" : "false"}
      </div>
      <div>
        • <strong>Is Admin:</strong> {isAdmin ? "true" : "false"}
      </div>
      <div>
        • <strong>User:</strong>{" "}
        {user
          ? `${user.firstName} ${user.lastName} (${user.username})`
          : "null"}
      </div>
      <div>
        • <strong>Token:</strong> {token ? "Presente" : "null"}
      </div>

      <div
        style={{
          marginTop: "8px",
          marginBottom: "8px",
          borderBottom: "1px solid #444",
          paddingBottom: "5px",
        }}
      >
        <strong>💾 LocalStorage:</strong>
      </div>
      <div>
        • <strong>Token:</strong>{" "}
        {localStorage.getItem("auth_token") ? "Presente" : "null"}
      </div>
      <div>
        • <strong>User:</strong>{" "}
        {localStorage.getItem("auth_user") ? "Presente" : "null"}
      </div>

      {parsedUser && (
        <div style={{ marginTop: "5px" }}>
          <div>
            • <strong>Nome:</strong> {parsedUser.nome}
          </div>
          <div>
            • <strong>Role:</strong> {parsedUser.role}
          </div>
          <div>
            • <strong>Username:</strong> {parsedUser.username}
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: "8px",
          marginBottom: "8px",
          borderBottom: "1px solid #444",
          paddingBottom: "5px",
        }}
      >
        <strong>🔍 Diagnóstico:</strong>
      </div>
      <div
        style={{
          fontSize: "11px",
          color: isAuthenticated ? "#90EE90" : "#FFB6C1",
        }}
      >
        {!loading && token && user && isAuthenticated
          ? "✅ Tudo OK"
          : !loading && token && !user
          ? "❌ Token sem usuário"
          : !loading && !token && user
          ? "❌ Usuário sem token"
          : !loading && !token && !user
          ? "ℹ️ Não logado"
          : loading
          ? "⏳ Carregando..."
          : "❓ Estado indefinido"}
      </div>

      {token && !user && (
        <button
          onClick={forceRefresh}
          style={{
            marginTop: "10px",
            background: "#dc3545",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "3px",
            cursor: "pointer",
            fontSize: "11px",
            width: "100%",
          }}
        >
          🔄 Force Refresh (Token sem usuário)
        </button>
      )}
    </div>
  );
};

export default AuthDebug;
