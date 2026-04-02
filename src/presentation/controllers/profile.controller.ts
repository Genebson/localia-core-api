import { Controller, Get, Patch, Post, Body } from '@nestjs/common';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { UpdateUserUseCase } from '../../application/user/update-user/update-user.use-case.js';
import { UpdateProfileUseCase } from '../../application/user/update-user/update-profile.use-case.js';
import { UploadUserImageUseCase } from '../../application/user/upload-user-image/upload-user-image.use-case.js';
import { UpdateRentalProfileUseCase } from '../../application/user/update-user/update-rental-profile.use-case.js';
import { UpdateIntroductionLetterUseCase } from '../../application/user/update-user/update-introduction-letter.use-case.js';
import { GetUserUseCase } from '../../application/user/get-user/get-user.use-case.js';
import { UpdateUserRequestDto } from '../../application/user/update-user/update-user.request.dto.js';
import { UpdateUserResponseDto } from '../../application/user/update-user/update-user.response.dto.js';
import { GetUserResponseDto } from '../../application/user/get-user/get-user.response.dto.js';
import { UploadUserImageRequestDto } from '../../application/user/upload-user-image/upload-user-image.request.dto.js';
import { UploadUserImageResponseDto } from '../../application/user/upload-user-image/upload-user-image.response.dto.js';
import { UpdateProfileRequestDto } from '../../application/user/update-user/update-profile.request.dto.js';
import { UpdateRentalProfileRequestDto } from '../../application/user/update-user/update-rental-profile.request.dto.js';
import { UpdateIntroductionLetterRequestDto } from '../../application/user/update-user/update-introduction-letter.request.dto.js';

@Controller('profile')
export class ProfileController {
	constructor(
		private readonly updateUserUseCase: UpdateUserUseCase,
		private readonly getUserUseCase: GetUserUseCase,
		private readonly updateProfileUseCase: UpdateProfileUseCase,
		private readonly uploadUserImageUseCase: UploadUserImageUseCase,
		private readonly updateRentalProfileUseCase: UpdateRentalProfileUseCase,
		private readonly updateIntroductionLetterUseCase: UpdateIntroductionLetterUseCase,
	) {}

	@Patch('role')
	async updateRole(
		@Session() session: UserSession,
		@Body() dto: UpdateUserRequestDto,
	): Promise<UpdateUserResponseDto> {
		if (!session?.user?.id) {
			throw new Error('Not authenticated');
		}
		return this.updateUserUseCase.execute(session.user.id, dto);
	}

	@Get()
	async getUser(@Session() session: UserSession): Promise<GetUserResponseDto> {
		if (!session?.user?.id) {
			throw new Error('Not authenticated');
		}
		return this.getUserUseCase.execute(session.user.id);
	}

	@Patch()
	async updateProfile(
		@Session() session: UserSession,
		@Body() dto: UpdateProfileRequestDto,
	): Promise<GetUserResponseDto> {
		if (!session?.user?.id) {
			throw new Error('Not authenticated');
		}
		return this.updateProfileUseCase.execute(session.user.id, dto);
	}

	@Post('image')
	async uploadImage(
		@Session() session: UserSession,
		@Body() dto: UploadUserImageRequestDto,
	): Promise<UploadUserImageResponseDto> {
		if (!session?.user?.id) {
			throw new Error('Not authenticated');
		}
		const { url } = await this.uploadUserImageUseCase.execute(dto);
		return new UploadUserImageResponseDto(url);
	}

	@Patch('rental-profile')
	async updateRentalProfile(
		@Session() session: UserSession,
		@Body() dto: UpdateRentalProfileRequestDto,
	): Promise<GetUserResponseDto> {
		if (!session?.user?.id) {
			throw new Error('Not authenticated');
		}
		return this.updateRentalProfileUseCase.execute(session.user.id, dto);
	}

	@Patch('introduction-letter')
	async updateIntroductionLetter(
		@Session() session: UserSession,
		@Body() dto: UpdateIntroductionLetterRequestDto,
	): Promise<GetUserResponseDto> {
		if (!session?.user?.id) {
			throw new Error('Not authenticated');
		}
		return this.updateIntroductionLetterUseCase.execute(session.user.id, dto);
	}
}
