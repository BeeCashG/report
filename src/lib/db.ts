import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: (process.env.DB_HOST || "").trim(),
  user: (process.env.DB_USER || "").trim(),
  password: (process.env.DB_PASSWORD || "").trim(),
  database: (process.env.DB_NAME || "").trim(),
  port: parseInt((process.env.DB_PORT || "3306").trim()),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true,
  },
});

export async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error: any) {
    console.error("❌ DATABASE ERROR:", {
      message: error.message,
      code: error.code,
      hostname: (process.env.DB_HOST || "").trim()
    });
    throw error;
  }
}

export async function getOne(sql: string, params: any[] = []) {
  try {
    const results = await query(sql, params);
    return Array.isArray(results) ? results[0] : null;
  } catch (error) {
    throw error;
  }
}

export default pool;
