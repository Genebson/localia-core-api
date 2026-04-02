import { Controller, Post, Body } from '@nestjs/common';
import { AllowAnonymous } from '../../infrastructure/auth/allow-anonymous.js';
import { SendEmailToAgentUseCase } from '../../application/contact/send-email-to-agent/send-email-to-agent.use-case.js';
import { SendEmailToAgentRequestDto } from '../../application/contact/send-email-to-agent/send-email-to-agent.request.dto.js';
import { SendEmailToAgentResponseDto } from '../../application/contact/send-email-to-agent/send-email-to-agent.response.dto.js';

@Controller('contact')
export class ContactController {
	constructor(private readonly sendEmailToAgentUseCase: SendEmailToAgentUseCase) {}

	@Post('send-email')
	@AllowAnonymous()
	async sendEmail(@Body() body: SendEmailToAgentRequestDto): Promise<SendEmailToAgentResponseDto> {
		return this.sendEmailToAgentUseCase.execute(body);
	}
}
