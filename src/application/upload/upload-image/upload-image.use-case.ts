import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadImageRequestDto } from './upload-image.request.dto.js';

@Injectable()
export class UploadImageUseCase {
	constructor(private readonly config: ConfigService) {}

	async execute(dto: UploadImageRequestDto): Promise<{ url: string }> {
		const cloudName = this.config.get<string>('cloudinary.cloudName');
		const uploadPreset = this.config.get<string>('cloudinary.uploadPreset');

		if (!cloudName || !uploadPreset) {
			throw new Error('Cloudinary is not configured');
		}

		const formData = new FormData();
		formData.append('file', dto.data);
		formData.append('upload_preset', uploadPreset);

		const response = await fetch(
			`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
			{
				method: 'POST',
				body: formData,
			},
		);

		if (!response.ok) {
			throw new Error(`Cloudinary upload failed: ${response.statusText}`);
		}

		const result = await response.json() as { secure_url: string };
		return { url: result.secure_url };
	}
}
