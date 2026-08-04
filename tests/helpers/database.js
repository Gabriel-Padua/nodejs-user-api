import pool from "../../src/database/pool.js";

export async function clearDatabase() {
  await pool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE;");
}

export async function closeDatabase() {
  await pool.end();
}
