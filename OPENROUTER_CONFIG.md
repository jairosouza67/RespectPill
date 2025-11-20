# 🤖 Configuração da IA - OpenRouter

## Qual IA está sendo usada agora?

**Arquivo:** `src/lib/ai.ts` (linha 16)

```typescript
const AI_MODEL = "google/gemini-2.0-flash-lite-preview-02-05:free";
```

### Características Atuais:
- ✅ **Gratuito** - Sem custos iniciais
- ⚡ **Rápido** - Responde em ~2-3 segundos
- 🎯 **Modelo:** Google Gemini 2.0 Flash (Lite)
- 🔄 **Atualizado** - Versão preview de fevereiro 2025

---

## 📊 Modelos Disponíveis (Gratuitos)

### 1️⃣ Gemini 2.0 Flash Lite ⭐ (ATUAL)
```typescript
"google/gemini-2.0-flash-lite-preview-02-05:free"
```
- **Velocidade:** ⚡⚡⚡ (Muito rápido)
- **Qualidade:** ⭐⭐⭐⭐ (Excelente para testes)
- **Uso ideal:** Dietas, treinos, análise financeira
- **Limite:** ~1M tokens/mês gratuito

### 2️⃣ Llama 2 70B
```typescript
"meta-llama/llama-2-70b-chat:free"
```
- **Velocidade:** ⚡⚡⭐ (Mais lento)
- **Qualidade:** ⭐⭐⭐⭐⭐ (Muito bom)
- **Uso ideal:** Respostas mais detalhadas
- **Limite:** Ilimitado (Open Source)

### 3️⃣ Mistral 7B
```typescript
"mistralai/mistral-7b:free"
```
- **Velocidade:** ⚡⚡⚡ (Rápido)
- **Qualidade:** ⭐⭐⭐⭐ (Bom)
- **Uso ideal:** Textos curtos e diretos
- **Limite:** Ilimitado

### 4️⃣ Claude 3 Haiku (Pago - Barato)
```typescript
"anthropic/claude-3-haiku"
```
- **Velocidade:** ⚡⚡ (Rápido)
- **Qualidade:** ⭐⭐⭐⭐⭐ (Excelente)
- **Uso ideal:** Análise profunda
- **Custo:** ~$0.25 por 1M tokens

### 5️⃣ GPT-4 Turbo (Pago - Premium)
```typescript
"openai/gpt-4-turbo"
```
- **Velocidade:** ⚡ (Moderado)
- **Qualidade:** ⭐⭐⭐⭐⭐⭐ (Máximo)
- **Uso ideal:** Tarefas críticas
- **Custo:** ~$10 por 1M tokens

---

## 🔄 Como Mudar de IA

### Passo 1: Editar arquivo
Abra: `src/lib/ai.ts`

### Passo 2: Encontrar e atualizar
**Linha ~16:**
```typescript
// ❌ ANTES
const AI_MODEL = "google/gemini-2.0-flash-lite-preview-02-05:free";

// ✅ DEPOIS (Exemplo: Llama)
const AI_MODEL = "meta-llama/llama-2-70b-chat:free";
```

### Passo 3: Salvar e testar
```bash
npm run dev
# Teste alguma funcionalidade de IA (Dieta, Treino, etc)
```

### Passo 4: Commit e Push
```bash
git add src/lib/ai.ts
git commit -m "chore: Change AI model to Llama 2"
git push origin main
```

Netlify fará o rebuild automaticamente! ✨

---

## 💰 Preço por Uso

### OpenRouter - Tabela de Custos

| Modelo | Input | Output | Melhor Para |
|--------|-------|--------|-------------|
| Gemini Flash (Free) | 🆓 | 🆓 | Testes, prototipagem |
| Llama 2 (Free) | 🆓 | 🆓 | Produção baixo custo |
| Haiku | $0.25/M | $1.25/M | Uso moderado |
| GPT-4o Mini | $0.15/M | $0.60/M | Balance |
| Claude 3.5 Sonnet | $3/M | $15/M | Premium |

**M = 1 milhão de tokens**

---

## 📝 Caso de Uso: Dieta

Quando usuário pede "Criar plano de dieta":

1. **Seu Prompt:** "Preciso de dieta para ganho de massa"
2. **Sistema envia para IA:** Seu perfil + objetivo
3. **IA retorna:** JSON estruturado com:
   - Calorias diárias
   - Distribuição de macros (proteína, carbos, gordura)
   - Refeições do dia
   - Alimentos específicos

**Modelo usado:** O definido em `AI_MODEL`

---

## 🚀 Performance Esperada

### Gemini Flash (ATUAL)
```
Dieta: ~2s
Treino: ~2.5s
Análise Financeira: ~1.5s
Análise Relacional: ~2s
```

### Llama 2
```
Dieta: ~4s
Treino: ~5s
Análise Financeira: ~3s
Análise Relacional: ~4s
```

---

## 🔐 Segurança da API

✅ Chave armazenada em `VITE_OPENROUTER_API_KEY`
✅ Enviada apenas via HTTPS
✅ Headers de autenticação inclusos
✅ Sem exposição de dados sensíveis

**Não compartilhe sua chave!**

---

## 🆘 Troubleshooting

### ❌ "IA não responde"
1. Verifique `VITE_OPENROUTER_API_KEY` no `.env`
2. Confira se tem créditos em https://openrouter.ai

### ❌ "Resposta lenta"
1. Tente modelo `Gemini Flash`
2. Ou `Mistral 7B`
3. Evite `GPT-4o` (mais lento mas melhor qualidade)

### ❌ "Erro JSON"
1. Modelo pode estar fora ou com limite excedido
2. Experimente mudar para `Llama 2`
3. Confira logs no console

---

## 📚 Referências

- **OpenRouter:** https://openrouter.ai/
- **Documentação:** https://openrouter.ai/docs
- **Preços:** https://openrouter.ai/rankings/speed
- **Modelos:** https://openrouter.ai/models

---

**Resumo:** Gemini Flash é usado por padrão porque é rápido e gratuito. Para produção com mais usuários, considere Llama 2 ou Claude. 🚀
