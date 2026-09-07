import { pool } from '../db.js';

export async function findOrCreateCustomer(phone, profileName) {
  const { rows } = await pool.query(
    `INSERT INTO customers (phone, profile_name) VALUES ($1, $2)
     ON CONFLICT (phone) DO UPDATE SET profile_name = COALESCE(EXCLUDED.profile_name, customers.profile_name), updated_at = NOW()
     RETURNING *`, [phone, profileName || null]
  );
  return rows[0];
}
