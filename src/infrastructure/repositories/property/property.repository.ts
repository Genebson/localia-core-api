import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../../config/database.config.js';
import { property } from '../../database/schema.js';
import { Property } from '../../../domain/entities/property.entity.js';
import {
	IPropertyRepository,
	PROPERTY_REPOSITORY_KEY,
} from '../../../application/property/create-property/property.repository.interface.js';

@Injectable()
export class PropertyRepository implements IPropertyRepository {
	async create(prop: Property): Promise<Property> {
		const [row] = await db
			.insert(property)
			.values({
				id: prop.id,
				title: prop.title,
				description: prop.description,
				operation: prop.operation,
				propertyType: prop.propertyType,
				price: prop.price,
				currency: prop.currency,
				location: prop.location,
				address: prop.address,
				bedrooms: prop.attributes.bedrooms,
				bathrooms: prop.attributes.bathrooms,
				area: prop.attributes.area,
				images: prop.images,
				featured: prop.featured,
				published: prop.published,
				publishedAt: prop.publishedAt,
				listingCode: prop.listingCode,
				isFinancingEligible: prop.isFinancingEligible,
				petFriendly: prop.petFriendly,
				airConditioning: prop.airConditioning,
				elevator: prop.elevator,
				balcony: prop.balcony,
				outdoor: prop.outdoor,
				garage: prop.garage,
				garden: prop.garden,
				pool: prop.pool,
				storageRoom: prop.storageRoom,
				accessible: prop.accessible,
				condition: prop.condition,
				furnishings: prop.furnishings,
				distributedTo: prop.distributedTo,
				agentId: prop.agentId,
			})
			.returning();
		return this.rowToEntity(row);
	}

	async findById(id: string): Promise<Property | null> {
		const [row] = await db
			.select()
			.from(property)
			.where(eq(property.id, id))
			.limit(1);
		if (!row || row.deletedAt) return null;
		return this.rowToEntity(row);
	}

	async findByAgentId(agentId: string): Promise<Property[]> {
		const rows = await db
			.select()
			.from(property)
			.where(eq(property.agentId, agentId));
		return rows.filter((row) => !row.deletedAt).map((row) => this.rowToEntity(row));
	}

	async findByAgentIdPaginated(
		agentId: string,
		page: number,
		limit: number,
		sort: 'asc' | 'desc',
	): Promise<{ properties: Property[]; total: number }> {
		const rows = await db
			.select()
			.from(property)
			.where(eq(property.agentId, agentId));
		const activeRows = rows.filter((row) => !row.deletedAt);

		const sorted = activeRows.sort((a, b) => {
			const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
			const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
			return sort === 'asc' ? dateA - dateB : dateB - dateA;
		});

		const total = sorted.length;
		const offset = (page - 1) * limit;
		const paginatedRows = sorted.slice(offset, offset + limit);

		return {
			properties: paginatedRows.map((row) => this.rowToEntity(row)),
			total,
		};
	}

	async update(prop: Property): Promise<Property> {
		const [row] = await db
			.update(property)
			.set({
				title: prop.title,
				description: prop.description,
				operation: prop.operation,
				propertyType: prop.propertyType,
				price: prop.price,
				currency: prop.currency,
				location: prop.location,
				address: prop.address,
				bedrooms: prop.attributes.bedrooms,
				bathrooms: prop.attributes.bathrooms,
				area: prop.attributes.area,
				images: prop.images,
				featured: prop.featured,
				published: prop.published,
				publishedAt: prop.publishedAt,
				listingCode: prop.listingCode,
				isFinancingEligible: prop.isFinancingEligible,
				petFriendly: prop.petFriendly,
				airConditioning: prop.airConditioning,
				elevator: prop.elevator,
				balcony: prop.balcony,
				outdoor: prop.outdoor,
				garage: prop.garage,
				garden: prop.garden,
				pool: prop.pool,
				storageRoom: prop.storageRoom,
				accessible: prop.accessible,
				condition: prop.condition,
				furnishings: prop.furnishings,
				distributedTo: prop.distributedTo,
				updatedAt: new Date(),
			})
			.where(eq(property.id, prop.id))
			.returning();
		return this.rowToEntity(row);
	}

	async findAllPaginated(page: number, limit: number): Promise<Property[]> {
		const allRows = await db.select().from(property);
		const activeRows = allRows.filter((row) => !row.deletedAt && row.published !== false);
		const offset = (page - 1) * limit;
		const paginatedRows = activeRows.slice(offset, offset + limit);
		return paginatedRows.map((row) => this.rowToEntity(row));
	}

	async countAll(): Promise<number> {
		const rows = await db.select().from(property);
		return rows.filter((row) => !row.deletedAt && row.published !== false).length;
	}

	async delete(id: string): Promise<void> {
		await db
			.update(property)
			.set({ deletedAt: new Date(), updatedAt: new Date() })
			.where(eq(property.id, id));
	}

	private rowToEntity(row: typeof property.$inferSelect): Property {
		return Property.fromPersistence({
			id: row.id,
			title: row.title,
			description: row.description,
			operation: row.operation,
			propertyType: row.propertyType,
			price: row.price,
			currency: row.currency,
			location: row.location,
			address: row.address,
			bedrooms: row.bedrooms ?? 0,
			bathrooms: row.bathrooms ?? 0,
			area: row.area ?? 0,
			images: row.images ?? [],
			featured: row.featured ?? false,
			published: row.published ?? true,
			publishedAt: row.publishedAt ?? null,
			listingCode: row.listingCode ?? null,
			isFinancingEligible: row.isFinancingEligible ?? false,
			petFriendly: row.petFriendly ?? false,
			airConditioning: row.airConditioning ?? false,
			elevator: row.elevator ?? false,
			balcony: row.balcony ?? false,
			outdoor: row.outdoor ?? false,
			garage: row.garage ?? false,
			garden: row.garden ?? false,
			pool: row.pool ?? false,
			storageRoom: row.storageRoom ?? false,
			accessible: row.accessible ?? false,
			condition: row.condition ?? null,
			furnishings: row.furnishings ?? null,
			distributedTo: row.distributedTo ?? [],
			agentId: row.agentId,
			createdAt: row.createdAt ?? new Date(),
			updatedAt: row.updatedAt ?? new Date(),
			deletedAt: row.deletedAt ?? null,
		});
	}
}
