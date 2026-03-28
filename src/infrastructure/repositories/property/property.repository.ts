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
		return rows
			.filter((row) => !row.deletedAt)
			.map((row) => this.rowToEntity(row));
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
				updatedAt: new Date(),
			})
			.where(eq(property.id, prop.id))
			.returning();
		return this.rowToEntity(row);
	}

	async findAllFeatured(): Promise<Property[]> {
		const rows = await db
			.select()
			.from(property)
			.where(eq(property.featured, true));
		return rows
			.filter((row) => !row.deletedAt)
			.map((row) => this.rowToEntity(row));
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
			agentId: row.agentId,
			createdAt: row.createdAt ?? new Date(),
			updatedAt: row.updatedAt ?? new Date(),
			deletedAt: row.deletedAt ?? null,
		});
	}
}
