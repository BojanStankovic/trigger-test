import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Client } = pkg;

// Import seed scripts
import { seedUsers } from './src/db/seeds/users';

(async () => {
  // Extract database connection details from the DATABASE_URL
  const dbUrl = process.env.DATABASE_URL!;
  if (!dbUrl) {
    throw new Error('DATABASE_URL not set');
  }

  const { host, port, user, password, database } = parseDbUrl(dbUrl);

  const client = new Client({
    host,
    port: parseInt(port),
    user,
    password,
    database,
    ssl: true,
  });

  const db = drizzle(client);

  try {
    await client.connect();

    console.log('Running Drizzle migrations...');
    await migrate(db, {
      migrationsFolder: './drizzle',
    });
    console.log('Drizzle migrations completed successfully.');

    console.log('Seeding data...');
    await seedUsers(db);
    console.log('Data seeding completed successfully.');

    console.log('Applying database triggers...');
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const sqlFolder = path.join(__dirname, 'db/triggers');
    console.log('SQL Folder Path!!!!!!!!!!!!!!!!!!:', sqlFolder);
    const sqlFolder2 = path.join(process.cwd(), 'src/db/triggers');
    console.log('SQL Folder Path!!!!!!!!!!!!!!!!!!:', sqlFolder2);
    const sqlFiles = fs.readdirSync(sqlFolder).filter((file) => file.endsWith('.sql'));

    for (const file of sqlFiles) {
      const sqlPath = path.join(sqlFolder, file);
      const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
      console.log(`Applying ${file}...`);
      await client.query(sqlContent);
    }
    console.log('Database triggers applied successfully.');

    console.log('Database initialization completed successfully.');
  } catch (err) {
    console.error('Error during database initialization:', err);
  } finally {
    await client.end();
  }
})();

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
