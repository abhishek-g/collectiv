import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

// Parse MySQL URL if provided (Railway often provides MYSQL_URL with public hostname)
function parseMysqlUrl(url: string | undefined): Partial<{ host: string; port: number; user: string; password: string; database: string }> | null {
  if (!url) return null;

  try {
    // Format: mysql://user:password@host:port/database
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parsed.port ? parseInt(parsed.port, 10) : 3306,
      user: parsed.username,
      password: parsed.password,
      database: parsed.pathname.slice(1), // Remove leading '/'
    };
  } catch {
    return null;
  }
}

// Get database config, prioritizing MYSQL_URL (which has public hostname)
const mysqlUrlConfig = parseMysqlUrl(process.env['MYSQL_URL']);

const dbConfig = {
  host: mysqlUrlConfig?.host ||
    process.env['DB_HOST'] ||
    (() => {
      // Check MYSQLHOST but reject internal hostnames
      const mysqlHost = process.env['MYSQLHOST'] || process.env['MYSQL_HOST'];
      if (mysqlHost && !mysqlHost.includes('.railway.internal') && !mysqlHost.includes('.internal')) {
        return mysqlHost;
      }
      return 'localhost';
    })(),
  port: mysqlUrlConfig?.port ||
    parseInt(
      process.env['DB_PORT'] ||
      process.env['MYSQLPORT'] ||
      process.env['MYSQL_PORT'] ||
      '3306',
      10
    ),
  user: mysqlUrlConfig?.user ||
    process.env['DB_USER'] ||
    process.env['MYSQLUSER'] ||
    process.env['MYSQL_USER'] ||
    'root',
  password: mysqlUrlConfig?.password ||
    process.env['DB_PASSWORD'] ||
    process.env['MYSQLPASSWORD'] ||
    process.env['MYSQL_PASSWORD'] ||
    'Root@123',
  database: mysqlUrlConfig?.database ||
    process.env['DB_NAME'] ||
    process.env['MYSQLDATABASE'] ||
    process.env['MYSQL_DATABASE'] ||
    'user_service_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
export const pool = mysql.createPool(dbConfig);

// Test database connection
export async function testConnection(): Promise<void> {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

// Create database if it doesn't exist
export async function createDatabaseIfNotExists(): Promise<void> {
  const tempConfig = {
    ...dbConfig,
    database: undefined, // Connect without database first
  };
  const tempPool = mysql.createPool(tempConfig);

  try {
    await tempPool.execute(
      `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✅ Database '${dbConfig.database}' ready`);
  } catch (error) {
    console.error('❌ Failed to create database:', error);
    throw error;
  } finally {
    await tempPool.end();
  }
}

export default pool;

