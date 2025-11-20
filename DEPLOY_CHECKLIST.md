# ✅ PREPARAÇÃO PARA NETLIFY - CONCLUÍDA

## 📋 O que foi criado:

### 1. **netlify.toml**
   - ✅ Configuração de build (`npm run build`)
   - ✅ Publicação de `dist`
   - ✅ Redirecionamento SPA (todas rotas → index.html)
   - ✅ Headers de segurança CORS
   - ✅ Cache inteligente para assets

### 2. **NETLIFY_DEPLOY.md**
   - ✅ Passo a passo completo
   - ✅ Como conectar GitHub ao Netlify
   - ✅ Onde colocar variáveis de ambiente
   - ✅ Solução de problemas
   - ✅ Configuração de domínio customizado

### 3. **OPENROUTER_CONFIG.md**
   - ✅ Qual IA está sendo usada (Gemini 2.0 Flash)
   - ✅ Como trocar de modelo de IA
   - ✅ Comparação de custos
   - ✅ Performance esperada de cada modelo
   - ✅ Guia passo-a-passo

### 4. **.env.example (atualizado)**
   ```env
   VITE_OPENROUTER_API_KEY=...
   VITE_SITE_URL=https://seu-site.netlify.app
   ```

### 5. **scripts/check-env.sh**
   - ✅ Script para verificar variáveis antes do deploy
   - ✅ Mostra quais estão faltando

### 6. **.gitignore (melhorado)**
   - ✅ Netlify folders
   - ✅ Build artifacts
   - ✅ IDE files

---

## 🚀 PRÓXIMOS PASSOS - POR ORDEM

### 1️⃣ OBTER CHAVE OPENROUTER
```
1. Acesse: https://openrouter.ai/keys
2. Faça login com Google
3. Clique "Create Key"
4. Copie a chave
5. Salve em local seguro
```

### 2️⃣ CRIAR CONTA NETLIFY
```
1. Acesse: https://netlify.com
2. Clique "Sign up"
3. Use GitHub (mais fácil)
4. Autorize acesso ao repositório
```

### 3️⃣ CONECTAR REPOSITÓRIO
```
Netlify Dashboard:
  → "Add new site"
  → "Import an existing project"
  → Selecione GitHub
  → Escolha "RespectPill"
  → Configure:
    Build command: npm run build ✅
    Publish directory: dist ✅
  → Clique "Deploy"
```

### 4️⃣ ADICIONAR VARIÁVEIS DE AMBIENTE
```
Netlify Dashboard → Site Settings → Environment:

VITE_FIREBASE_API_KEY = [sua chave Firebase]
VITE_FIREBASE_AUTH_DOMAIN = respect-pill.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = respect-pill
VITE_FIREBASE_STORAGE_BUCKET = respect-pill.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = [seu ID]
VITE_FIREBASE_APP_ID = [seu app ID]
VITE_OPENROUTER_API_KEY = [chave obtida no passo 1]
VITE_SITE_URL = https://[seu-site].netlify.app
VITE_STRIPE_PUBLISHABLE_KEY = [opcional]
```

### 5️⃣ FAZER PUSH PARA GITHUB
```bash
# Já feito! ✅
# Netlify começará o build automaticamente
```

### 6️⃣ AGUARDAR BUILD
```
Netlify irá:
1. Fazer git pull do seu repositório
2. Executar: npm install
3. Executar: npm run build
4. Fazer deploy da pasta dist
5. Gerar URL: https://[seu-site].netlify.app
```

---

## 🤖 QUAL IA ESTÁ SENDO USADA?

**Arquivo:** `src/lib/ai.ts` (linha 16)

```typescript
const AI_MODEL = "google/gemini-2.0-flash-lite-preview-02-05:free";
```

### Características:
- ✅ Google Gemini 2.0 Flash
- ✅ Gratuito (Free tier)
- ✅ Rápido (~2-3 segundos)
- ✅ Qualidade: ⭐⭐⭐⭐

### Para trocar de IA:
1. Edite `src/lib/ai.ts` linha 16
2. Cole novo modelo (ex: `"meta-llama/llama-2-70b-chat:free"`)
3. Commit e push
4. Netlify fará rebuild automaticamente

**Mais detalhes:** Veja `OPENROUTER_CONFIG.md`

---

## 🔐 VARIÁVEIS SENSÍVEIS

⚠️ **NUNCA commite um arquivo `.env` com valores reais!**

Variáveis seguras:
- ✅ Sempre use `VITE_` prefix
- ✅ Configuradas no Netlify Dashboard
- ✅ Não aparecem no código
- ✅ Seguras para produção

---

## ✨ ESTRUTURA DO PROJETO

```
RespectPill/
├── netlify.toml              ← Config de build
├── NETLIFY_DEPLOY.md         ← Como fazer deploy
├── OPENROUTER_CONFIG.md      ← IA configuration
├── .env.example              ← Template de variáveis
├── scripts/check-env.sh      ← Verificar environment
├── src/
│   ├── lib/
│   │   └── ai.ts             ← IA integration
│   ├── pages/
│   ├── components/
│   └── stores/
├── package.json              ← Build commands ✅
├── vite.config.ts            ← Vite config ✅
└── tsconfig.json             ← TypeScript ✅
```

---

## 📊 CHECKLIST FINAL

- [ ] Obter chave OpenRouter
- [ ] Criar conta Netlify
- [ ] Conectar GitHub ao Netlify
- [ ] Adicionar variáveis de ambiente
- [ ] Fazer primeiro deploy
- [ ] Testar login com Google
- [ ] Testar geração de dieta/treino
- [ ] Configurar domínio customizado (opcional)

---

## 🎯 RESUMO RÁPIDO

| Passo | Ação | Tempo |
|-------|------|-------|
| 1 | Obter chave OpenRouter | 2 min |
| 2 | Criar conta Netlify | 3 min |
| 3 | Conectar GitHub | 5 min |
| 4 | Adicionar variáveis | 3 min |
| 5 | Deploy automático | ~2-3 min |
| **TOTAL** | **Deploy pronto** | **~15 min** ⚡ |

---

## 📚 DOCUMENTAÇÃO

- **NETLIFY_DEPLOY.md** - Guia passo-a-passo (você está aqui!)
- **OPENROUTER_CONFIG.md** - Como configurar a IA
- **README.md** - Overview do projeto
- **AI_RULES.md** - Regras de IA da aplicação

---

## 🆘 PRECISA DE AJUDA?

1. Verifique `NETLIFY_DEPLOY.md` - seção "Solução de Problemas"
2. Verifique `OPENROUTER_CONFIG.md` - seção "Troubleshooting"
3. Veja os logs no Netlify Dashboard → Deploys

---

**Status:** ✅ Pronto para deploy

Qualquer dúvida? Consulte os arquivos markdown criados! 🚀
