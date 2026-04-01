import { RemoveFavoriteUseCase } from './remove-favorite.use-case.js';
import { IFavoriteRepository, FAVORITE_REPOSITORY_KEY } from '../add-favorite/favorite.repository.interface.js';

describe('RemoveFavoriteUseCase', () => {
	let useCase: RemoveFavoriteUseCase;
	let mockRepository: jest.Mocked<IFavoriteRepository>;

	beforeEach(() => {
		mockRepository = {
			add: jest.fn(),
			remove: jest.fn(),
			findByUserId: jest.fn(),
			exists: jest.fn(),
		};
		useCase = new RemoveFavoriteUseCase(mockRepository);
	});

	it('should remove a favorite', async () => {
		mockRepository.remove.mockResolvedValue();

		await useCase.execute('user-123', 'property-456');

		expect(mockRepository.remove).toHaveBeenCalledWith('user-123', 'property-456');
	});

	it('should not throw when favorite does not exist', async () => {
		mockRepository.remove.mockResolvedValue();

		await expect(useCase.execute('user-123', 'property-456')).resolves.toBeUndefined();
	});

	it('should be idempotent', async () => {
		mockRepository.remove.mockResolvedValue();

		await useCase.execute('user-123', 'property-456');
		await useCase.execute('user-123', 'property-456');

		expect(mockRepository.remove).toHaveBeenCalledTimes(2);
	});
});
