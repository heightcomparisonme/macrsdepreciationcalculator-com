FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Add more Alpine dependencies for native modules (sweph, canvas, sharp, etc.)
RUN apk add --no-cache \
    libc6-compat \
    coreutils \
    python3 \
    make \
    g++ \
    && yarn global add pnpm

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* source.config.ts ./
RUN pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM deps AS builder

WORKDIR /app

# Copy source code
COPY . .

# Disable Next.js telemetry to prevent hanging
ENV NEXT_TELEMETRY_DISABLED=1

# Increase Node.js memory limit for MDX processing
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build-time environment variables with safe defaults
# These prevent the build from hanging when env vars are missing
ENV NEXT_PUBLIC_APP_URL="http://localhost:3000"
ENV NEXT_PUBLIC_APP_NAME="Macrs Depreciation Calculator"
ENV NEXT_PUBLIC_DEFAULT_LOCALE="de"
ENV SKIP_ENV_VALIDATION=1
ENV SKIP_GLOSSARY_BUILD_FETCH=1

# Database URL - use placeholder for build (not needed for static generation)
# Will be overridden at runtime
ENV POSTGRES_URL="postgresql://placeholder:placeholder@placeholder:5432/placeholder"

# Auth placeholder (not needed at build time)
ENV AUTH_SECRET="build-time-placeholder-secret-min-32-chars-long-enough-for-nextauth"

# Additional build-time optimizations to prevent hanging
ENV CI=true
ENV NEXT_PRIVATE_SKIP_SIZE_LIMIT_CHECK=1

# Disable experimental features that might cause issues in Docker
ENV NEXT_PRIVATE_STANDALONE=true

# Build with 20-minute timeout and verbose output
# Run with unbuffered output to see progress in real-time
RUN echo "=== Starting Next.js build ===" && \
    timeout 1200 sh -c 'pnpm build 2>&1 | tee /tmp/build.log' && \
    echo "=== Build completed successfully ===" || \
    (echo "!!! Build timed out after 20 minutes !!!" && cat /tmp/build.log && exit 1)

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir .next && \
    chown nextjs:nodejs .next

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
CMD ["node", "server.js"]
