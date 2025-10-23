# 💼 Microserviço de Pagamentos Corporativos — Asaas Integration

**Versão:** 1.0
**Autor:** Rafael Farsura
**Tecnologia:** NestJS • TypeScript • PostgreSQL • Docker

---

## 🧩 Visão Geral

Este microserviço provê uma **camada corporativa de integração segura e escalável** com a **API do Asaas**, centralizando o gerenciamento de clientes, tokens e transações financeiras.

Desenvolvido para **ambientes empresariais e instituições financeiras**, o sistema segue padrões de **segurança, isolamento e rastreabilidade**, permitindo integração confiável com o ecossistema Asaas em múltiplos ambientes (Sandbox e Produção).

---

## 🏛️ Arquitetura Global do Sistema

```mermaid
graph TD
    subgraph CLIENTE["🌐 Cliente / Aplicação Externa"]
        A1[Front-end / ERP / App Móvel]
    end

    subgraph GATEWAY["🧩 API Gateway (NestJS)"]
        B1[Access Token Layer]
        B2[Payments Service]
        B3[Customers Service]
        B4[Payment Links Service]
        B5[Encryption & Validation Layer]
        B6[Logging & Audit Layer]
    end

    subgraph DATABASE["🗄️ Banco de Dados (PostgreSQL)"]
        C1[(Access Tokens)]
        C2[(Clientes)]
        C3[(Pagamentos)]
        C4[(Logs & Auditorias)]
    end

    subgraph EXTERNAL["💳 Asaas API (Sandbox / Production)"]
        D1[/Asaas API Gateway/]
    end

    A1 -->|Autenticação + Solicitações HTTPS| B1
    B1 -->|Validação e Criptografia| B5
    B2 -->|Processa Transações| D1
    B3 -->|Gerencia Clientes| D1
    B4 -->|Gera Links de Pagamento| D1
    B5 -->|Armazena Dados Seguros| C1
    B6 -->|Registra Logs| C4
    D1 -->|Respostas e Confirmações| A1
```

> **Resumo:**
> O microserviço atua como uma **camada de abstração corporativa** entre o cliente e o Asaas, garantindo criptografia ponta a ponta, controle de tokens e isolamento transacional.

---

## 🏗️ Arquitetura Corporativa

O microserviço segue o padrão **Domain-Driven Design (DDD)** e **Clean Architecture**, assegurando manutenibilidade, modularidade e fácil escalabilidade.

```
src/
├── access-tokens/       # Gestão e criptografia de tokens
├── asaas/               # Core de integração com a API Asaas
├── customers/           # Domínio de clientes
├── payments/            # Processamento de pagamentos
├── payment-links/       # Checkout e links de pagamento
├── notifications/       # Webhooks e callbacks
├── config/              # Configurações globais
└── types/               # Tipos e enums corporativos
```

### 🌐 Integração com o Asaas

O microserviço encapsula toda a comunicação com a **API do Asaas**, expondo endpoints internos seguros que abstraem complexidades, incluindo:

* Tokens independentes por cliente;
* Criptografia RSA para dados sensíveis;
* Validação e sanitização de payloads;
* Transmissão HTTPS com autenticação centralizada.

---

## 🔒 Pilares de Segurança

| Ponto Crítico         | Estratégia                                                       |
| --------------------- | ---------------------------------------------------------------- |
| **Tokens de Acesso**  | Armazenados de forma criptografada e validados a cada requisição |
| **Dados de Cartão**   | Criptografia assimétrica (RSA); nunca persistidos em banco       |
| **Tráfego**           | HTTPS obrigatório e CORS controlado por ambiente                 |
| **Rotação de Tokens** | Atualização sem downtime                                         |
| **Auditoria**         | Registro de logs e histórico de uso                              |

---

## ⚙️ Requisitos Técnicos

| Requisito        | Versão Recomendada                   |
| ---------------- | ------------------------------------ |
| Node.js          | ≥ 20.x                               |
| PostgreSQL       | ≥ 16.x                               |
| Docker / Compose | Latest                               |
| Conta Asaas      | Token ativo de Sandbox e/ou Produção |

---

## 🧰 Instalação e Deploy

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/asaas-gateway-api.git
cd asaas-gateway-api
```

### 2️⃣ Configurar o Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/asaas_payment_gateway
NODE_ENV=production
PORT=8000
ASAAS_BASE_URL=https://api.asaas.com/v3
ASAAS_SANDBOX_BASE_URL=https://sandbox.asaas.com/api/v3
SWAGGER_PATH=api
```

### 3️⃣ Inicializar Banco de Dados

```bash
docker-compose up -d
```

### 4️⃣ Executar a Aplicação

```bash
npm install
npm run start:dev
```

---

## 🧾 Endpoints Corporativos

### 🔑 Tokens de Acesso

```http
POST /access-tokens
GET  /access-tokens
PATCH /access-tokens/{id}
DELETE /access-tokens/{id}
```

### 👥 Clientes

```http
POST /customers
GET  /customers
```

### 💳 Pagamentos

```http
POST /payments                 # PIX
POST /payments/credit-card     # Cartão de Crédito
GET  /payments                 # Listagem / Status
DELETE /payments/{id}          # Cancelamento
```

### 🔗 Links de Pagamento

```http
POST /payment-links
GET  /payment-links
```

---

## 🔄 Ciclo de Vida de Pagamentos

### 🔹 Pagamento via PIX

```mermaid
graph TD
    A[Cliente] -->|Cria Token| B(API Gateway)
    B -->|Registra Cliente| C[Asaas API]
    C -->|Gera Cobrança PIX| D[Pagamento Pendente]
    D -->|QR Code| E[Cliente Realiza Pagamento]
    E -->|Confirmação| F[Status: RECEIVED]
```

### 🔹 Pagamento via Cartão

```mermaid
graph TD
    A[Cliente] -->|Cria Token| B(API Gateway)
    B -->|Registra Cliente| C[Asaas API]
    C -->|Envia Dados Criptografados| D[Processamento]
    D -->|Resposta| E{Status}
    E -->|CONFIRMED| F[Pagamento Aprovado]
    E -->|FAILED| G[Transação Recusada]
```

### 🔹 Pagamento via Link

```mermaid
graph TD
    A[Cliente] -->|Cria Token| B(API Gateway)
    B -->|Gera Link| C[Asaas API]
    C -->|Retorna URL| D[Checkout Público]
    D -->|Cliente Paga| E[Asaas]
    E -->|Confirmação| F[Status: PAID]
```

---

## 🧭 Boas Práticas Corporativas

* ✅ Sempre validar CPF/CNPJ antes do envio
* ✅ Utilizar **ambiente Sandbox** para testes iniciais
* ✅ Implementar **webhooks** para atualização de status
* ✅ Rotacionar tokens periodicamente
* ✅ Nunca expor `access_token` em aplicações cliente
* ✅ Registrar logs de todas as operações críticas

---

## 🧪 Testes e QA

O projeto inclui suporte a testes REST e Jest:

```bash
npm run test
```

Para testes manuais, utilize os arquivos `.rest` disponíveis em `/test`.

---

## 🧮 Observabilidade e Monitoramento

* Healthcheck automático via Docker Compose
* Logs detalhados por requisição
* Métricas integradas para Prometheus/Grafana
* Alertas configuráveis por projeto

---

## 📖 Documentação Integrada

| Tipo                      | Acesso                                                                       |
| ------------------------- | ---------------------------------------------------------------------------- |
| **Swagger UI**            | [`http://localhost:8000/api`](http://localhost:8000/api)                     |
| **Painel Administrativo** | [`http://localhost:8000/admin`](http://localhost:8000/admin)                 |
| **Documentação Completa** | [`http://localhost:8000/documentation`](http://localhost:8000/documentation) |

---

## 🧑‍💻 Desenvolvimento e Contribuição

1. Faça um fork do repositório
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Envie PR para revisão corporativa

---

## 🧱 Tecnologias Utilizadas

<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-671ddf?style=for-the-badge&logo=axios&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" />
</div>

---

## 👤 Autor

| Foto                                                                                                                          | Nome                                                    | Cargo                |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | -------------------- |
| <img src="https://avatars.githubusercontent.com/rafael-farsura?s=550&2u=ae99bd456c6b274cd934d85a374a44340140e222&v=8" width="120"> | [**Rafael Farsura**](https://github.com/Rafael-Farsura) | Full Stack Developer |

---

© 2025 — **Asaas Gateway Api**. Todos os direitos reservados.
