import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class SendEmailToAgentRequestDto {
	@IsString()
	@IsNotEmpty()
	propertyId!: string;

	@IsString()
	@IsNotEmpty()
	seekerName!: string;

	@IsEmail()
	seekerEmail!: string;

	@IsString()
	@IsNotEmpty()
	seekerPhone!: string;

	@IsString()
	@IsNotEmpty()
	message!: string;
}
