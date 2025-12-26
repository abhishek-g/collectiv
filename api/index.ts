/**
 * Vercel Serverless Function Entry Point
 * This file wraps the Express app for Vercel's serverless environment
 *
 * IMPORTANT: This file is bundled by esbuild (via scripts/bundle-api.js) during the build process.
 * The bundled output (api/index.js) resolves all TypeScript path aliases at build time,
 * ensuring they work correctly in Vercel's serverless runtime.
 *
 * Path aliases are resolved via esbuild's alias configuration, not at runtime.
 */

import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import path from 'path';
import { createDatabaseIfNotExists, testConnection, runMigrations } from '@nx-angular-express/user-service';
// Import routes - these will be bundled by esbuild with path aliases resolved
import userRoutes from '../apps/backend/src/routes/user.routes';
import communityRoutes from '../apps/backend/src/routes/community.routes';

// Load environment variables
dotenv.config();

const app = express();

// Middleware - CORS configuration
// When credentials: true, origin cannot be '*', must be specific origins
// For Vercel, frontend and API are on the same domain, so we need to allow the Vercel domain
const getAllowedOrigins = (): string[] => {
  const origins: string[] = [];

  // Add explicit FRONTEND_URL if set
  if (process.env['FRONTEND_URL']) {
    origins.push(process.env['FRONTEND_URL']);
  }

  // Add Vercel URLs (automatically provided by Vercel)
  if (process.env['VERCEL_URL']) {
    origins.push(`https://${process.env['VERCEL_URL']}`);
  }

  // Add preview/branch URLs
  if (process.env['VERCEL_BRANCH_URL']) {
    origins.push(`https://${process.env['VERCEL_BRANCH_URL']}`);
  }

  // In development, allow localhost
  if (process.env['NODE_ENV'] !== 'production') {
    origins.push('http://localhost:4200');
    origins.push('http://localhost:3000');
  }

  return origins;
};

const allowedOrigins = getAllowedOrigins();

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin requests)
    if (!origin) {
      return callback(null, true);
    }

    // If no origins configured, allow all (development only)
    if (allowedOrigins.length === 0) {
      if (process.env['NODE_ENV'] !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS: No allowed origins configured'));
    }

    // Check if origin matches any allowed origin
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // In development, log and allow (for debugging)
      if (process.env['NODE_ENV'] !== 'production') {
        console.log(`CORS: Allowing origin ${origin} (development mode)`);
        callback(null, true);
      } else {
        console.log(`CORS: Rejected origin ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
        callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve uploaded community images (local persistence)
const communityImagesPath = path.join(process.cwd(), 'apps/backend/src/assets/community-images');
app.use('/assets/community-images', express.static(communityImagesPath));

// Health check endpoints
app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to User Microservice API!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'user-microservice' });
});

// User routes
app.use('/api/users', userRoutes);
app.use('/api/communities', communityRoutes);

// Initialize database on cold start (Vercel serverless)
let dbInitialized = false;

async function initializeDatabase() {
  if (!dbInitialized) {
    try {
      console.log('🔄 Starting database initialization...');
      console.log('📊 DB Config:', {
        host: process.env['DB_HOST'] || process.env['MYSQLHOST'] || 'not set',
        port: process.env['DB_PORT'] || process.env['MYSQLPORT'] || 'not set',
        user: process.env['DB_USER'] || process.env['MYSQLUSER'] || 'not set',
        database: process.env['DB_NAME'] || process.env['MYSQLDATABASE'] || 'not set',
      });

      await createDatabaseIfNotExists();
      console.log('✅ Database created/verified');

      await runMigrations();
      console.log('✅ Migrations completed');

      await testConnection();
      console.log('✅ Connection test passed');

      dbInitialized = true;
      console.log('✅ Database initialized successfully');
    } catch (error: unknown) {
      const err = error as { message?: string; code?: string; errno?: number; sqlState?: string; sqlMessage?: string; stack?: string };
      console.error('❌ Database initialization error:', error);
      console.error('❌ Error details:', {
        message: err?.message,
        code: err?.code,
        errno: err?.errno,
        sqlState: err?.sqlState,
        sqlMessage: err?.sqlMessage,
        stack: err?.stack,
      });
      // Re-throw to see the actual error in Vercel logs
      throw error;
    }
  }
}

// Initialize database before handling requests
app.use(async (req, res, next) => {
  try {
    await initializeDatabase();
    next();
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('❌ Failed to initialize database:', error);
    res.status(500).json({
      success: false,
      error: 'Database initialization failed',
      message: err?.message || 'Unknown error',
      statusCode: 500,
    });
  }
});

// Export the Express app as a serverless function
export default app;
