# Multi-stage build for SvelteKit (adapter-node) on Cloud Run

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

EXPOSE 8080

CMD ["node", "build"]
