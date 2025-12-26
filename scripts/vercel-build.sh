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

# Copy migrations to dist (from new location in backend app)
echo "📋 Copying migrations..."
mkdir -p dist/backend/src/services/user-service/database
cp -r apps/backend/src/services/user-service/database/migrations dist/backend/src/services/user-service/database/

# Note: api/index.ts is compiled by Vercel automatically
# No bundling needed - we use relative imports instead of path aliases

echo "✅ Vercel build completed successfully"

