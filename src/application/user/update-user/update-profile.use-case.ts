import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { IUpdateUserRepository, UPDATE_USER_REPOSITORY_KEY } from './update-user.repository.interface.js';
import { UpdateProfileRequestDto } from './update-profile.request.dto.js';
import { GetUserResponseDto } from '../get-user/get-user.response.dto.js';

@Injectable()
export class UpdateProfileUseCase {
	constructor(
		@Inject(UPDATE_USER_REPOSITORY_KEY) private readonly userRepository: IUpdateUserRepository,
	) {}

	async execute(userId: string, dto: UpdateProfileRequestDto): Promise<GetUserResponseDto> {
		const user = await this.userRepository.updateNameAndPhone(
			userId,
			dto.name ?? '',
			dto.phone ?? '',
		);
		return GetUserResponseDto.fromEntity(user);
	}
}
