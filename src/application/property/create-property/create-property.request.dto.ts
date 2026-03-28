import { IsString, IsNumber, IsEnum, IsOptional, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class AttributesDto {
	@IsNumber()
	bedrooms: number;

	@IsNumber()
	bathrooms: number;

	@IsNumber()
	area: number;
}

export class CreatePropertyRequestDto {
	@IsString()
	title: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsEnum(['buy', 'rent'])
	operation: 'buy' | 'rent';

	@IsEnum(['apartment', 'house', 'penthouse', 'terrain', 'commercial'])
	propertyType: 'apartment' | 'house' | 'penthouse' | 'terrain' | 'commercial';

	@IsNumber()
	price: number;

	@IsEnum(['USD', 'ARS'])
	currency: 'USD' | 'ARS';

	@IsString()
	location: string;

	@IsOptional()
	@IsString()
	address?: string;

	@ValidateNested()
	@Type(() => AttributesDto)
	attributes: AttributesDto;

	@IsOptional()
	@IsString({ each: true })
	images?: string[];

	@IsOptional()
	@IsBoolean()
	featured?: boolean;
}
