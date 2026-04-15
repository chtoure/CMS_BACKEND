# --- ÉTAPE 1 : BUILDER (L'usine) ---
FROM node:20-alpine AS builder

# Nécessaire pour les dépendances natives (bcrypt/sharp) et Prisma
RUN apk add --no-cache python3 make g++ openssl

WORKDIR /app

# Optimisation du cache Docker
COPY package*.json ./
COPY prisma ./prisma/

# On installe TOUT (devDeps incluses pour tsup et typescript)
RUN npm install

# Génération du client Prisma (génère le dossier .prisma)
RUN npx prisma generate

# Copie du code source
COPY . .

# Build avec tsup (génère dist/index.js au format ESM)
RUN npm run build

# --- ÉTAPE 2 : RUNNER (Le produit fini) ---
FROM node:20-alpine AS runner

# Openssl est requis par Prisma pour lire SQLite
RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

# On ne copie que le nécessaire
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Installation des dépendances de PROD uniquement
# (Réinstalle bcrypt/sharp pour Linux Alpine proprement)
RUN npm install --only=production

# Création du dossier pour ta base SQLite
RUN mkdir -p /app/data

EXPOSE 3000

# Lancement : 
# 1. On déploie les migrations sur le fichier SQLite
# 2. On démarre le serveur (dist/index.js via node)
CMD npx prisma migrate deploy && node dist/index.js