import pool from '../config/database';
import * as fs from 'fs';
import * as path from 'path';

async function runMigrations(): Promise<void> {
  // Find migrations directory relative to workspace root
  // Works in both development and production builds
  const workspaceRoot = process.cwd();
  const migrationsDir = path.join(
    workspaceRoot,
    'libs/be/user-service/src/lib/database/migrations'
  );

  // Check if migrations directory exists
  if (!fs.existsSync(migrationsDir)) {
    console.error(`❌ Migrations directory not found: ${migrationsDir}`);
    throw new Error('Migrations directory not found');
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

