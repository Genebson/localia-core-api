import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPropertyRepository, PROPERTY_REPOSITORY_KEY } from '../create-property/property.repository.interface.js';
import { PropertyResponseDto } from '../create-property/create-property.response.dto.js';

@Injectable()
export class GetPropertyUseCase {
	constructor(
		@Inject(PROPERTY_REPOSITORY_KEY)
		private readonly repository: IPropertyRepository,
	) {}

	async execute(propertyId: string): Promise<{ property: PropertyResponseDto }> {
		const existing = await this.repository.findById(propertyId);

		if (!existing) {
			throw new NotFoundException('Property not found');
		}

		return { property: PropertyResponseDto.fromEntity(existing) };
	}
}
