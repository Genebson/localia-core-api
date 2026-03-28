import { IsString, IsNumber, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AttributesDto {
	@IsNumber()
	bedrooms: number;

	@IsNumber()
	bathrooms: number;

	@IsNumber()
	area: number;
}

export class UpdatePropertyRequestDto {
	@IsOptional()
	@IsString()
	title?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsEnum(['buy', 'rent'])
	operation?: 'buy' | 'rent';

	@IsOptional()
	@IsEnum(['apartment', 'house', 'penthouse', 'terrain', 'commercial'])
	propertyType?: 'apartment' | 'house' | 'penthouse' | 'terrain' | 'commercial';

	@IsOptional()
	@IsNumber()
	price?: number;

	@IsOptional()
	@IsEnum(['USD', 'ARS'])
	currency?: 'USD' | 'ARS';

	@IsOptional()
	@IsString()
	location?: string;

	@IsOptional()
	@IsString()
	address?: string;

	@IsOptional()
	@ValidateNested()
	@Type(() => AttributesDto)
	attributes?: AttributesDto;

	@IsOptional()
	@IsString({ each: true })
	images?: string[];

	@IsOptional()
	featured?: boolean;
}
