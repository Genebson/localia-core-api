import { pgTable, text, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  role: varchar('role', { length: 20 }).default('seeker'),
  licenseNumber: text('license_number'),
});

export const session = pgTable('session', {
  id: varchar('id', { length: 255 }).primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
});

export const account = pgTable('account', {
  id: varchar('id', { length: 255 }).primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const verification = pgTable('verification', {
  id: varchar('id', { length: 255 }).primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
