import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { IUpdateUserRepository, UPDATE_USER_REPOSITORY_KEY } from './update-user.repository.interface.js';
import { UpdateUserRequestDto } from './update-user.request.dto.js';
import { UpdateUserResponseDto } from './update-user.response.dto.js';
import { UserRole } from '../../../domain/entities/user-role.enum.js';

@Injectable()
export class UpdateUserUseCase {
	constructor(
		@Inject(UPDATE_USER_REPOSITORY_KEY) private readonly userRepository: IUpdateUserRepository,
	) {}

	async execute(userId: string, dto: UpdateUserRequestDto): Promise<UpdateUserResponseDto> {
		if (dto.role === UserRole.AGENT) {
			if (!dto.licenseNumber || dto.licenseNumber.length < 5) {
				throw new BadRequestException('License number must be at least 5 characters');
			}
		}

		const licenseNumberValue = dto.role === UserRole.AGENT && dto.licenseNumber ? dto.licenseNumber : null;

		const updated = await this.userRepository.updateRole(userId, dto.role, licenseNumberValue);

		return UpdateUserResponseDto.fromEntity(updated);
	}
}
