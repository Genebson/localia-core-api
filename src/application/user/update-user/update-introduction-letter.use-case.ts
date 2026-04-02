import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { IUpdateUserRepository, UPDATE_USER_REPOSITORY_KEY } from './update-user.repository.interface.js';
import { UpdateIntroductionLetterRequestDto } from './update-introduction-letter.request.dto.js';
import { GetUserResponseDto } from '../get-user/get-user.response.dto.js';

@Injectable()
export class UpdateIntroductionLetterUseCase {
	constructor(
		@Inject(UPDATE_USER_REPOSITORY_KEY) private readonly userRepository: IUpdateUserRepository,
	) {}

	async execute(userId: string, dto: UpdateIntroductionLetterRequestDto): Promise<GetUserResponseDto> {
		if (dto.introductionLetter.length > 300) {
			throw new BadRequestException('Introduction letter cannot exceed 300 characters');
		}

		const user = await this.userRepository.updateIntroductionLetter(userId, dto.introductionLetter);
		return GetUserResponseDto.fromEntity(user);
	}
}
