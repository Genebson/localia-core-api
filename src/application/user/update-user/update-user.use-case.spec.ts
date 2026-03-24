import { BadRequestException } from '@nestjs/common';
import { UpdateUserUseCase } from './update-user.use-case.js';
import { IUpdateUserRepository } from './update-user.repository.interface.js';
import { User } from '../../../domain/entities/user.domain.js';
import { UserRole } from '../../../domain/entities/user-role.enum.js';
import { UpdateUserRequestDto } from './update-user.request.dto.js';

describe('UpdateUserUseCase', () => {
	let useCase: UpdateUserUseCase;
	let mockRepository: jest.Mocked<IUpdateUserRepository>;

	beforeEach(() => {
		mockRepository = {
			updateRole: jest.fn(),
		};
		useCase = new UpdateUserUseCase(mockRepository);
	});

	it('should update role to agent with valid licenseNumber', async () => {
		const updatedUser = new User(
			'user-123',
			'agent@example.com',
			'Agent User',
			true,
			null,
			UserRole.AGENT,
			'ABC12345',
			new Date(),
			new Date(),
		);
		mockRepository.updateRole.mockResolvedValue(updatedUser);

		const dto = new UpdateUserRequestDto();
		dto.role = UserRole.AGENT;
		dto.licenseNumber = 'ABC12345';

		const result = await useCase.execute('user-123', dto);

		expect(result.data.attributes.role).toBe('agent');
		expect(result.data.attributes.licenseNumber).toBe('ABC12345');
		expect(mockRepository.updateRole).toHaveBeenCalledWith('user-123', UserRole.AGENT, 'ABC12345');
	});

	it('should update role to seeker and clear licenseNumber', async () => {
		const updatedUser = new User(
			'user-123',
			'user@example.com',
			'Regular User',
			true,
			null,
			UserRole.SEEKER,
			null,
			new Date(),
			new Date(),
		);
		mockRepository.updateRole.mockResolvedValue(updatedUser);

		const dto = new UpdateUserRequestDto();
		dto.role = UserRole.SEEKER;

		const result = await useCase.execute('user-123', dto);

		expect(result.data.attributes.role).toBe('seeker');
		expect(result.data.attributes.licenseNumber).toBeNull();
		expect(mockRepository.updateRole).toHaveBeenCalledWith('user-123', UserRole.SEEKER, null);
	});

	it('should throw BadRequestException when agent role has short licenseNumber', async () => {
		const dto = new UpdateUserRequestDto();
		dto.role = UserRole.AGENT;
		dto.licenseNumber = 'AB';

		await expect(useCase.execute('user-123', dto)).rejects.toThrow(BadRequestException);
	});

	it('should throw BadRequestException when agent role has no licenseNumber', async () => {
		const dto = new UpdateUserRequestDto();
		dto.role = UserRole.AGENT;

		await expect(useCase.execute('user-123', dto)).rejects.toThrow(BadRequestException);
	});
});
