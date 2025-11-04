#!/bin/bash

# Mondkalender Docker Build Script
# Optimized for Dokploy deployment

echo "🚀 Starting Mondkalender build process..."

# Set Node.js memory limit for MDX processing
export NODE_OPTIONS="--max-old-space-size=4096"

# Set build environment
export NODE_ENV=production

echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

echo "🔨 Building application..."
# Build with increased memory and timeout
timeout 1800 pnpm build || {
    echo "❌ Build failed or timed out"
    echo "💡 This might be due to MDX processing requiring more memory"
    echo "💡 Try increasing server memory or using a simpler build"
    exit 1
}

echo "✅ Build completed successfully!"
