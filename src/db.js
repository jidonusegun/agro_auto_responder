import pg from 'pg';
import { env } from './config/env.js';
const url = new URL(env.databaseUrl);

export const pool = new pg.Pool({ connectionString: env.databaseUrl, ssl: { rejectUnauthorized: false } });
