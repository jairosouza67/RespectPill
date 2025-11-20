# 🔐 INSTRUÇÕES PARA ADICIONAR CREDENCIAIS SEGURAS

## ⚠️ IMPORTANTE - LEIA PRIMEIRO

Este arquivo `.env.local` é:
- ✅ **LOCAL** - Apenas no seu computador
- ✅ **IGNORADO** - Nunca será commitado ao git
- ✅ **SEGURO** - Suas credenciais privadas ficarão aqui
- ✅ **PROTEGIDO** - Está no `.gitignore`

## 📋 CREDENCIAIS QUE VOCÊ PRECISA ENVIAR

Por favor, envie as seguintes informações:

### 1️⃣ Firebase Credentials
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```
**Onde encontrar:** Firebase Console → Project Settings

### 2️⃣ OpenRouter API Key
```
VITE_OPENROUTER_API_KEY=
```
**Onde encontrar:** https://openrouter.ai/keys

### 3️⃣ Stripe (Opcional)
```
VITE_STRIPE_PUBLISHABLE_KEY=
```
**Onde encontrar:** Stripe Dashboard → API Keys

---

## 🔒 COMO ENVIAR COM SEGURANÇA

### ❌ NÃO FAÇA ISSO:
- ❌ Não envie pelo chat
- ❌ Não copie/cole em mensagens públicas
- ❌ Não faça commit dessas credenciais
- ❌ Não compartilhe o `.env` arquivo

### ✅ OPÇÕES SEGURAS:

**Opção 1: Arquivo Criptografado**
```bash
# Zipar com senha
# Enviar o arquivo para você adicionar
```

**Opção 2: Mensagem Privada**
- Envie cada chave individualmente
- Ou em grupos pequenos

**Opção 3: Ambiente de Staging**
- Configure direto no Netlify
- (Recomendado para produção)

---

## 📝 FORMATO ESPERADO

Quando você enviar, preciso de:

```
VITE_FIREBASE_API_KEY=AIzaSyD9bcS...
VITE_FIREBASE_AUTH_DOMAIN=respect-pill.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=respect-pill
...
```

---

## ✅ COMO EU ADICIONO

Quando você enviar:

1. Eu coloco as credenciais no `.env.local`
2. O arquivo fica apenas local (não é commitado)
3. Você desenvolve localmente com as credenciais
4. Na Netlify, você configura no dashboard (sem git)

---

## 🚀 FLUXO DE SEGURANÇA

```
Seu Computador Local:
├── .env.local (NÃO commitado) ← Credenciais locais aqui
├── .gitignore (ignore .env) ← Proteção
└── src/lib/firebase.ts ← Lê do .env.local

GitHub:
├── .env.example ← Template público
├── .gitignore ← Protege .env
└── Sem credenciais! ✅

Netlify Dashboard:
└── Environment Variables ← Credenciais de produção aqui
```

---

## 📚 ARQUIVOS RELACIONADOS

- `.env.local` - Suas credenciais (LOCAL, não commitado)
- `.env.example` - Template público (para referência)
- `.gitignore` - Regras de ignorar arquivos
- `src/lib/firebase.ts` - Usa as variáveis do .env

---

**Status:** Pronto para receber suas credenciais! 🔐

Quando estiver pronto, envie as informações acima de forma segura.
