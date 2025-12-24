import pool from '../config/database';
import * as fs from 'fs';
import * as path from 'path';

async function runMigrations(): Promise<void> {
  const migrationsDir = path.join(__dirname, 'migrations');
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

