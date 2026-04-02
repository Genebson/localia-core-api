export class SendEmailToAgentResponseDto {
	success!: boolean;
	message!: string;

	static ok(): SendEmailToAgentResponseDto {
		const dto = new SendEmailToAgentResponseDto();
		dto.success = true;
		dto.message = 'Email sent successfully';
		return dto;
	}
}
