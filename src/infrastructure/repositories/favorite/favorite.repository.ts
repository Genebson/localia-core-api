import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from '../../../config/database.config.js';
import { favorite } from '../../database/schema.js';
import { Favorite } from '../../../domain/entities/favorite.entity.js';
import {
	IFavoriteRepository,
	FAVORITE_REPOSITORY_KEY,
} from '../../../application/favorite/add-favorite/favorite.repository.interface.js';

@Injectable()
export class FavoriteRepository implements IFavoriteRepository {
	async add(userId: string, propertyId: string): Promise<Favorite> {
		const [row] = await db
			.insert(favorite)
			.values({
				id: crypto.randomUUID(),
				userId,
				propertyId,
			})
			.returning();
		return Favorite.fromPersistence(row);
	}

	async remove(userId: string, propertyId: string): Promise<void> {
		await db
			.delete(favorite)
			.where(and(eq(favorite.userId, userId), eq(favorite.propertyId, propertyId)));
	}

	async findByUserId(userId: string): Promise<Favorite[]> {
		const rows = await db
			.select()
			.from(favorite)
			.where(eq(favorite.userId, userId));
		return rows.map((row) => Favorite.fromPersistence(row));
	}

	async exists(userId: string, propertyId: string): Promise<boolean> {
		const [row] = await db
			.select()
			.from(favorite)
			.where(and(eq(favorite.userId, userId), eq(favorite.propertyId, propertyId)))
			.limit(1);
		return !!row;
	}
}
