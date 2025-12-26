import pool from '../config/database';
import * as fs from 'fs';
import * as path from 'path';

async function runMigrations(): Promise<void> {
  // Find migrations directory - try multiple possible locations
  // Works in development, production builds, and Vercel serverless
  const workspaceRoot = process.cwd();

  // In Vercel, the function runs from the repo root, but files might be in different locations
  // Also try relative to __dirname (where this file is located)
  const currentFileDir = __dirname;

  const possiblePaths = [
    // Vercel serverless (files copied to dist/ by build script)
    path.join(workspaceRoot, 'dist/backend/src/services/user-service/database/migrations'),
    // Relative to current file location (works in bundled scenarios)
    path.join(currentFileDir, 'migrations'),
    path.join(path.dirname(currentFileDir), 'migrations'),
    // Development and local builds
    path.join(workspaceRoot, 'apps/backend/src/services/user-service/database/migrations'),
    // Fallback: try from api/ directory (Vercel serverless root)
    path.join(workspaceRoot, 'apps/backend/src/services/user-service/database/migrations'),
  ];

  let migrationsDir: string | null = null;
  for (const possiblePath of possiblePaths) {
    const normalizedPath = path.normalize(possiblePath);
    if (fs.existsSync(normalizedPath)) {
      migrationsDir = normalizedPath;
      console.log(`📁 Found migrations directory: ${migrationsDir}`);
      console.log(`📁 Absolute path: ${path.resolve(migrationsDir)}`);
      break;
    }
  }

  if (!migrationsDir) {
    console.error(`❌ Migrations directory not found. Tried paths:`, possiblePaths);
    console.error(`❌ Current working directory: ${workspaceRoot}`);
    console.error(`❌ Current file directory: ${currentFileDir}`);
    // List what's actually in dist/backend if it exists
    const distBackendPath = path.join(workspaceRoot, 'dist/backend');
    if (fs.existsSync(distBackendPath)) {
      console.error(`❌ Contents of dist/backend:`, fs.readdirSync(distBackendPath, { recursive: true }));
    }
    throw new Error(`Migrations directory not found. CWD: ${workspaceRoot}, __dirname: ${currentFileDir}`);
  }

  const files = fs.readdirSync(migrationsDir).sort();
  const sqlFiles = files.filter(f => f.endsWith('.sql'));

  console.log(`🔄 Running ${sqlFiles.length} database migration(s)...`);
  console.log(`📋 Migration files: ${sqlFiles.join(', ')}`);

  for (const file of sqlFiles) {
    const migrationPath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log(`🔄 Executing migration: ${file}`);

    try {
      await pool.query(sql);
      console.log(`✅ Migration ${file} completed successfully`);
    } catch (error: unknown) {
      const mysqlError = error as { code?: string; message?: string; errno?: number; sqlState?: string; sqlMessage?: string };

      // Ignore "Table already exists" errors (migration already applied)
      if (mysqlError.code === 'ER_TABLE_EXISTS_ERROR') {
        console.log(`⏭️  Migration ${file} already applied (table exists)`);
        continue;
      }

      // Log full error details for debugging
      console.error(`❌ Migration ${file} failed:`, {
        code: mysqlError.code,
        errno: mysqlError.errno,
        sqlState: mysqlError.sqlState,
        message: mysqlError.message,
        sqlMessage: mysqlError.sqlMessage,
      });

      // Re-throw to stop migration process
      throw error;
    }
  }

  console.log('✅ All migrations completed successfully');
}

export default runMigrations;

