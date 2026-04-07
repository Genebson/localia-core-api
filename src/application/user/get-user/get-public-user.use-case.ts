import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IGetUserRepository, GET_USER_REPOSITORY_KEY } from './get-user.repository.interface.js';
import { GetPublicUserResponseDto } from './get-public-user.response.dto.js';

@Injectable()
export class GetPublicUserUseCase {
	constructor(
		@Inject(GET_USER_REPOSITORY_KEY) private readonly userRepository: IGetUserRepository,
	) {}

	async execute(userId: string): Promise<GetPublicUserResponseDto> {
		const user = await this.userRepository.findById(userId);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return GetPublicUserResponseDto.fromEntity(user);
	}
}
