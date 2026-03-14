import mysql from "mysql2/promise";

const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root123",          // <-- add your MySQL password if any
  database: "infrastructure_reporting_db",
  waitForConnections: true,
  connectionLimit: 10
});

export default db;
