import { NotFoundException } from '@nestjs/common';
import { GetUserUseCase } from './get-user.use-case.js';
import { IGetUserRepository } from './get-user.repository.interface.js';
import { User } from '../../../domain/entities/user.domain.js';
import { UserRole } from '../../../domain/entities/user-role.enum.js';

describe('GetUserUseCase', () => {
	let useCase: GetUserUseCase;
	let mockRepository: jest.Mocked<IGetUserRepository>;

	beforeEach(() => {
		mockRepository = {
			findById: jest.fn(),
		};
		useCase = new GetUserUseCase(mockRepository);
	});

	it('should return user when found', async () => {
		const user = new User(
			'user-123',
			'test@example.com',
			'Test User',
			true,
			null,
			UserRole.SEEKER,
			null,
			new Date(),
			new Date(),
		);
		mockRepository.findById.mockResolvedValue(user);

		const result = await useCase.execute('user-123');

		expect(result.data.id).toBe('user-123');
		expect(result.data.attributes.email).toBe('test@example.com');
		expect(result.data.attributes.role).toBe('seeker');
		expect(mockRepository.findById).toHaveBeenCalledWith('user-123');
	});

	it('should throw NotFoundException when user not found', async () => {
		mockRepository.findById.mockResolvedValue(null);

		await expect(useCase.execute('nonexistent')).rejects.toThrow(NotFoundException);
	});
});
