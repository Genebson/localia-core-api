import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../../domain/entities/user-role.enum.js';

export class UpdateUserRequestDto {
	@IsEnum(UserRole)
	role: UserRole;

	@IsOptional()
	@IsString()
	@MinLength(5)
	licenseNumber?: string;
}
