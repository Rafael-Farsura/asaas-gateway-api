# 🔄 Ciclo de Vida Completo - API Asaas Integration

## 📋 Índice
1. [Configuração Inicial](#1-configuração-inicial)
2. [Gestão de Clientes](#2-gestão-de-clientes)
3. [Criação de Pagamentos](#3-criação-de-pagamentos)
4. [Acompanhamento e Gestão](#4-acompanhamento-e-gestão)
5. [Finalização](#5-finalização)

---

## 1. CONFIGURAÇÃO INICIAL 🔧

### 1.1. Criar Access Token
**Endpoint:** `POST /api/access-tokens`

**Quando usar:** No início do projeto, ao integrar um novo cliente/sistema

```json
{
  "clientId": "306886d4-62a1-4b72-ac05-fb9a155185db",
  "accessToken": "$aact_hmlg_000...",
  "description": "Token do RHtrip para ambiente de produção"
}
```

**O que acontece:**
- Token é armazenado no sistema
- Associado a um clientId específico
- Pode ser usado para autenticar todas as operações subsequentes

### 1.2. Verificar Token
**Endpoint:** `GET /api/access-tokens/{id}`

**Quando usar:** Para confirmar que o token foi criado corretamente

---

## 2. GESTÃO DE CLIENTES 👥

### 2.1. Criar Cliente
**Endpoint:** `POST /customers?environment=SANDBOX`

**Quando usar:** Antes de criar qualquer pagamento ou link de pagamento

```json
{
  "name": "Usuário Teste",
  "cpfCnpj": "571.895.310-41",
  "email": "usuario@teste.com",
  "phone": "+5588992814764",
  "address": "Rua Exemplo",
  "addressNumber": "51",
  "province": "Bairro Exemplo",
  "postalCode": "63100000"
}
```

**O que acontece:**
- Cliente é registrado no Asaas
- Retorna um `customer_id` (ex: `cus_000006705636`)
- Este ID será usado em todos os pagamentos

### 2.2. Listar Clientes
**Endpoint:** `GET /customers?environment=SANDBOX`

**Quando usar:** Para consultar clientes existentes, validar cadastros

---

## 3. CRIAÇÃO DE PAGAMENTOS 💳

### Opção A: Pagamento Direto (PIX)

#### 3.1. Criar Cobrança PIX
**Endpoint:** `POST /payments?environment=SANDBOX`

```json
{
  "customer": "cus_000006705636",
  "value": 100,
  "dueDate": "2025-06-01",
  "billingType": "PIX",
  "totalValue": 0
}
```

**O que acontece:**
- Cobrança é criada no Asaas
- Retorna um `payment_id` (ex: `pay_u4n5vwde3gccxxxq`)
- Status inicial: `PENDING`

#### 3.2. Buscar QR Code PIX
**Endpoint:** `GET /payments/{paymentId}/pix-info?environment=SANDBOX`

**Quando usar:** Imediatamente após criar o pagamento PIX

**O que retorna:**
- QR Code (imagem base64)
- Código PIX copia e cola
- Dados para exibir ao cliente

---

### Opção B: Pagamento com Cartão de Crédito

#### 3.3. Criar Pagamento com Cartão
**Endpoint:** `POST /payments/credit-card?environment=SANDBOX`

```json
{
  "customer": "cus_000006671674",
  "value": 0,
  "dueDate": "2025-05-01",
  "installmentCount": 2,
  "totalValue": 100,
  "creditCard": {
    "holderName": "John Doe",
    "number": "4242424242424242",
    "expiryMonth": "4",
    "expiryYear": "2025",
    "ccv": "123"
  },
  "creditCardHolderInfo": {
    "name": "John Doe",
    "email": "john.doe@asaas.com",
    "cpfCnpj": "12345678901",
    "postalCode": "12345678",
    "addressNumber": "123"
  },
  "remoteIp": "1b67:5bcb:f9da:0e6f:bc5a:5a9c:b299:b66a"
}
```

**O que acontece:**
- Pagamento processado imediatamente
- Status retornado: `CONFIRMED` (sucesso) ou `FAILED` (falha)
- Não requer QR Code

---

### Opção C: Link de Pagamento (Checkout)

#### 3.4. Criar Link de Pagamento
**Endpoint:** `POST /payment-links?environment=SANDBOX`

```json
{
  "name": "Rafael Farsura",
  "description": "Comprando um produto de $70.000.000,00 #SQN",
  "value": 100,
  "billingType": "CREDIT_CARD",
  "chargeType": "INSTALLMENT",
  "dueDateLimitDays": 10,
  "maxInstallmentCount": 10
}
```

**O que acontece:**
- Link de checkout é gerado
- Cliente pode acessar página de pagamento
- Não precisa de customer_id previamente

#### 3.5. Listar Links de Pagamento
**Endpoint:** `GET /payment-links?environment=SANDBOX`

**Quando usar:** Para acompanhar links criados e seus status

---

## 4. ACOMPANHAMENTO E GESTÃO 📊

### 4.1. Listar Todos os Pagamentos
**Endpoint:** `GET /payments?environment=SANDBOX`

**Quando usar:** 
- Monitorar pagamentos pendentes
- Verificar status de pagamentos
- Dashboard de pagamentos

**Status possíveis:**
- `PENDING` - Aguardando pagamento
- `RECEIVED` - Pagamento recebido (PIX)
- `CONFIRMED` - Pagamento confirmado (Cartão)
- `OVERDUE` - Vencido
- `REFUNDED` - Reembolsado
- `CANCELED` - Cancelado

### 4.2. Atualizar Token (se necessário)
**Endpoint:** `PATCH /api/access-tokens/{id}`

**Quando usar:** 
- Token expirou
- Mudança de ambiente (SANDBOX → PRODUCTION)
- Renovação de credenciais

```json
{
  "accessToken": "new_token_here",
  "description": "Token atualizado",
  "isActive": true
}
```

---

## 5. FINALIZAÇÃO 🏁

### 5.1. Cancelar Pagamento (se necessário)
**Endpoint:** `DELETE /payments/{paymentId}?environment=SANDBOX`

**Quando usar:**
- Cliente desistiu da compra
- Erro no valor/dados
- Pagamento duplicado

**O que acontece:**
- Pagamento é cancelado
- Status muda para `CANCELED`
- Não pode ser mais pago

### 5.2. Desativar Token
**Endpoint:** `PATCH /api/access-tokens/{id}`

```json
{
  "isActive": false
}
```

**Quando usar:**
- Fim do contrato com cliente
- Migração de sistema
- Segurança (token comprometido)

### 5.3. Deletar Token (permanente)
**Endpoint:** `DELETE /api/access-tokens/{id}`

**Quando usar:**
- Remoção definitiva
- Limpeza de tokens antigos

---

## 🔄 FLUXOS COMPLETOS

### Fluxo 1: Pagamento PIX (Mais Comum)

```
1. POST /api/access-tokens (uma vez)
   ↓
2. POST /customers (uma vez por cliente)
   ↓
3. POST /payments (PIX)
   ↓
4. GET /payments/{id}/pix-info (buscar QR Code)
   ↓
5. [Cliente paga via PIX]
   ↓
6. GET /payments (verificar status = RECEIVED)
```

### Fluxo 2: Pagamento com Cartão

```
1. POST /api/access-tokens (uma vez)
   ↓
2. POST /customers (uma vez por cliente)
   ↓
3. POST /payments/credit-card
   ↓
4. [Resposta imediata: CONFIRMED ou FAILED]
   ↓
5. GET /payments (histórico)
```

### Fluxo 3: Link de Pagamento

```
1. POST /api/access-tokens (uma vez)
   ↓
2. POST /payment-links
   ↓
3. [Compartilhar link com cliente]
   ↓
4. GET /payment-links (verificar status)
   ↓
5. GET /payments (ver pagamentos do link)
```

---

## ⚠️ BOAS PRÁTICAS

### Início
- ✅ Sempre teste em SANDBOX primeiro
- ✅ Guarde o `customer_id` após criar cliente
- ✅ Valide CPF/CNPJ antes de enviar

### Meio
- ✅ Implemente webhooks para notificações de pagamento
- ✅ Faça polling de status apenas se necessário
- ✅ Armazene `payment_id` no seu banco de dados

### Fim
- ✅ Cancele pagamentos não utilizados
- ✅ Desative tokens não mais usados
- ✅ Mantenha logs de todas operações

---

## 🔐 SEGURANÇA

1. **Nunca** exponha o `access_token` no frontend
2. **Sempre** use HTTPS em produção
3. **Rotacione** tokens periodicamente
4. **Monitore** uso de tokens via logs
5. **Desative** tokens suspeitos imediatamente