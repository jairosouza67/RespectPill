#!/bin/bash
# Script para verificar variáveis de ambiente antes do deploy

echo "🔍 Verificando variáveis de ambiente..."
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variáveis obrigatórias
REQUIRED_VARS=(
  "VITE_FIREBASE_API_KEY"
  "VITE_FIREBASE_AUTH_DOMAIN"
  "VITE_FIREBASE_PROJECT_ID"
  "VITE_FIREBASE_STORAGE_BUCKET"
  "VITE_FIREBASE_MESSAGING_SENDER_ID"
  "VITE_FIREBASE_APP_ID"
  "VITE_OPENROUTER_API_KEY"
)

# Variáveis opcionais
OPTIONAL_VARS=(
  "VITE_STRIPE_PUBLISHABLE_KEY"
  "VITE_SITE_URL"
)

missing=0

echo -e "${YELLOW}📋 Variáveis Obrigatórias:${NC}"
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo -e "${RED}❌ $var${NC}"
    missing=$((missing + 1))
  else
    echo -e "${GREEN}✅ $var${NC}"
  fi
done

echo ""
echo -e "${YELLOW}📋 Variáveis Opcionais:${NC}"
for var in "${OPTIONAL_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo -e "${YELLOW}⚠️  $var (opcional)${NC}"
  else
    echo -e "${GREEN}✅ $var${NC}"
  fi
done

echo ""
if [ $missing -eq 0 ]; then
  echo -e "${GREEN}✅ Todas as variáveis obrigatórias estão configuradas!${NC}"
  echo ""
  echo "🚀 Pronto para deploy. Execute:"
  echo "   npm run build"
  echo "   netlify deploy --prod"
  exit 0
else
  echo -e "${RED}❌ Faltam $missing variáveis obrigatórias!${NC}"
  echo ""
  echo "📖 Configure as variáveis em:"
  echo "   Netlify Dashboard → Site Settings → Build & Deploy → Environment"
  exit 1
fi
