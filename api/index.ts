/**
 * Vercel Serverless Function Entry Point
 * This file wraps the Express app for Vercel's serverless environment
 * 
 * For Vercel, we recreate the Express app here since the backend
 * is bundled into a single main.js file
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createDatabaseIfNotExists, testConnection, runMigrations } from '@nx-angular-express/user-service';

// Import routes and controllers directly from source
// Vercel will compile TypeScript on deployment
import userRoutes from '../apps/backend/src/routes/user.routes';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env['FRONTEND_URL'] || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoints
app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to User Microservice API!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'user-microservice' });
});

// User routes
app.use('/api/users', userRoutes);

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
