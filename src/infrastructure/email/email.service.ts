import { Injectable, Logger } from '@nestjs/common';
import { ResendService } from 'nestjs-resend';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
	private readonly fromEmail: string;
	private readonly logger = new Logger(EmailService.name);

	constructor(
		private readonly resendService: ResendService,
		private readonly configService: ConfigService,
	) {
		this.fromEmail =
			this.configService.get<string>('email.fromEmail') ||
			'Localia <noreply@resend.dev>';
	}

	async sendWelcomeEmail(to: string, name: string): Promise<void> {
		try {
			await this.resendService.send({
				from: this.fromEmail,
				to,
				subject: 'Welcome to Localia',
				html: `
					<h1>Welcome, ${name}!</h1>
					<p>Your Localia account has been created successfully.</p>
					<p>You can now browse and publish properties on our platform.</p>
					<br/>
					<p>Best regards,<br/>The Localia Team</p>
				`,
			});
			this.logger.log(`Welcome email sent to ${to}`);
		} catch (err) {
			this.logger.error(`Failed to send welcome email to ${to}: ${err}`);
		}
	}

	async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
		try {
			const resetUrl = `${this.configService.get<string>('email.baseUrl') || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
			await this.resendService.send({
				from: this.fromEmail,
				to,
				subject: 'Reset your Localia password',
				html: `
					<h1>Password Reset Request</h1>
					<p>You requested a password reset for your Localia account.</p>
					<p>Click the link below to reset your password:</p>
					<p><a href="${resetUrl}">Reset Password</a></p>
					<p>This link will expire in 1 hour.</p>
					<p>If you didn't request this, please ignore this email.</p>
					<br/>
					<p>Best regards,<br/>The Localia Team</p>
				`,
			});
			this.logger.log(`Password reset email sent to ${to}`);
		} catch (err) {
			this.logger.error(`Failed to send password reset email to ${to}: ${err}`);
		}
	}
}
