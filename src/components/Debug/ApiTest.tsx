import React, { useState } from "react";
import axios from "axios";

const ApiTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResult("Testando conexão...");

    try {
      // Testar conexão básica
      const baseUrl =
        process.env.REACT_APP_API_URL || "http://localhost:8080/api";
      console.log("🔍 Testando URL:", baseUrl);
      console.log("🌍 REACT_APP_API_URL:", process.env.REACT_APP_API_URL);

      setTestResult((prev) => prev + `\n🔍 Testando URL: ${baseUrl}`);

      // Teste 1: Verificar se o backend está online (testando rota simples primeiro)
      try {
        console.log("📡 Testando rota básica...");
        const basicTest = await axios.get(`${baseUrl}/doces`, {
          timeout: 10000,
        });

        setTestResult(
          (prev) =>
            prev +
            "\n✅ Rota básica /doces: " +
            basicTest.status +
            " (" +
            basicTest.data?.doces?.length +
            " doces)"
        );
      } catch (basicError: any) {
        console.error("❌ Erro na rota básica:", basicError);
        setTestResult(
          (prev) =>
            prev +
            "\n❌ Erro na rota básica: " +
            (basicError.message || basicError.toString())
        );

        if (basicError.response) {
          setTestResult(
            (prev) => prev + "\n   Status: " + basicError.response.status
          );
        }

        // Continuar com outros testes mesmo se esse falhar
      }

      // Teste 2: Testar login
      try {
        console.log("🔐 Testando login...");
        const loginResponse = await axios.post(`${baseUrl}/auth/login`, {
          usernameOrEmail: "admin",
          password: "admin123",
        });

        setTestResult(
          (prev) => prev + "\n✅ Login funcionando: Token recebido"
        );
        console.log("🎯 Token recebido:", loginResponse.data.token);
        console.log("👤 Dados do usuário:", loginResponse.data.user);

        // Teste 3: Testar rotas admin com token
        try {
          console.log("📊 Testando rotas admin...");
          console.log("🔑 Token usado:", loginResponse.data.token);

          // Primeiro teste: listar doces admin (mais simples)
          try {
            const adminDocesResponse = await axios.get(
              `${baseUrl}/admin/doces`,
              {
                headers: {
                  Authorization: `Bearer ${loginResponse.data.token}`,
                },
                timeout: 10000,
              }
            );

            setTestResult(
              (prev) =>
                prev +
                "\n✅ Admin /doces: " +
                adminDocesResponse.status +
                " (" +
                adminDocesResponse.data?.doces?.length +
                " doces)"
            );
          } catch (err: any) {
            setTestResult(
              (prev) =>
                prev +
                "\n❌ Admin /doces: " +
                (err.response?.status || err.message)
            );
          }

          // Segundo teste: dashboard
          const adminResponse = await axios.get(
            `${baseUrl}/admin/doces/dashboard`,
            {
              headers: {
                Authorization: `Bearer ${loginResponse.data.token}`,
              },
              timeout: 15000,
            }
          );

          setTestResult(
            (prev) =>
              prev +
              "\n✅ Admin dashboard: " +
              JSON.stringify(adminResponse.data)
          );
        } catch (adminError: any) {
          console.error("❌ Erro completo na rota admin:", adminError);
          console.error("❌ Response:", adminError.response);
          console.error("❌ Request:", adminError.request);

          let errorDetail = "";
          if (adminError.code === "ECONNABORTED") {
            errorDetail = "Timeout na requisição";
          } else if (adminError.code === "ERR_NETWORK") {
            errorDetail = "Erro de rede - servidor pode estar offline";
          } else if (adminError.response) {
            errorDetail = `Status ${adminError.response.status}: ${
              adminError.response.data?.message ||
              adminError.response.statusText
            }`;
          } else if (adminError.request) {
            errorDetail = "Sem resposta do servidor";
          } else {
            errorDetail = adminError.message;
          }

          setTestResult(
            (prev) => prev + "\n❌ Erro na rota admin: " + errorDetail
          );
        }
      } catch (loginError: any) {
        console.error("❌ Erro no login:", loginError);
        setTestResult(
          (prev) =>
            prev +
            "\n❌ Erro no login: " +
            (loginError.response?.data?.message || loginError.message)
        );
      }
    } catch (error: any) {
      console.error("Erro no teste:", error);
      setTestResult(
        (prev) => prev + "\n❌ Erro: " + (error.message || error.toString())
      );

      if (error.response) {
        setTestResult((prev) => prev + "\n❌ Status: " + error.response.status);
        setTestResult(
          (prev) => prev + "\n❌ Data: " + JSON.stringify(error.response.data)
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Só mostrar em desenvolvimento
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        background: "rgba(0,0,0,0.9)",
        color: "white",
        padding: "15px",
        borderRadius: "8px",
        fontSize: "12px",
        zIndex: 9999,
        maxWidth: "400px",
        maxHeight: "300px",
        overflow: "auto",
      }}
    >
      <h4 style={{ margin: "0 0 10px 0" }}>🔧 API Test</h4>
      <button
        onClick={testBackendConnection}
        disabled={loading}
        style={{
          background: "#007bff",
          color: "white",
          border: "none",
          padding: "5px 10px",
          borderRadius: "3px",
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: "10px",
        }}
      >
        {loading ? "Testando..." : "Testar Backend"}
      </button>

      {testResult && (
        <pre
          style={{
            background: "rgba(255,255,255,0.1)",
            padding: "10px",
            borderRadius: "3px",
            fontSize: "11px",
            whiteSpace: "pre-wrap",
            margin: 0,
          }}
        >
          {testResult}
        </pre>
      )}
    </div>
  );
};

export default ApiTest;
