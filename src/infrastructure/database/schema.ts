import {
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  image: text('image'),
  phone: text('phone'),
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

export const property = pgTable('property', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  operation: varchar('operation', { length: 10 }).notNull(),
  propertyType: varchar('property_type', { length: 20 }).notNull(),
  price: integer('price').notNull(),
  currency: varchar('currency', { length: 5 }).notNull().default('USD'),
  location: text('location').notNull(),
  address: text('address'),
  bedrooms: integer('bedrooms').default(0),
  bathrooms: integer('bathrooms').default(0),
  area: integer('area').default(0),
  images: text('images').array().default([]),
  featured: boolean('featured').default(false),
  published: boolean('published').default(true).notNull(),
  publishedAt: timestamp('published_at'),
  listingCode: text('listing_code'),
  isFinancingEligible: boolean('is_financing_eligible').default(false).notNull(),
  petFriendly: boolean('pet_friendly').default(false).notNull(),
  airConditioning: boolean('air_conditioning').default(false).notNull(),
  elevator: boolean('elevator').default(false).notNull(),
  balcony: boolean('balcony').default(false).notNull(),
  outdoor: boolean('outdoor').default(false).notNull(),
  garage: boolean('garage').default(false).notNull(),
  garden: boolean('garden').default(false).notNull(),
  pool: boolean('pool').default(false).notNull(),
  storageRoom: boolean('storage_room').default(false).notNull(),
  accessible: boolean('accessible').default(false).notNull(),
  condition: varchar('condition', { length: 20 }),
  furnishings: varchar('furnishings', { length: 30 }),
  distributedTo: text('distributed_to').array().default([]).notNull(),
  agentId: varchar('agent_id', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const favorite = pgTable(
  'favorite',
  {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    propertyId: varchar('property_id', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  table => ({
    userPropertyUnique: uniqueIndex('favorite_user_property_unique').on(
      table.userId,
      table.propertyId
    ),
  })
);
