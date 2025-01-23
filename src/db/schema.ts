import { relations } from 'drizzle-orm';
import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const userAuditsTable = pgTable('user_audits', {
  guid: varchar({ length: 255 }).notNull().primaryKey(),
  user_added_timestamp: timestamp().notNull(),
  user_id: integer().notNull(),
});

export const userAuditsRelations = relations(userAuditsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [userAuditsTable.user_id],
    references: [usersTable.id],
  }),
}));
