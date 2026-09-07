import { pool } from '../db.js';

// Protect these routes with your normal staff authentication before exposing them publicly.
export async function listFlows(_req, res, next) {
  try { const { rows } = await pool.query('SELECT id, name, definition, is_active, updated_at FROM flow_definitions ORDER BY name'); res.json(rows); } catch (error) { next(error); }
}

export async function upsertFlow(req, res, next) {
  try {
    const { id } = req.params;
    const { name, definition, isActive = true } = req.body;
    if (!name || !definition?.startStepId || !definition?.steps) return res.status(400).json({ error: 'name, definition.startStepId, and definition.steps are required' });
    const normalized = { ...definition, id };
    const { rows } = await pool.query(
      `INSERT INTO flow_definitions (id, name, definition, is_active) VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, definition = EXCLUDED.definition, is_active = EXCLUDED.is_active, updated_at = NOW()
       RETURNING id, name, definition, is_active, updated_at`, [id, name, JSON.stringify(normalized), isActive]
    );
    res.status(200).json(rows[0]);
  } catch (error) { next(error); }
}
