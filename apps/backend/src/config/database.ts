import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Root@123',
  database: process.env.DB_NAME || 'user_service_db',
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
    const [result] = await tempPool.execute(
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

