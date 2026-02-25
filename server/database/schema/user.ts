import {
     pgTable,
     serial,
     varchar,
     boolean,
     timestamp,
} from 'drizzle-orm/pg-core';

export const user = pgTable('users', {
	id: serial('id').primaryKey(),
	email: varchar('email', { length: 32 }).unique(),
	username: varchar('username', { length: 32 }).notNull().unique(),
	displayname: varchar('displayname', { length: 32 }).notNull(),
	role: varchar('role', { length: 16 }).notNull(),
	status: boolean('status').notNull().default(false),
	password: varchar('password', { length: 64 }).notNull(),
	created_at: timestamp('created_at').defaultNow(),
});
