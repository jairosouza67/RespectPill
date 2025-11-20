# 🚀 Guia de Deploy na Netlify

## Pré-requisitos
- Conta no [Netlify](https://netlify.com)
- Código enviado para GitHub
- Variáveis de ambiente configuradas

---

## 1️⃣ Configurar Variáveis de Ambiente

### 📍 Onde colocar as variáveis:

**Netlify Dashboard → Site Settings → Build & Deploy → Environment**

### 🔑 Variáveis Necessárias:

```env
# Firebase (necessário para autenticação)
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID

# OpenRouter (para IA)
VITE_OPENROUTER_API_KEY
VITE_SITE_URL

# Stripe (se usar pagamentos)
VITE_STRIPE_PUBLISHABLE_KEY
```

---

## 2️⃣ OpenRouter - Variáveis de Ambiente

### Como obter sua chave:

1. Acesse: https://openrouter.ai/keys
2. Faça login com Google
3. Clique em "Create Key"
4. Copie a chave e adicione em `VITE_OPENROUTER_API_KEY`

### Como saber qual IA está sendo usada:

**Arquivo:** `src/lib/ai.ts` (linha ~16)

```typescript
const AI_MODEL = "google/gemini-2.0-flash-lite-preview-02-05:free";
```

### 🎯 Modelos Gratuitos Disponíveis no OpenRouter:

| Modelo | Uso | Free? |
|--------|-----|-------|
| `google/gemini-2.0-flash-lite:free` | Rápido e leve | ✅ |
| `meta-llama/llama-2-70b-chat:free` | Potente e versátil | ✅ |
| `mistralai/mistral-7b:free` | Rápido | ✅ |
| `openai/gpt-4o-mini` | Mais preciso | 💰 |

**Atual:** `Gemini 2.0 Flash Lite` (Gratuito, rápido para testes)

### Como trocar de modelo:

1. Edite `src/lib/ai.ts`
2. Mude a constante `AI_MODEL`:
```typescript
// Trocar para:
const AI_MODEL = "meta-llama/llama-2-70b-chat:free";
```
3. Commit e push para GitHub
4. Netlify fará rebuild automático

---

## 3️⃣ Deploy Automático

### Método 1: Connect Git (Recomendado)

1. No Netlify Dashboard: **Add new site → Import an existing project**
2. Escolha GitHub e autorize
3. Selecione o repositório `RespectPill`
4. Configure:
   - **Build command:** `npm run build` ✅ (já configurado)
   - **Publish directory:** `dist` ✅ (já configurado)
5. Clique **Deploy**

### Método 2: Netlify CLI

```bash
# Instalar CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Ou build local e depois deploy
npm run build
netlify deploy --prod --dir=dist
```

---

## 4️⃣ Checklist Final

- [ ] Firebase está configurado e funcional
- [ ] OpenRouter API key válida e com créditos
- [ ] Variáveis de ambiente adicionadas no Netlify
- [ ] Build local testado: `npm run build && npm run preview`
- [ ] Repositório GitHub atualizado com `netlify.toml`
- [ ] Site conectado ao GitHub via Netlify

---

## 5️⃣ Verificar Deploy

### URLs de Status:
- **Deployments:** https://app.netlify.com/sites/[seu-site]/deploys
- **Build Logs:** Clique no deploy e veja os logs
- **Site ao vivo:** https://[seu-site].netlify.app

### Solução de Problemas:

❌ **Erro: "Cannot find module"**
→ Rode `npm install` antes de fazer push

❌ **IA não funciona**
→ Verifique se `VITE_OPENROUTER_API_KEY` está definida

❌ **Login Firebase falha**
→ Confirme que as variáveis `VITE_FIREBASE_*` estão corretas

❌ **Imagens não carregam**
→ Confira CORS no Firebase Storage

---

## 6️⃣ Domínio Customizado (Opcional)

1. Em **Site settings → Domain management**
2. Clique **Add custom domain**
3. Configure DNS no seu registrador
4. Netlify gera SSL automaticamente

---

## 🔒 Segurança

✅ Todas as variáveis são prefixadas com `VITE_`
✅ Somente expostas no cliente (nenhuma chave privada)
✅ `netlify.toml` configurado com headers de segurança
✅ Cache inteligente para assets

---

**Status:** Pronto para deploy! 🚀
