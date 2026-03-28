import { pgTable, text, timestamp, varchar, integer, boolean } from 'drizzle-orm/pg-core';

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
	agentId: varchar('agent_id', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
	deletedAt: timestamp('deleted_at'),
});

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
