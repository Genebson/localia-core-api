import { Inject, Injectable } from '@nestjs/common';
import { IFavoriteRepository, FAVORITE_REPOSITORY_KEY } from './favorite.repository.interface.js';

@Injectable()
export class AddFavoriteUseCase {
	constructor(
		@Inject(FAVORITE_REPOSITORY_KEY)
		private readonly repository: IFavoriteRepository,
	) {}

	async execute(userId: string, propertyId: string): Promise<void> {
		const exists = await this.repository.exists(userId, propertyId);
		if (exists) return;
		await this.repository.add(userId, propertyId);
	}
}
