# ── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

RUN npx prisma generate

COPY . .

RUN npm run build

# ── Stage 2: production ──────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

# Copia o Prisma Client gerado e o build compilado
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist

# Cria as pastas de upload (serão sobrescritas pelo volume no compose)
RUN mkdir -p files uploads/hero uploads/sliders uploads/quem-somos

EXPOSE 3000

# Roda as migrations pendentes antes de iniciar o servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
