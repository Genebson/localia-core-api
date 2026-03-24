import { ConfigService } from '@nestjs/config';
import { ResendService } from 'nestjs-resend';
import { EmailService } from './email.service.js';

describe('EmailService', () => {
	let emailService: EmailService;
	let mockResendService: { send: jest.Mock };
	let mockConfigService: { get: jest.Mock };

	beforeEach(() => {
		mockResendService = { send: jest.fn() };
		mockConfigService = {
			get: jest.fn().mockImplementation((key: string) => {
				if (key === 'email.fromEmail') return 'Localia <noreply@resend.dev>';
				if (key === 'email.baseUrl') return 'http://localhost:5173';
				return null;
			}),
		};

		emailService = new EmailService(mockResendService as any, mockConfigService as any);
	});

	describe('sendWelcomeEmail', () => {
		it('should send welcome email with correct parameters', async () => {
			mockResendService.send.mockResolvedValue({ id: 'email-123' });

			await emailService.sendWelcomeEmail('user@example.com', 'John Doe');

			expect(mockResendService.send).toHaveBeenCalledWith({
				from: 'Localia <noreply@resend.dev>',
				to: 'user@example.com',
				subject: 'Welcome to Localia',
				html: expect.stringContaining('Welcome, John Doe!'),
			});
		});

		it('should use "User" as default name when name is missing', async () => {
			mockResendService.send.mockResolvedValue({ id: 'email-123' });

			await emailService.sendWelcomeEmail('user@example.com', 'User');

			expect(mockResendService.send).toHaveBeenCalledWith(
				expect.objectContaining({
					html: expect.stringContaining('Welcome, User!'),
				}),
			);
		});

		it('should not throw when resendService.send fails', async () => {
			mockResendService.send.mockRejectedValue(new Error('API error'));

			await expect(emailService.sendWelcomeEmail('user@example.com', 'John')).resolves.not.toThrow();
		});
	});

	describe('sendPasswordResetEmail', () => {
		it('should send password reset email with correct parameters', async () => {
			mockResendService.send.mockResolvedValue({ id: 'email-456' });

			await emailService.sendPasswordResetEmail('user@example.com', 'reset-token-abc');

			expect(mockResendService.send).toHaveBeenCalledWith({
				from: 'Localia <noreply@resend.dev>',
				to: 'user@example.com',
				subject: 'Reset your Localia password',
				html: expect.stringContaining('reset-password?token=reset-token-abc'),
			});
		});

		it('should use baseUrl from config in reset link', async () => {
			mockResendService.send.mockResolvedValue({ id: 'email-456' });

			await emailService.sendPasswordResetEmail('user@example.com', 'token123');

			expect(mockResendService.send).toHaveBeenCalledWith(
				expect.objectContaining({
					html: expect.stringContaining('http://localhost:5173/reset-password?token=token123'),
				}),
			);
		});

		it('should not throw when resendService.send fails', async () => {
			mockResendService.send.mockRejectedValue(new Error('API error'));

			await expect(
				emailService.sendPasswordResetEmail('user@example.com', 'token'),
			).resolves.not.toThrow();
		});
	});
});
