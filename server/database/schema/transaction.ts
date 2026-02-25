import { pgTable, varchar, timestamp, numeric, integer, serial } from 'drizzle-orm/pg-core';

export const transaction = pgTable('transactions', {
	id: serial('id').primaryKey(),
	owner_id: serial('owner_id').notNull(),
	account_id: serial('account_id').notNull(),
	title: varchar('title', { length: 32 }).notNull(),
	description: varchar('description', { length: 128 }),
	type: varchar('type', { length: 16 }).notNull(),
	price: numeric('price', { precision: 12, scale: 2 }).notNull(),
	day: integer('day').notNull(),
	month: integer('month').notNull(),
	year: integer('year').notNull(),
	created_at: timestamp('created_at').defaultNow(),
});
