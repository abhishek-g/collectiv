#!/usr/bin/env node
/**
 * Bundle API function with esbuild to resolve TypeScript path aliases
 * This script bundles api/index.ts into api/index.js with all path aliases resolved
 * Outputs directly to api/ directory so Vercel can detect it as a serverless function
 */

const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const apiDir = path.join(rootDir, 'api');
// Output directly to api/ directory so Vercel can find it
const outputFile = path.join(apiDir, 'index.js');

// Ensure api directory exists
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

console.log('📦 Bundling API function with esbuild...');
console.log(`   Entry: ${path.join(apiDir, 'index.ts')}`);
console.log(`   Output: ${outputFile}`);

esbuild
  .build({
    entryPoints: [path.join(apiDir, 'index.ts')],
    bundle: true,
    platform: 'node',
    target: 'node20',
    format: 'cjs', // CommonJS for better Vercel compatibility
    outfile: outputFile,
    // External dependencies that should not be bundled (provided by Vercel runtime)
    external: [
      'express',
      'cors',
      'dotenv',
      'mysql2',
      'bcrypt',
      'jsonwebtoken',
      'multer',
      'path',
      'fs',
      'crypto',
    ],
    // Resolve path aliases using tsconfig paths
    alias: {
      '@nx-angular-express/shared': path.join(rootDir, 'libs/shared/src/index.ts'),
      '@nx-angular-express/user-service': path.join(rootDir, 'libs/be/user-service/src/index.ts'),
      '@nx-angular-express/shared-components': path.join(rootDir, 'libs/fe/shared-components/src/index.ts'),
      '@nx-angular-express/community-service': path.join(rootDir, 'libs/be/community-service/src/index.ts'),
      '@nx-angular-express/profile': path.join(rootDir, 'libs/fe/profile/src/index.ts'),
    },
    tsconfig: path.join(apiDir, 'tsconfig.json'),
    logLevel: 'info',
    minify: false, // Keep readable for debugging
    sourcemap: true,
  })
  .then(() => {
    console.log('✅ API function bundled successfully');
  })
  .catch((error) => {
    console.error('❌ Failed to bundle API function:', error);
    process.exit(1);
  });

