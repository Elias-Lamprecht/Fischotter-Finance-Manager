import { pgTable, uuid, varchar, timestamp, numeric } from 'drizzle-orm/pg-core';

export const transaction = pgTable('transactions', {
     id: uuid('id').defaultRandom().primaryKey(),
     owner_id: uuid('owner_id').notNull(),
     account_id: uuid('account_id').notNull(),
     subscription_id: uuid('subscription_id'),
     title: varchar('title', { length: 32 }).notNull(),
     description: varchar('description', { length: 128 }),
     type: varchar('type', { length: 16 }).notNull(),
     price: numeric('price', { precision: 12, scale: 2 }).notNull(),
     created_at: timestamp('created_at').defaultNow(),
});
