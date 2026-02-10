import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('users', {
     id: uuid('id').defaultRandom().primaryKey(),
     email: varchar('email', { length: 32 }).unique(),
     username: varchar('username', { length: 32 }).notNull().unique(),
     displayname: varchar('displayname', { length: 32 }).notNull(),
     password: varchar('password', { length: 64 }).notNull(),
     created_at: timestamp('created_at').notNull().defaultNow(),
});
