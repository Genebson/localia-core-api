import { ListFavoritesUseCase } from './list-favorites.use-case.js';
import { IFavoriteRepository, FAVORITE_REPOSITORY_KEY } from '../add-favorite/favorite.repository.interface.js';
import { Favorite } from '../../../domain/entities/favorite.entity.js';

describe('ListFavoritesUseCase', () => {
	let useCase: ListFavoritesUseCase;
	let mockRepository: jest.Mocked<IFavoriteRepository>;

	beforeEach(() => {
		mockRepository = {
			add: jest.fn(),
			remove: jest.fn(),
			findByUserId: jest.fn(),
			exists: jest.fn(),
		};
		useCase = new ListFavoritesUseCase(mockRepository);
	});

	it('should return array of property IDs', async () => {
		const favorites = [
			Favorite.create('user-123', 'prop-1'),
			Favorite.create('user-123', 'prop-2'),
			Favorite.create('user-123', 'prop-3'),
		];
		mockRepository.findByUserId.mockResolvedValue(favorites);

		const result = await useCase.execute('user-123');

		expect(result.favorites).toEqual(['prop-1', 'prop-2', 'prop-3']);
	});

	it('should return empty array when user has no favorites', async () => {
		mockRepository.findByUserId.mockResolvedValue([]);

		const result = await useCase.execute('user-123');

		expect(result.favorites).toEqual([]);
	});

	it('should call repository with correct userId', async () => {
		mockRepository.findByUserId.mockResolvedValue([]);

		await useCase.execute('user-123');

		expect(mockRepository.findByUserId).toHaveBeenCalledWith('user-123');
	});
});
