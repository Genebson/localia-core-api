import { Inject, Injectable } from '@nestjs/common';
import { Property } from '../../../domain/entities/property.entity.js';
import { IPropertyRepository, PROPERTY_REPOSITORY_KEY } from './property.repository.interface.js';
import { CreatePropertyRequestDto } from './create-property.request.dto.js';
import { PropertyResponseDto } from './create-property.response.dto.js';

@Injectable()
export class CreatePropertyUseCase {
	constructor(
		@Inject(PROPERTY_REPOSITORY_KEY)
		private readonly repository: IPropertyRepository,
	) {}

	async execute(
		agentId: string,
		dto: CreatePropertyRequestDto,
	): Promise<{ property: PropertyResponseDto }> {
		const prop = Property.create({
			title: dto.title,
			description: dto.description,
			operation: dto.operation,
			propertyType: dto.propertyType,
			price: dto.price,
			currency: dto.currency,
			location: dto.location,
			address: dto.address,
			attributes: dto.attributes,
			images: dto.images ?? [],
			featured: dto.featured ?? false,
			published: dto.published ?? true,
			listingCode: dto.listingCode,
			isFinancingEligible: dto.isFinancingEligible ?? false,
			petFriendly: dto.petFriendly ?? false,
			airConditioning: dto.airConditioning ?? false,
			elevator: dto.elevator ?? false,
			balcony: dto.balcony ?? false,
			outdoor: dto.outdoor ?? false,
			garage: dto.garage ?? false,
			garden: dto.garden ?? false,
			pool: dto.pool ?? false,
			storageRoom: dto.storageRoom ?? false,
			accessible: dto.accessible ?? false,
			condition: dto.condition ?? null,
			furnishings: dto.furnishings ?? null,
			distributedTo: dto.distributedTo ?? [],
			agentId,
		});

		const saved = await this.repository.create(prop);
		return { property: PropertyResponseDto.fromEntity(saved) };
	}
}
