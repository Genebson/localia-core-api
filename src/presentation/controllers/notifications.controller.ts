import { Controller, Post, Body } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { EmailService } from '../../infrastructure/email/email.service.js';

@Controller('notifications')
export class NotificationsController {
	constructor(private readonly emailService: EmailService) {}

	@Post('welcome-email')
	@AllowAnonymous()
	async sendWelcomeEmail(@Body() body: { email: string; name?: string }) {
		try {
			await this.emailService.sendWelcomeEmail(body.email, body.name ?? 'User');
		} catch {
			// Swallow errors to always return success
		}
		return { success: true };
	}
}
