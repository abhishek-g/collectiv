/**
 * Manual migration script for Railway MySQL
 * 
 * Usage:
 * 1. Set Railway MySQL connection details as environment variables:
 *    DB_HOST=your-railway-host
 *    DB_PORT=3306
 *    DB_USER=your-railway-user
 *    DB_PASSWORD=your-railway-password
 *    DB_NAME=your-railway-database
 * 
 * 2. Run: npx tsx scripts/migrate-railway.ts
 * 
 * Or use Railway CLI:
 * railway run --service mysql npx tsx scripts/migrate-railway.ts
 */

import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const dbConfig = {
  host: process.env['DB_HOST'] || process.env['MYSQLHOST'] || 'localhost',
  port: parseInt(process.env['DB_PORT'] || process.env['MYSQLPORT'] || '3306', 10),
  user: process.env['DB_USER'] || process.env['MYSQLUSER'] || 'root',
  password: process.env['DB_PASSWORD'] || process.env['MYSQLPASSWORD'] || '',
  database: process.env['DB_NAME'] || process.env['MYSQLDATABASE'] || 'user_service_db',
};

async function runMigrations(): Promise<void> {
  // Create connection
  const connection = await mysql.createConnection({
    ...dbConfig,
    multipleStatements: true,
  });

  try {
    console.log(`🔌 Connected to MySQL at ${dbConfig.host}:${dbConfig.port}`);
    console.log(`📦 Database: ${dbConfig.database}`);

    // Find migrations directory
    const workspaceRoot = process.cwd();
    const migrationsDir = path.join(
      workspaceRoot,
      'libs/be/user-service/src/lib/database/migrations'
    );

    if (!fs.existsSync(migrationsDir)) {
      throw new Error(`Migrations directory not found: ${migrationsDir}`);
    }

    const files = fs.readdirSync(migrationsDir).sort();
    console.log(`\n🔄 Found ${files.length} migration file(s)\n`);

    for (const file of files) {
      if (file.endsWith('.sql')) {
        const migrationPath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(migrationPath, 'utf8');

        try {
          await connection.query(sql);
          console.log(`✅ Migration ${file} completed`);
        } catch (error: unknown) {
          const mysqlError = error as { code?: string; message?: string; sqlMessage?: string };
          if (mysqlError.code === 'ER_TABLE_EXISTS_ERROR') {
            console.log(`⏭️  Migration ${file} already applied (table exists)`);
          } else {
            console.error(`❌ Migration ${file} failed:`, mysqlError.message || mysqlError.sqlMessage || 'Unknown error');
            throw error;
          }
        }
      }
    }

    console.log('\n✅ All migrations completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigrations();

