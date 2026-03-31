import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IPropertyRepository, PROPERTY_REPOSITORY_KEY } from '../create-property/property.repository.interface.js';
import { UpdatePropertyRequestDto } from './update-property.request.dto.js';
import { PropertyResponseDto } from '../create-property/create-property.response.dto.js';

@Injectable()
export class UpdatePropertyUseCase {
	constructor(
		@Inject(PROPERTY_REPOSITORY_KEY)
		private readonly repository: IPropertyRepository,
	) {}

	async execute(
		propertyId: string,
		agentId: string,
		dto: UpdatePropertyRequestDto,
	): Promise<{ property: PropertyResponseDto }> {
		const existing = await this.repository.findById(propertyId);

		if (!existing) {
			throw new NotFoundException('Property not found');
		}

		if (!existing.isOwnedBy(agentId)) {
			throw new ForbiddenException('You do not own this property');
		}

		existing.update({
			title: dto.title,
			description: dto.description,
			operation: dto.operation,
			propertyType: dto.propertyType,
			price: dto.price,
			currency: dto.currency,
			location: dto.location,
			address: dto.address,
			attributes: dto.attributes,
			images: dto.images,
			featured: dto.featured,
			published: dto.published,
			publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
			listingCode: dto.listingCode,
			isFinancingEligible: dto.isFinancingEligible,
			petFriendly: dto.petFriendly,
			airConditioning: dto.airConditioning,
			elevator: dto.elevator,
			balcony: dto.balcony,
			outdoor: dto.outdoor,
			garage: dto.garage,
			garden: dto.garden,
			pool: dto.pool,
			storageRoom: dto.storageRoom,
			accessible: dto.accessible,
			condition: dto.condition,
			furnishings: dto.furnishings,
			distributedTo: dto.distributedTo,
		});

		const saved = await this.repository.update(existing);
		return { property: PropertyResponseDto.fromEntity(saved) };
	}
}
