import pool from '../config/database';
import * as fs from 'fs';
import * as path from 'path';

async function runMigrations(): Promise<void> {
  // Find migrations directory - try multiple possible locations
  // Works in development, production builds, and Vercel serverless
  const workspaceRoot = process.cwd();
  const possiblePaths = [
    // Vercel serverless (files in dist/)
    path.join(workspaceRoot, 'dist/libs/be/user-service/src/lib/database/migrations'),
    // Development and local builds
    path.join(workspaceRoot, 'libs/be/user-service/src/lib/database/migrations'),
    // Alternative Vercel path
    path.join(workspaceRoot, 'libs/be/user-service/src/lib/database/migrations'),
  ];

  let migrationsDir: string | null = null;
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      migrationsDir = possiblePath;
      console.log(`📁 Found migrations directory: ${migrationsDir}`);
      break;
    }
  }

  if (!migrationsDir) {
    console.error(`❌ Migrations directory not found. Tried paths:`, possiblePaths);
    console.error(`❌ Current working directory: ${workspaceRoot}`);
    throw new Error(`Migrations directory not found. CWD: ${workspaceRoot}`);
  }

  const files = fs.readdirSync(migrationsDir).sort();

  console.log('🔄 Running database migrations...');

  for (const file of files) {
    if (file.endsWith('.sql')) {
      const migrationPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(migrationPath, 'utf8');

      try {
        await pool.query(sql);
        console.log(`✅ Migration ${file} completed`);
      } catch (error: unknown) {
        // Ignore "Table already exists" errors
        const mysqlError = error as { code?: string; message?: string };
        if (mysqlError.code === 'ER_TABLE_EXISTS_ERROR') {
          console.log(`⏭️  Migration ${file} already applied`);
        } else {
          console.error(`❌ Migration ${file} failed:`, mysqlError.message || 'Unknown error');
          throw error;
        }
      }
    }
  }

  console.log('✅ All migrations completed');
}

export default runMigrations;

