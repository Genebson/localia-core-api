import { Controller, Post, Body } from '@nestjs/common';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { UploadImageUseCase } from '../../application/upload/upload-image/upload-image.use-case.js';
import { UploadImageRequestDto } from '../../application/upload/upload-image/upload-image.request.dto.js';

@Controller()
export class UploadController {
	constructor(private readonly uploadImageUseCase: UploadImageUseCase) {}

	@Post('upload')
	async upload(@Session() session: UserSession, @Body() dto: UploadImageRequestDto) {
		if (!session?.user?.id) throw new Error('Not authenticated');
		return this.uploadImageUseCase.execute(dto);
	}
}
