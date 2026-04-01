import { Inject, Injectable } from '@nestjs/common';
import { IFavoriteRepository, FAVORITE_REPOSITORY_KEY } from '../add-favorite/favorite.repository.interface.js';

@Injectable()
export class ListFavoritesUseCase {
	constructor(
		@Inject(FAVORITE_REPOSITORY_KEY)
		private readonly repository: IFavoriteRepository,
	) {}

	async execute(userId: string): Promise<{ favorites: string[] }> {
		const favorites = await this.repository.findByUserId(userId);
		return { favorites: favorites.map((f) => f.propertyId) };
	}
}
