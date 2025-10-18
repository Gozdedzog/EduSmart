# EduSmart Web - Professional Multi-stage Dockerfile
# Multi-architecture support
FROM --platform=$BUILDPLATFORM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable pnpm
RUN corepack enable pnpm

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN pnpm i --no-frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
ENV NEXT_TELEMETRY_DISABLED 1

# Supabase Build Arguments
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY

# Supabase Environment Variables (with build args)
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY

# Production Supabase Configuration (always set)
ENV NEXT_PUBLIC_SUPABASE_URL=https://pflzydaowmnoplnvcbsl.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmbHp5ZGFvd21ub3BsbnZjYnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3Mjk4NTQsImV4cCI6MjA3NjMwNTg1NH0.vOPdvPZG7nBMg7uh1ge4QBEupZzO6RdQvagfAsrr0T0
ENV SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmbHp5ZGFvd21ub3BsbnZjYnNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDcyOTg1NCwiZXhwIjoyMDc2MzA1ODU0fQ.WrDHXRqUoSFNk83wEZHiTDxzIbLDBflah3T7TLDpLbY

# Admin Configuration
ENV ADMIN_EMAILS=gozdeatila9@gmail.com

# API Configuration
ENV NEXT_PUBLIC_ML_API_URL=https://api.edusmart.tr
ENV NEXT_PUBLIC_APP_URL=https://edusmart.tr

# Build the application
RUN corepack enable pnpm && pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Supabase Build Arguments
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY

# Supabase Environment Variables (with build args)
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY

# Production Supabase Configuration (always set)
ENV NEXT_PUBLIC_SUPABASE_URL=https://pflzydaowmnoplnvcbsl.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmbHp5ZGFvd21ub3BsbnZjYnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3Mjk4NTQsImV4cCI6MjA3NjMwNTg1NH0.vOPdvPZG7nBMg7uh1ge4QBEupZzO6RdQvagfAsrr0T0
ENV SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmbHp5ZGFvd21ub3BsbnZjYnNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDcyOTg1NCwiZXhwIjoyMDc2MzA1ODU0fQ.WrDHXRqUoSFNk83wEZHiTDxzIbLDBflah3T7TLDpLbY

# Admin Configuration
ENV ADMIN_EMAILS=gozdeatila9@gmail.com

# API Configuration
ENV NEXT_PUBLIC_ML_API_URL=https://api.edusmart.tr
ENV NEXT_PUBLIC_APP_URL=https://edusmart.tr

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public

# Copy data files for API endpoints to the correct path
COPY --from=builder /app/data ./data

# Create symlink for API routes to access data
RUN ln -s /app/data /data

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create data directory for persistent storage
RUN mkdir -p data && chown nextjs:nodejs data

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# server.js is created by next build from the standalone output
CMD ["node", "server.js"]