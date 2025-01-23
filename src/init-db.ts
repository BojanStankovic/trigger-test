import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

// Import seed scripts
import { seedUsers } from './db/seeds/users';

(async () => {
  // const client = new Client({
  //   connectionString: process.env.DATABASE_URL, // Use your database URL
  // });

  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'admin1234',
    database: 'postgres',
  });

  const db = drizzle(client);

  try {
    // Connect to the database
    await client.connect();

    // Step 1: Run Drizzle migrations
    console.log('Running Drizzle migrations...');
    await migrate(db, {
      migrationsFolder: './drizzle',
    });

    // Step 2: Seed data
    // console.log('Seeding data...');
    await seedUsers(db);

    // Step 3: Apply triggers
    console.log('Applying database triggers...');
    const sqlFolder = path.join(__dirname, 'db/triggers');
    const sqlFiles = fs.readdirSync(sqlFolder).filter((file) => file.endsWith('.sql'));

    for (const file of sqlFiles) {
      const sqlPath = path.join(sqlFolder, file);
      const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
      console.log(`Applying ${file}...`);
      await client.query(sqlContent);
    }

    console.log('Database initialization completed successfully.');
  } catch (err) {
    console.error('Error during database initialization:', err);
  } finally {
    // Close the database connection
    await client.end();
  }
})();
