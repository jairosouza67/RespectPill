# Respect Pill - Plataforma de Evolução Masculina 360°

Uma plataforma SaaS completa para evolução masculina, focando em transformação sustentável através de método, comunidade e acompanhamento mensurável.

## 🎯 Visão

Ser a plataforma de referência para evolução masculina responsável: um sistema integrado que promove força física, maturidade emocional e presença social de forma mensurável, privada e escalável.

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Appwrite (BaaS)
- **Estado**: Zustand
- **Estilos**: Tailwind CSS
- **Pagamentos**: Stripe
- **Validação**: React Hook Form + Zod
- **Notificações**: Sonner
- **Ícones**: Lucide React

## 📋 Pré-requisitos

- Node.js 18+
- Appwrite Cloud ou self-hosted
- Stripe account (para pagamentos)

## 🔧 Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/respect-pill.git
cd respect-pill
```

### 2. Instale as dependências
```bash
pnpm install
```

### 3. Configure as variáveis de ambiente
Copie `.env.example` para `.env` e configure:

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id

# Collections
VITE_APPWRITE_USERS_COLLECTION_ID=users
VITE_APPWRITE_PROFILES_COLLECTION_ID=profiles
VITE_APPWRITE_PLANS_COLLECTION_ID=plans
VITE_APPWRITE_TRACKERS_COLLECTION_ID=trackers
VITE_APPWRITE_CONTENT_COLLECTION_ID=content
VITE_APPWRITE_POSTS_COLLECTION_ID=posts
VITE_APPWRITE_COMMENTS_COLLECTION_ID=comments
VITE_APPWRITE_PAYMENTS_COLLECTION_ID=payments
VITE_APPWRITE_REPORTS_COLLECTION_ID=reports

# Storage
VITE_APPWRITE_BUCKET_ID=storage-bucket-id

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

### 4. Configure o Appwrite

Crie um projeto no Appwrite e configure as coleções conforme o schema em `docs/database-schema.md`.

### 5. Execute o projeto
```bash
pnpm dev
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Layout.tsx      # Layout principal
│   └── OnboardingWizard.tsx  # Wizard de onboarding
├── pages/              # Páginas da aplicação
│   ├── Dashboard.tsx   # Dashboard principal
│   ├── Login.tsx       # Página de login
│   ├── Register.tsx    # Página de registro
│   ├── LearningPaths.tsx # Trilhas de aprendizado
│   └── Pricing.tsx     # Página de preços
├── stores/             # Estado global (Zustand)
│   ├── authStore.ts    # Autenticação
│   └── trackerStore.ts # Trackers e planos
├── lib/                # Configurações e utilitários
│   └── appwrite.ts     # Configuração Appwrite
└── utils/              # Funções utilitárias
```

## 🎯 Funcionalidades

### ✅ MVP Completo
- [x] Autenticação com Appwrite
- [x] Onboarding multi-etapas com formulários
- [x] Dashboard com visualização de progresso
- [x] Sistema de trackers (treino, sono, leitura, etc.)
- [x] Geração de planos personalizados de 90 dias
- [x] Trilhas de aprendizado com conteúdo estruturado
- [x] Integração com Stripe para pagamentos
- [x] Sistema de comunidade (estrutura base)
- [x] Moderação de conteúdo (estrutura base)
- [x] Exportação de dados (CSV/JSON)

### 🔄 Em Desenvolvimento
- [ ] IA para geração de dietas personalizadas
- [ ] Parser de PDFs de treino
- [ ] Análise de postura por vídeo
- [ ] Integração com wearables
- [ ] Moderação automática por ML

## 🛡️ Segurança e Compliance

- **LGPD/GDPR**: Consentimentos explícitos e direito ao esquecimento
- **Age-gate**: Verificação de idade para conteúdo sensível
- **Criptografia**: Dados sensíveis criptografados em repouso e trânsito
- **Auditoria**: Logs de ações importantes
- **Rate limiting**: Proteção contra abuso

## 📊 Métricas e KPIs

- Conversão onboarding → plano ativo: ≥ 25%
- Retenção 30/60/90 dias: DAU/MAU > 20%
- Progresso em trilhas: 40% mantêm ≥3 trackers por 60 dias
- NPS: Objetivo > 50

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Configure as variáveis de ambiente no painel da Vercel
vercel --prod
```

### Build manual
```bash
pnpm build
# Deploy da pasta dist para seu servidor
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, envie email para: suporte@respectpill.com ou acesse nossa comunidade.

---

**Respect Pill** - Evolução contínua. Respeito por si, pelos outros. 🚀