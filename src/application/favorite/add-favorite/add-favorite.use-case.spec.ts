import { AddFavoriteUseCase } from './add-favorite.use-case.js';
import { IFavoriteRepository, FAVORITE_REPOSITORY_KEY } from './favorite.repository.interface.js';
import { Favorite } from '../../../domain/entities/favorite.entity.js';

describe('AddFavoriteUseCase', () => {
	let useCase: AddFavoriteUseCase;
	let mockRepository: jest.Mocked<IFavoriteRepository>;

	beforeEach(() => {
		mockRepository = {
			add: jest.fn(),
			remove: jest.fn(),
			findByUserId: jest.fn(),
			exists: jest.fn(),
		};
		useCase = new AddFavoriteUseCase(mockRepository);
	});

	it('should add a favorite when it does not exist', async () => {
		mockRepository.exists.mockResolvedValue(false);
		const favorite = Favorite.create('user-123', 'property-456');
		mockRepository.add.mockResolvedValue(favorite);

		await useCase.execute('user-123', 'property-456');

		expect(mockRepository.exists).toHaveBeenCalledWith('user-123', 'property-456');
		expect(mockRepository.add).toHaveBeenCalledWith('user-123', 'property-456');
	});

	it('should not add a favorite when it already exists', async () => {
		mockRepository.exists.mockResolvedValue(true);

		await useCase.execute('user-123', 'property-456');

		expect(mockRepository.exists).toHaveBeenCalledWith('user-123', 'property-456');
		expect(mockRepository.add).not.toHaveBeenCalled();
	});

	it('should be idempotent', async () => {
		mockRepository.exists.mockResolvedValue(true);

		await useCase.execute('user-123', 'property-456');
		await useCase.execute('user-123', 'property-456');

		expect(mockRepository.add).not.toHaveBeenCalled();
	});
});
