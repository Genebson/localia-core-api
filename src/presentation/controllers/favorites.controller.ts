import { Controller, Post, Get, Delete, Param, Body, UnauthorizedException } from '@nestjs/common';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { AddFavoriteUseCase } from '../../application/favorite/add-favorite/add-favorite.use-case.js';
import { RemoveFavoriteUseCase } from '../../application/favorite/remove-favorite/remove-favorite.use-case.js';
import { ListFavoritesUseCase } from '../../application/favorite/list-favorites/list-favorites.use-case.js';

@Controller('favorites')
export class FavoritesController {
	constructor(
		private readonly addFavoriteUseCase: AddFavoriteUseCase,
		private readonly removeFavoriteUseCase: RemoveFavoriteUseCase,
		private readonly listFavoritesUseCase: ListFavoritesUseCase,
	) {}

	@Get()
	async list(@Session() session: UserSession) {
		if (!session?.user?.id) throw new UnauthorizedException();
		return this.listFavoritesUseCase.execute(session.user.id);
	}

	@Post()
	async add(@Session() session: UserSession, @Body() dto: { propertyId: string }) {
		if (!session?.user?.id) throw new UnauthorizedException();
		await this.addFavoriteUseCase.execute(session.user.id, dto.propertyId);
		return { success: true };
	}

	@Delete(':propertyId')
	async remove(@Session() session: UserSession, @Param('propertyId') propertyId: string) {
		if (!session?.user?.id) throw new UnauthorizedException();
		await this.removeFavoriteUseCase.execute(session.user.id, propertyId);
	}
}
