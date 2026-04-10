# ─────────────────────────────────────────────────────────────────────────────
# Multi-stage Dockerfile для Инфологистик-24
# Результат: ~150 MB вместо ~500 MB (Nixpacks)
# Использует Next.js standalone output для минимального размера
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: base ────────────────────────────────────────────────────────────
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

# ── Stage 2: deps ────────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app

# Копируем файлы зависимостей для кэширования
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/

RUN pnpm install --frozen-lockfile --prefer-offline

# ── Stage 3: builder ────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules

# Копируем исходный код
COPY . .

# Переменные среды для билда (не содержат секретов)
ARG NEXT_PUBLIC_APP_URL=https://infolog24.ru
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Билдим через turbo (собирает shared → web)
RUN pnpm build

# ── Stage 4: runner ──────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Безопасность: не-root пользователь + wget для healthcheck
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    apk add --no-cache wget

# Копируем только то, что нужно для запуска
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000

# Healthcheck для мониторинга (увеличен start-period для первого деплоя)
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "apps/web/server.js"]
