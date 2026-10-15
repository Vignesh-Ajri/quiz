# ─── Backend Dockerfile ───────────────────────────────────────────────────────
# Multi-stage build: builder stage installs devDependencies and prunes them,
# production stage copies only what's needed for a lean image.

# Stage 1: Builder — install all deps
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps separately for layer caching efficiency
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Stage 2: Production runner
FROM node:20-alpine AS runner

# Security: run as non-root user
RUN addgroup -S questly && adduser -S questly -G questly

WORKDIR /app

# Copy only production deps from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application source
COPY . .

# Remove any local .env that might exist — env vars come from docker-compose or K8s secrets
RUN rm -f .env

USER questly

EXPOSE 5000

# Use node directly instead of nodemon in production
CMD ["node", "server.js"]
