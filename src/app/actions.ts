import { userAuditsTable, usersTable } from '@/db/schema';
import { db } from '@/db';

export const getUsers = async () => {
  const users = await db.select().from(usersTable);
  return users;
};

// Server Action for fetching users
export async function fetchUserAudits() {
  try {
    const userAudits = await db.select().from(userAuditsTable);
    return userAudits;
  } catch (error) {
    console.error('Failed to fetch user audits:', error);
    throw new Error('Unable to fetch user audits');
  }
}
