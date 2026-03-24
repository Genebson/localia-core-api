import { Controller, Get, Post, Patch, Body, Req } from '@nestjs/common';
import { Session, UserSession, AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { EmailService } from '../../infrastructure/email/email.service.js';
import { auth } from '../../config/database.config.js';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private readonly emailService: EmailService) {}

	@Post('welcome-email')
	@AllowAnonymous()
	async sendWelcomeEmail(@Body() body: { email: string; name: string }) {
		await this.emailService.sendWelcomeEmail(body.email, body.name ?? 'User');
		return { success: true };
	}

	@Patch('profile/role')
	async setRole(@Session() session: UserSession, @Body() body: { role: 'agent' | 'seeker' }, @Req() req: Request) {
		const cookie = req.headers.cookie ?? '';
		await auth.api.updateUser({
			body: { role: body.role },
			headers: { cookie },
		});
		return { data: { type: 'role', id: session.user.id, attributes: { role: body.role } } };
	}

	@Get('me')
	async getProfile(@Session() session: UserSession) {
		return {
			data: {
				type: 'user',
				id: session.user.id,
				attributes: {
					email: session.user.email,
					name: session.user.name,
					image: session.user.image,
				},
			},
		};
	}

	@Get('session')
	@AllowAnonymous()
	async getSession(@Session() session: UserSession) {
		if (!session) {
			return { data: null };
		}
		return {
			data: {
				type: 'session',
				id: session.session.id,
				attributes: {
					expiresAt: session.session.expiresAt,
					userId: session.user.id,
				},
			},
		};
	}
}
