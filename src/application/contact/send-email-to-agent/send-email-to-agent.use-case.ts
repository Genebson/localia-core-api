import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPropertyRepository, PROPERTY_REPOSITORY_KEY } from '../../property/create-property/property.repository.interface.js';
import { IGetUserRepository, GET_USER_REPOSITORY_KEY } from '../../user/get-user/get-user.repository.interface.js';
import { EmailService } from '../../../infrastructure/email/email.service.js';
import { SendEmailToAgentRequestDto } from './send-email-to-agent.request.dto.js';
import { SendEmailToAgentResponseDto } from './send-email-to-agent.response.dto.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendEmailToAgentUseCase {
	constructor(
		@Inject(PROPERTY_REPOSITORY_KEY)
		private readonly propertyRepository: IPropertyRepository,
		@Inject(GET_USER_REPOSITORY_KEY)
		private readonly userRepository: IGetUserRepository,
		private readonly emailService: EmailService,
		private readonly configService: ConfigService,
	) {}

	async execute(request: SendEmailToAgentRequestDto): Promise<SendEmailToAgentResponseDto> {
		const property = await this.propertyRepository.findById(request.propertyId);

		if (!property) {
			throw new NotFoundException('Property not found');
		}

		const agent = await this.userRepository.findById(property.agentId);

		if (!agent || !agent.email) {
			throw new NotFoundException('Agent not found or has no email');
		}

		const baseUrl =
			this.configService.get<string>('email.baseUrl') ||
			'http://localhost:5173';

		const propertyUrl = `${baseUrl}/property/${property.id}`;

		await this.emailService.sendContactEmail(
			agent.email,
			agent.name ?? 'Agente',
			request.seekerName,
			request.seekerEmail,
			request.seekerPhone,
			request.message,
			property.title,
			property.priceLabel,
			property.location,
			propertyUrl,
		);

		return SendEmailToAgentResponseDto.ok();
	}
}
