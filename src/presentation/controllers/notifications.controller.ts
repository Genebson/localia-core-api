import { Controller, Post, Body } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { EmailService } from '../../infrastructure/email/email.service.js';
import { auth } from '../../config/database.config.js';

@Controller('notifications')
export class NotificationsController {
	constructor(private readonly emailService: EmailService) {}

	@Post('welcome-email')
	@AllowAnonymous()
	async sendWelcomeEmail(@Body() body: { email: string; name?: string }) {
		try {
			await this.emailService.sendWelcomeEmail(body.email, body.name ?? 'User');
		} catch {
		}
		return { success: true };
	}

	@Post('forgot-password')
	@AllowAnonymous()
	async forgotPassword(@Body() body: { email: string }) {
		await auth.api.requestPasswordReset({
			body: { email: body.email },
		});
		return { success: true };
	}
}
