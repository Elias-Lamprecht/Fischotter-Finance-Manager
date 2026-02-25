import { pgTable, serial, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const account = pgTable('accounts', {
	id: serial('id').primaryKey(),
	owner_id: serial('owner_id').notNull(),
	title: varchar('title', { length: 32 }).notNull(),
	primary: boolean('primary').notNull().default(false),
	description: varchar('description', { length: 128 }),
	created_at: timestamp('created_at').defaultNow(),
});
