import { Inject, Injectable } from '@nestjs/common';
import { IFavoriteRepository, FAVORITE_REPOSITORY_KEY } from '../add-favorite/favorite.repository.interface.js';

@Injectable()
export class RemoveFavoriteUseCase {
	constructor(
		@Inject(FAVORITE_REPOSITORY_KEY)
		private readonly repository: IFavoriteRepository,
	) {}

	async execute(userId: string, propertyId: string): Promise<void> {
		await this.repository.remove(userId, propertyId);
	}
}
