import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IGetUserRepository, GET_USER_REPOSITORY_KEY } from './get-user.repository.interface.js';
import { GetUserResponseDto } from './get-user.response.dto.js';

@Injectable()
export class GetUserUseCase {
	constructor(
		@Inject(GET_USER_REPOSITORY_KEY) private readonly userRepository: IGetUserRepository,
	) {}

	async execute(userId: string): Promise<GetUserResponseDto> {
		const user = await this.userRepository.findById(userId);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return GetUserResponseDto.fromEntity(user);
	}
}
