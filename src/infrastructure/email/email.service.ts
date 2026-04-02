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

	async sendContactEmail(
		to: string,
		agentName: string,
		seekerName: string,
		seekerEmail: string,
		seekerPhone: string,
		message: string,
		propertyTitle: string,
		propertyPrice: string,
		propertyLocation: string,
		propertyUrl: string,
	): Promise<void> {
		try {
			await this.resendService.send({
				from: this.fromEmail,
				to,
				subject: `Nuevo contacto por: ${propertyTitle}`,
				html: `
					<h2>Nuevo mensaje de contacto</h2>
					<p>Un usuario está interesado en tu propiedad.</p>
					<hr/>
					<h3>Datos del usuario</h3>
					<ul>
						<li><strong>Nombre:</strong> ${seekerName}</li>
						<li><strong>Email:</strong> ${seekerEmail}</li>
						<li><strong>Teléfono:</strong> ${seekerPhone}</li>
					</ul>
					<h3>Mensaje</h3>
					<p>${message}</p>
					<hr/>
					<h3>Propiedad</h3>
					<ul>
						<li><strong>Título:</strong> ${propertyTitle}</li>
						<li><strong>Precio:</strong> ${propertyPrice}</li>
						<li><strong>Ubicación:</strong> ${propertyLocation}</li>
						<li><strong>Enlace:</strong> <a href="${propertyUrl}">${propertyUrl}</a></li>
					</ul>
					<br/>
					<p>Best regards,<br/>The Localia Team</p>
				`,
			});
			this.logger.log(`Contact email sent to agent ${to} for property ${propertyTitle}`);
		} catch (err) {
			this.logger.error(`Failed to send contact email to ${to}: ${err}`);
		}
	}
}
