import { Controller, Get, Param } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { GetPublicUserUseCase } from '../../application/user/get-user/get-public-user.use-case.js';
import { GetPublicUserResponseDto } from '../../application/user/get-user/get-public-user.response.dto.js';

@Controller('users')
export class UsersController {
	constructor(private readonly getPublicUserUseCase: GetPublicUserUseCase) {}

	@AllowAnonymous()
	@Get(':id')
	async getPublicUser(@Param('id') id: string): Promise<GetPublicUserResponseDto> {
		return this.getPublicUserUseCase.execute(id);
	}
}
