# 🧁 Confeitaria Doce Sabor - Frontend

Frontend moderno e responsivo para o sistema de gerenciamento de confeitaria, desenvolvido em React com TypeScript.

## ✨ Funcionalidades

### 🛒 **Carrinho de Compras**

- Adicionar produtos ao carrinho com quantidade personalizada
- Visualizar itens no carrinho em tempo real
- Alterar quantidades dos produtos
- Remover itens do carrinho
- Persistência dos dados no localStorage
- Cálculo automático do total

### 🔍 **Busca e Filtros Avançados**

- Busca por nome e descrição dos produtos
- Filtros por faixa de preço
- Ordenação por nome, preço e novidades
- Interface intuitiva de busca modal

### 📱 **Integração WhatsApp**

- Envio automatizado do pedido via WhatsApp
- Formatação profissional da mensagem
- Número configurado: (15) 99674-7692
- Geração de link direto para o WhatsApp

### 🎨 **Design Responsivo**

- Interface clean e moderna
- Cores suaves e harmoniosas
- Totalmente responsivo (desktop, tablet, mobile)
- Animações suaves e feedback visual
- UX otimizada para confeitaria

### 📦 **Categorias de Produtos**

- Todos os doces disponíveis
- Doces mais baratos
- Doces premium
- Novidades recentes

## 🚀 Como Executar

### Pré-requisitos

- Node.js 16+ instalado
- Backend da confeitaria rodando (porta 8080)

### Instalação

```bash
# Clone o repositório (se aplicável)
git clone <seu-repo>
cd confeitaria

# Instale as dependências
npm install

# Configure a URL da API (opcional)
# Crie um arquivo .env na raiz com:
# REACT_APP_API_URL=http://localhost:8080/api

# Execute o projeto
npm start
```

O frontend será executado em [http://localhost:3000](http://localhost:3000)

## 🔧 Configuração da API

Por padrão, o frontend se conecta ao backend em `http://localhost:8080/api`.

Para alterar essa configuração:

1. Crie um arquivo `.env` na raiz do projeto:

```env
REACT_APP_API_URL=http://seu-backend:porta/api
```

2. Reinicie o servidor de desenvolvimento

## 📋 Rotas da API Utilizadas

### Rotas Públicas (sem autenticação):

- `GET /api/doces` - Lista todos os doces disponíveis
- `GET /api/doces?search=termo` - Busca doces por nome/descrição
- `GET /api/doces?orderBy=preco_asc` - Ordena por preço crescente
- `GET /api/doces?minPrice=5&maxPrice=15` - Filtra por faixa de preço
- `GET /api/doces/cheapest?limit=5` - Doces mais baratos
- `GET /api/doces/expensive?limit=5` - Doces premium
- `GET /api/doces/recent?limit=10` - Novidades

## 🛠️ Tecnologias Utilizadas

- **React 19** - Framework frontend
- **TypeScript** - Tipagem estática
- **Axios** - Cliente HTTP para API
- **Lucide React** - Ícones modernos
- **CSS3** - Estilização responsiva
- **LocalStorage** - Persistência do carrinho

## 📱 Funcionalidades do Carrinho

### Adicionar Produtos

- Selecione a quantidade desejada
- Clique em "Adicionar ao Carrinho"
- Feedback visual de confirmação

### Gerenciar Carrinho

- Acesse via ícone do carrinho no header
- Altere quantidades com botões +/-
- Remova itens individualmente
- Limpe todo o carrinho

### Finalizar Pedido

1. Revise os itens no carrinho
2. Clique em "Finalizar pelo WhatsApp"
3. Será redirecionado para o WhatsApp com a mensagem formatada
4. Envie a mensagem para finalizar o pedido

## 🎨 Personalização Visual

### Cores Principais

- **Primária**: `#ff6b6b` (rosa coral)
- **Secundária**: `#ffa726` (laranja)
- **Fundo**: `#fafafa` (cinza muito claro)
- **Texto**: `#333` (cinza escuro)

### Responsividade

- **Desktop**: Layout em grid com múltiplas colunas
- **Tablet**: Layout adaptado para tela média
- **Mobile**: Layout em coluna única, otimizado para toque

## 🚀 Deploy

Para fazer deploy em produção:

```bash
# Gere a build de produção
npm run build

# Os arquivos serão gerados na pasta 'build/'
# Faça upload para seu servidor web
```

## 🆘 Solução de Problemas

### API não conecta

- Verifique se o backend está rodando na porta 8080
- Confirme a URL da API no arquivo `.env`
- Verifique o console do navegador para erros

### Produtos não carregam

- Confirme se o backend tem doces cadastrados
- Verifique se há doces disponíveis (disponivel: true)
- Abra as ferramentas de desenvolvedor para debug

### WhatsApp não abre

- Verifique se está em HTTPS (em produção)
- Confirme se o número está correto no código
- Teste em diferentes navegadores/dispositivos

## 📞 Contato

Para dúvidas ou suporte:

- **WhatsApp**: (15) 99674-7692
- **Email**: contato@docesabor.com.br

---

Desenvolvido com ❤️ para a Confeitaria Doce Sabor
