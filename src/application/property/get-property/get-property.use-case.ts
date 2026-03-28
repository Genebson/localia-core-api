import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IPropertyRepository, PROPERTY_REPOSITORY_KEY } from '../create-property/property.repository.interface.js';
import { PropertyResponseDto } from '../create-property/create-property.response.dto.js';

@Injectable()
export class GetPropertyUseCase {
	constructor(
		@Inject(PROPERTY_REPOSITORY_KEY)
		private readonly repository: IPropertyRepository,
	) {}

	async execute(propertyId: string, agentId: string): Promise<{ property: PropertyResponseDto }> {
		const existing = await this.repository.findById(propertyId);

		if (!existing) {
			throw new NotFoundException('Property not found');
		}

		if (!existing.isOwnedBy(agentId)) {
			throw new ForbiddenException('You do not own this property');
		}

		return { property: PropertyResponseDto.fromEntity(existing) };
	}
}
