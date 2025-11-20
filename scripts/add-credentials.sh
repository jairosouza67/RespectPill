#!/bin/bash
# Script para adicionar credenciais de forma segura
# Use: bash add-credentials.sh

echo "🔐 Adicionando credenciais de forma segura..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Array de variáveis necessárias
VARS=(
  "VITE_FIREBASE_API_KEY"
  "VITE_FIREBASE_AUTH_DOMAIN"
  "VITE_FIREBASE_PROJECT_ID"
  "VITE_FIREBASE_STORAGE_BUCKET"
  "VITE_FIREBASE_MESSAGING_SENDER_ID"
  "VITE_FIREBASE_APP_ID"
  "VITE_OPENROUTER_API_KEY"
  "VITE_STRIPE_PUBLISHABLE_KEY"
)

# Ler arquivo .env.local existente
if [ -f ".env.local" ]; then
  source .env.local
  echo "✅ Arquivo .env.local existente carregado"
else
  echo "📝 Criando novo arquivo .env.local"
  touch .env.local
fi

echo ""
echo -e "${BLUE}Digite suas credenciais (deixe em branco se não tiver):${NC}"
echo ""

# Para cada variável
for var in "${VARS[@]}"; do
  read -p "Enter $var: " value
  
  if [ -n "$value" ]; then
    # Remover linha antiga se existir
    sed -i "/^$var=/d" .env.local
    # Adicionar nova linha
    echo "$var=$value" >> .env.local
    echo -e "${GREEN}✅ $var adicionada${NC}"
  fi
done

echo ""
echo -e "${GREEN}✅ Credenciais adicionadas ao .env.local${NC}"
echo "📝 Arquivo salvo: .env.local"
echo "🔒 Lembre-se: Este arquivo NÃO será commitado"
echo ""
echo "🚀 Pronto para desenvolvimento!"
