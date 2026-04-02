import { Inject, Injectable } from '@nestjs/common';
import { IUpdateUserRepository, UPDATE_USER_REPOSITORY_KEY } from './update-user.repository.interface.js';
import { UpdateRentalProfileRequestDto } from './update-rental-profile.request.dto.js';
import { GetUserResponseDto } from '../get-user/get-user.response.dto.js';

@Injectable()
export class UpdateRentalProfileUseCase {
	constructor(
		@Inject(UPDATE_USER_REPOSITORY_KEY) private readonly userRepository: IUpdateUserRepository,
	) {}

	async execute(userId: string, dto: UpdateRentalProfileRequestDto): Promise<GetUserResponseDto> {
		const user = await this.userRepository.updateRentalProfile(
			userId,
			dto.tenantCount,
			dto.pets,
			dto.moveDate,
			dto.monthlyIncome ?? null,
		);
		return GetUserResponseDto.fromEntity(user);
	}
}
