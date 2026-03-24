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
			if (!dto.tuition || dto.tuition.length < 5) {
				throw new BadRequestException('Tuition must be at least 5 characters');
			}
		}

		const tuitionValue = dto.role === UserRole.AGENT && dto.tuition ? dto.tuition : null;

		const updated = await this.userRepository.updateRole(userId, dto.role, tuitionValue);

		return UpdateUserResponseDto.fromEntity(updated);
	}
}
