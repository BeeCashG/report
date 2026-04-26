import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || "3306"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false, // Allows connection even if SSL cert is self-signed/missing
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
      errno: error.errno,
      sqlState: error.sqlState,
      sql: sql
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
