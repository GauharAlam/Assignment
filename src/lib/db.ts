import mysql from 'mysql2/promise';

/**
 * Creates and exports a MySQL connection pool.
 * Uses environment variables for configuration with sensible defaults.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mini_task_board',
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
