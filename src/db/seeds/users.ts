import { NodePgClient, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { usersTable } from '../schema';

export const seedUsers = async (
  database: NodePgDatabase<Record<string, never>> & {
    $client: NodePgClient;
  },
) => {
  await database
    .insert(usersTable)
    .values([
      {
        name: 'John',
        age: 30,
        email: 'john@example.com',
      },
      {
        name: 'Jane',
        age: 25,
        email: 'jane@example.com',
      },
    ])
    .execute();
};
