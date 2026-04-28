const mysql = require("mysql2/promise");

async function run() {
  console.log("Connecting to TiDB Cloud...");
  try {
    const connection = await mysql.createConnection({
      host: "gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com",
      port: 4000,
      user: "dHJmwMfHoReUXL3.root",
      password: "EF6EHaUfAbGD1wL1",
      database: "test", // TiDB default database
      ssl: {
        rejectUnauthorized: true
      }
    });

    console.log("Connected successfully! Creating tables...");

    const schema = `
    CREATE TABLE IF NOT EXISTS Student (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(20),
      course VARCHAR(255) NOT NULL,
      total_fee DECIMAL(10,2) NOT NULL,
      paid_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS PaymentRecord (
      id VARCHAR(255) PRIMARY KEY,
      student_id VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES Student(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS WorkRecord (
      id VARCHAR(255) PRIMARY KEY,
      student_id VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      description TEXT NOT NULL,
      file_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES Student(id) ON DELETE CASCADE
    );
    `;

    const queries = schema.split(';').filter(q => q.trim().length > 0);
    for (let q of queries) {
        console.log("Running query...");
        await connection.query(q);
    }

    console.log("✅ Tables created successfully!");
    await connection.end();
  } catch (error) {
    console.error("❌ Setup failed:", error);
  }
}

run();
