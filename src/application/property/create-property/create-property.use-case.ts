import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
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
			featured: dto.featured ?? true,
			agentId,
		});

		const saved = await this.repository.create(prop);
		return { property: PropertyResponseDto.fromEntity(saved) };
	}
}
