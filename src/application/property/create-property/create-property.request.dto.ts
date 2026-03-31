import {
	IsString,
	IsNumber,
	IsEnum,
	IsOptional,
	ValidateNested,
	IsBoolean,
} from 'class-validator';
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

	@IsEnum([
		'apartment',
		'house',
		'penthouse',
		'terrain',
		'commercial',
		'lot',
		'farm',
		'country-house',
		'warehouse',
		'estate',
		'land',
		'commercial-space',
	])
	propertyType:
		| 'apartment'
		| 'house'
		| 'penthouse'
		| 'terrain'
		| 'commercial'
		| 'lot'
		| 'farm'
		| 'country-house'
		| 'warehouse'
		| 'estate'
		| 'land'
		| 'commercial-space';

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

	@IsOptional()
	@IsBoolean()
	published?: boolean;

	@IsOptional()
	@IsString()
	listingCode?: string;

	@IsOptional()
	@IsBoolean()
	isFinancingEligible?: boolean;

	@IsOptional()
	@IsBoolean()
	petFriendly?: boolean;

	@IsOptional()
	@IsBoolean()
	airConditioning?: boolean;

	@IsOptional()
	@IsBoolean()
	elevator?: boolean;

	@IsOptional()
	@IsBoolean()
	balcony?: boolean;

	@IsOptional()
	@IsBoolean()
	outdoor?: boolean;

	@IsOptional()
	@IsBoolean()
	garage?: boolean;

	@IsOptional()
	@IsBoolean()
	garden?: boolean;

	@IsOptional()
	@IsBoolean()
	pool?: boolean;

	@IsOptional()
	@IsBoolean()
	storageRoom?: boolean;

	@IsOptional()
	@IsBoolean()
	accessible?: boolean;

	@IsOptional()
	@IsEnum(['new', 'good', 'needs-renovation'])
	condition?: 'new' | 'good' | 'needs-renovation';

	@IsOptional()
	@IsEnum(['furnished', 'equipped-kitchen'])
	furnishings?: 'furnished' | 'equipped-kitchen';

	@IsOptional()
	@IsString({ each: true })
	distributedTo?: string[];
}
