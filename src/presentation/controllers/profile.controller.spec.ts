import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller.js';
import { GetUserUseCase } from '../../application/user/get-user/get-user.use-case.js';
import { UpdateUserUseCase } from '../../application/user/update-user/update-user.use-case.js';
import { UserRole } from '../../domain/entities/user-role.enum.js';

describe('ProfileController', () => {
	let controller: ProfileController;
	let mockGetUserUseCase: { execute: jest.Mock };
	let mockUpdateUserUseCase: { execute: jest.Mock };

	const mockSession = {
		user: { id: 'user-123', email: 'test@example.com', name: 'Test User' },
		session: { id: 'session-123', expiresAt: new Date() },
	};

	beforeEach(async () => {
		mockGetUserUseCase = { execute: jest.fn() };
		mockUpdateUserUseCase = { execute: jest.fn() };

		const module: TestingModule = await Test.createTestingModule({
			controllers: [ProfileController],
			providers: [
				{ provide: GetUserUseCase, useValue: mockGetUserUseCase },
				{ provide: UpdateUserUseCase, useValue: mockUpdateUserUseCase },
			],
		}).compile();

		controller = module.get<ProfileController>(ProfileController);
	});

	describe('GET /profile', () => {
		it('should return user profile when authenticated', async () => {
			const mockUser = {
				data: {
					type: 'user' as const,
					id: 'user-123',
					attributes: {
						email: 'test@example.com',
						name: 'Test User',
						role: UserRole.SEEKER,
						tuition: null,
					},
				},
			};
			mockGetUserUseCase.execute.mockResolvedValue(mockUser);

			const result = await controller.getUser(mockSession as any);

			expect(result).toEqual(mockUser);
			expect(mockGetUserUseCase.execute).toHaveBeenCalledWith('user-123');
		});

		it('should throw error when not authenticated', async () => {
			const emptySession = { user: null, session: null };

			await expect(controller.getUser(emptySession as any)).rejects.toThrow('Not authenticated');
		});
	});

	describe('PATCH /profile/role', () => {
		it('should update role to agent with valid tuition', async () => {
			const mockUpdatedUser = {
				data: {
					type: 'user' as const,
					id: 'user-123',
					attributes: {
						email: 'test@example.com',
						name: 'Test User',
						role: UserRole.AGENT,
						tuition: 'ABC12345',
					},
				},
			};
			mockUpdateUserUseCase.execute.mockResolvedValue(mockUpdatedUser);

			const dto = { role: UserRole.AGENT, tuition: 'ABC12345' };
			const result = await controller.updateRole(mockSession as any, dto as any);

			expect(result).toEqual(mockUpdatedUser);
			expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith('user-123', dto);
		});

		it('should update role to seeker', async () => {
			const mockUpdatedUser = {
				data: {
					type: 'user' as const,
					id: 'user-123',
					attributes: {
						email: 'test@example.com',
						name: 'Test User',
						role: UserRole.SEEKER,
						tuition: null,
					},
				},
			};
			mockUpdateUserUseCase.execute.mockResolvedValue(mockUpdatedUser);

			const dto = { role: UserRole.SEEKER };
			const result = await controller.updateRole(mockSession as any, dto as any);

			expect(result.data.attributes.role).toBe(UserRole.SEEKER);
			expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith('user-123', dto);
		});

		it('should throw error when not authenticated', async () => {
			const emptySession = { user: null, session: null };

			await expect(
				controller.updateRole(emptySession as any, { role: UserRole.AGENT, tuition: 'ABC123' } as any),
			).rejects.toThrow('Not authenticated');
		});
	});
});
