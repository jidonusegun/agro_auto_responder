import pg from 'pg';
import { env } from './config/env.js';
const url = new URL(env.databaseUrl);

console.log({
  protocol: url.protocol,
  username: url.username,
  passwordExists: !!url.password,
  hostname: url.hostname,
  database: url.pathname,
});

export const pool = new pg.Pool({ connectionString: env.databaseUrl });
