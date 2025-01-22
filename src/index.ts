import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { usersTable } from './db/schema';
import { db } from './db';

async function main() {
  const user: typeof usersTable.$inferInsert = {
    name: 'John',
    age: 30,
    email: 'john@example.com',
  };

  await db.insert(usersTable).values(user);
  console.log('New user created!');

  const users = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', users);
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */

  await db
    .update(usersTable)
    .set({
      age: 31,
    })
    .where(eq(usersTable.email, user.email));
  console.log('User info updated!');

  /* The commented out line `// await db.delete(usersTable).where(eq(usersTable.email, user.email));`
  is an example of how you can delete a user from the database using the `drizzle-orm` library in
  TypeScript. */
  // await db.delete(usersTable).where(eq(usersTable.email, user.email));
  // console.log('User deleted!');
}

main();
