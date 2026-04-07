import { IsEnum, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';
import { UserRole } from '../../../domain/entities/user-role.enum.js';

export class UpdateUserRequestDto {
	@IsOptional()
	@IsString()
	image?: string;

	@ValidateIf((o) => o.role !== undefined)
	@IsEnum(UserRole)
	role?: UserRole;

	@IsOptional()
	@IsString()
	@MinLength(5)
	licenseNumber?: string;
}
