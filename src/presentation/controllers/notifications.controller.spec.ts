import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller.js';
import { EmailService } from '../../infrastructure/email/email.service.js';

describe('NotificationsController', () => {
	let controller: NotificationsController;
	let mockEmailService: { sendWelcomeEmail: jest.Mock };

	beforeEach(async () => {
		mockEmailService = { sendWelcomeEmail: jest.fn() };

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
});
