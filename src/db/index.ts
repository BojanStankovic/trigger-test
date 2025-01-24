import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// const connectionString = process.env.DATABASE_URL!;
// Extract database connection details from the DATABASE_URL
const dbUrl = process.env.DATABASE_URL!;
if (!dbUrl) {
  throw new Error('DATABASE_URL not set');
}

const { host, port, user, password, database } = parseDbUrl(dbUrl);

const pool = new Pool({
  host,
  port: parseInt(port),
  user,
  password,
  database,
  ssl: true,
});

export const db = drizzle(pool);

function parseDbUrl(dbUrl: string) {
  const { username, password, hostname, port, pathname } = new URL(dbUrl);
  const database = pathname.slice(1); // remove leading "/"

  return {
    host: hostname,
    port: port,
    user: username,
    password: password,
    database,
  };
}
