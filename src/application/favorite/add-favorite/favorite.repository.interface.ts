import { Favorite } from '../../../domain/entities/favorite.entity.js';

export const FAVORITE_REPOSITORY_KEY = 'favorite_repository';

export interface IFavoriteRepository {
	add(userId: string, propertyId: string): Promise<Favorite>;
	remove(userId: string, propertyId: string): Promise<void>;
	findByUserId(userId: string): Promise<Favorite[]>;
	exists(userId: string, propertyId: string): Promise<boolean>;
}
