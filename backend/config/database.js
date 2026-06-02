const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 1433,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableKeepAlive: true,
  },
};

let pool = null;

const connectDB = async () => {
  try {
    pool = await sql.connect(config);
    console.log('✅ Connected to SQL Server successfully');
    return pool;
  } catch (error) {
    console.error('❌ SQL Server Connection Error:', error.message);
    throw error;
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  return pool;
};

const closeDB = async () => {
  if (pool) {
    await pool.close();
    console.log('Database connection closed');
  }
};

module.exports = { connectDB, getPool, closeDB, sql };
