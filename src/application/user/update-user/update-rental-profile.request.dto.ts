import { IsNumber, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateRentalProfileRequestDto {
	@IsNumber()
	@Transform(({ value }) => parseInt(value, 10))
	tenantCount: number;

	@IsString()
	pets: 'none' | 'has_pet';

	@IsString()
	moveDate: 'asap' | 'flexible' | 'exact_date';

	@IsNumber()
	@IsOptional()
	@Transform(({ value }) => (value ? parseInt(value, 10) : null))
	monthlyIncome?: number | null;
}
