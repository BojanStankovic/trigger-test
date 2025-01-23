import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
// import { migrate } from 'drizzle-orm/node-postgres/migrator';

export const db = drizzle(process.env.DATABASE_URL!);
// const migrationsFolderPath = './drizzle';
// await migrate(db, {
//   migrationsFolder: migrationsFolderPath,
// });
