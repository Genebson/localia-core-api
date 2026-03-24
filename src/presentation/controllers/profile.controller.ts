import { Controller, Get, Patch, Body } from '@nestjs/common';
import { Session, UserSession, AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { UpdateUserUseCase } from '../../application/user/update-user/update-user.use-case.js';
import { GetUserUseCase } from '../../application/user/get-user/get-user.use-case.js';
import { UpdateUserRequestDto } from '../../application/user/update-user/update-user.request.dto.js';
import { UpdateUserResponseDto } from '../../application/user/update-user/update-user.response.dto.js';
import { GetUserResponseDto } from '../../application/user/get-user/get-user.response.dto.js';

@Controller('profile')
export class ProfileController {
	constructor(
		private readonly updateUserUseCase: UpdateUserUseCase,
		private readonly getUserUseCase: GetUserUseCase,
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
}
