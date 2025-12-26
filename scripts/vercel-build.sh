#!/bin/bash
set -e

echo "🔨 Running Vercel build script..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build backend (for migrations and other assets)
echo "🏗️  Building backend..."
npx nx build backend --configuration=production

# Build frontend
echo "🏗️  Building frontend..."
npx nx build frontend --configuration=production

# Copy migrations to dist
echo "📋 Copying migrations..."
mkdir -p dist/libs/be/user-service/src/lib/database
cp -r libs/be/user-service/src/lib/database/migrations dist/libs/be/user-service/src/lib/database/

# Bundle API function with esbuild to resolve path aliases
echo "📦 Bundling API function..."
node scripts/bundle-api.js

# Copy bundled file to api/ directory for Vercel (Vercel expects functions in api/)
echo "📋 Copying bundled API to api/ directory..."
mkdir -p api
cp dist/api/index.js api/index.js || true
cp dist/api/index.js.map api/index.js.map 2>/dev/null || true

echo "✅ Vercel build completed successfully"

