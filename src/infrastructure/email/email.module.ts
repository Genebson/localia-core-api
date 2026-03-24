import { Module } from '@nestjs/common';
import { ResendModule } from 'nestjs-resend';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service.js';

@Module({
	imports: [
		ConfigModule,
		ResendModule.forRootAsync({
			useFactory: (configService: ConfigService) => ({
				apiKey: configService.get<string>('email.apiKey') ?? '',
			}),
			inject: [ConfigService],
		}),
	],
	providers: [EmailService],
	exports: [EmailService],
})
export class EmailModule {}
