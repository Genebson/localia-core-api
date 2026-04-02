import { IsString } from 'class-validator';

export class UploadUserImageRequestDto {
	@IsString()
	image: string;
}
