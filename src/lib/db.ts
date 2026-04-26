import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query(sql: string, params: any[] = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// Helper for single results
export async function getOne(sql: string, params: any[] = []) {
  const rows: any = await query(sql, params);
  return rows[0] || null;
}

export default pool;

/**
 * INITIALIZATION SCRIPT (Run this once in your cPanel PHPMyAdmin)
 * 
 * CREATE TABLE IF NOT EXISTS Student (
 *   id VARCHAR(255) PRIMARY KEY,
 *   name VARCHAR(255) NOT NULL,
 *   thesisTitle VARCHAR(255),
 *   contact VARCHAR(255),
 *   createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
 * );
 * 
 * CREATE TABLE IF NOT EXISTS PageRecord (
 *   id VARCHAR(255) PRIMARY KEY,
 *   studentId VARCHAR(255),
 *   studentName VARCHAR(255),
 *   date DATE,
 *   pagesEdited INT,
 *   notes TEXT,
 *   pdfUrl TEXT,
 *   pdfName TEXT,
 *   createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
 *   FOREIGN KEY (studentId) REFERENCES Student(id) ON DELETE CASCADE
 * );
 * 
 * CREATE TABLE IF NOT EXISTS Payment (
 *   id VARCHAR(255) PRIMARY KEY,
 *   studentId VARCHAR(255),
 *   studentName VARCHAR(255),
 *   amountPaid DECIMAL(10, 2),
 *   date DATE,
 *   notes TEXT,
 *   createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
 *   FOREIGN KEY (studentId) REFERENCES Student(id) ON DELETE CASCADE
 * );
 */
