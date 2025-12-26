/**
 * Vercel Serverless Function Entry Point
 * This file wraps the Express app for Vercel's serverless environment
 * 
 * For Vercel, we recreate the Express app here since the backend
 * is bundled into a single main.js file
 */

import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import path from 'path';
import { createDatabaseIfNotExists, testConnection, runMigrations } from '@nx-angular-express/user-service';
// Import routes - Vercel will compile TypeScript, so we import from source
// The controller uses path aliases which will be resolved by Vercel's TypeScript compiler
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
      await createDatabaseIfNotExists();
      await runMigrations();
      await testConnection();
      dbInitialized = true;
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Database initialization error:', error);
      // Don't throw - allow function to continue
      // Database might be external or already initialized
    }
  }
}

// Initialize database before handling requests
app.use(async (req, res, next) => {
  await initializeDatabase();
  next();
});

// Export the Express app as a serverless function
export default app;
