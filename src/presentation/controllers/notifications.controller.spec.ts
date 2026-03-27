import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller.js';
import { EmailService } from '../../infrastructure/email/email.service.js';
import { auth } from '../../config/database.config.js';

jest.mock('../../config/database.config.js', () => ({
	auth: {
		api: {
			requestPasswordReset: jest.fn(),
		},
	},
}));

describe('NotificationsController', () => {
	let controller: NotificationsController;
	let mockEmailService: { sendWelcomeEmail: jest.Mock };

	beforeEach(async () => {
		mockEmailService = { sendWelcomeEmail: jest.fn() };

		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			controllers: [NotificationsController],
			providers: [{ provide: EmailService, useValue: mockEmailService }],
		}).compile();

		controller = module.get<NotificationsController>(NotificationsController);
	});

	describe('POST /notifications/welcome-email', () => {
		it('should call emailService.sendWelcomeEmail with email and name', async () => {
			const body = { email: 'test@example.com', name: 'Test User' };
			mockEmailService.sendWelcomeEmail.mockResolvedValue(undefined);

			const result = await controller.sendWelcomeEmail(body);

			expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith('test@example.com', 'Test User');
			expect(result).toEqual({ success: true });
		});

		it('should use "User" as default name when name is missing', async () => {
			const body = { email: 'test@example.com' } as { email: string; name?: string };
			mockEmailService.sendWelcomeEmail.mockResolvedValue(undefined);

			await controller.sendWelcomeEmail(body);

			expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith('test@example.com', 'User');
		});

		it('should return success even if emailService throws', async () => {
			const body = { email: 'test@example.com', name: 'Test User' };
			mockEmailService.sendWelcomeEmail.mockRejectedValue(new Error('Resend failed'));

			const result = await controller.sendWelcomeEmail(body);

			expect(result).toEqual({ success: true });
		});
	});

	describe('POST /notifications/forgot-password', () => {
		it('should call auth.api.requestPasswordReset with email', async () => {
			const body = { email: 'test@example.com' };
			(auth.api.requestPasswordReset as unknown as jest.Mock).mockResolvedValue(undefined);

			const result = await controller.forgotPassword(body);

			expect(auth.api.requestPasswordReset).toHaveBeenCalledWith({ body: { email: 'test@example.com' } });
			expect(result).toEqual({ success: true });
		});

		it('should return success for unregistered email (silent success)', async () => {
			const body = { email: 'nonexistent@example.com' };
			(auth.api.requestPasswordReset as unknown as jest.Mock).mockResolvedValue(undefined);

			const result = await controller.forgotPassword(body);

			expect(result).toEqual({ success: true });
		});
	});
});
