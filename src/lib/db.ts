import Database from "better-sqlite3";
import { join } from "path";

const dbPath = join(process.cwd(), "database.db");
const db = new Database(dbPath);

// Initialize tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS Student (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    projectTitle TEXT,
    contact TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS PageRecord (
    id TEXT PRIMARY KEY,
    studentId TEXT NOT NULL,
    studentName TEXT,
    date DATETIME NOT NULL,
    pagesEdited INTEGER NOT NULL,
    notes TEXT,
    pdfUrl TEXT,
    pdfName TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES Student(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS Payment (
    id TEXT PRIMARY KEY,
    studentId TEXT NOT NULL,
    studentName TEXT,
    amountPaid REAL NOT NULL,
    date DATETIME NOT NULL,
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES Student(id) ON DELETE CASCADE
  );
`);

export default db;
