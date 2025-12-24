/**
 * User Microservice Backend
 */

import express from 'express';
import * as path from 'path';
import dotenv from 'dotenv';
import { createDatabaseIfNotExists, testConnection, runMigrations } from '@nx-angular-express/user-service';
import userRoutes from './routes/user.routes';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Health check endpoint
app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to User Microservice API!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'user-microservice' });
});

// User routes
app.use('/api/users', userRoutes);

// Initialize database and start server
async function startServer() {
  try {
    // Create database if it doesn't exist
    await createDatabaseIfNotExists();

    // Run migrations
    await runMigrations();

    // Test database connection
    await testConnection();

    // Start server
    const port = process.env.PORT || 3333;
    const server = app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
      console.log(`📚 API Documentation:`);
      console.log(`   POST   /api/users        - Create user`);
      console.log(`   GET    /api/users        - List users`);
      console.log(`   GET    /api/users/:id     - Get user by ID`);
      console.log(`   GET    /api/users/profile - Get my profile`);
      console.log(`   PUT    /api/users/:id    - Update user`);
      console.log(`   DELETE /api/users/:id    - Archive user`);
      console.log(`   POST   /api/users/login  - Login`);
      console.log(`   POST   /api/users/signout - Signout`);
    });

    server.on('error', console.error);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
