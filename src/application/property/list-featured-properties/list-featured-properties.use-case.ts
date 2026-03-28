import { Inject, Injectable } from '@nestjs/common';
import { IPropertyRepository, PROPERTY_REPOSITORY_KEY } from '../create-property/property.repository.interface.js';
import { PropertyResponseDto } from '../create-property/create-property.response.dto.js';

@Injectable()
export class ListFeaturedPropertiesUseCase {
	constructor(
		@Inject(PROPERTY_REPOSITORY_KEY)
		private readonly repository: IPropertyRepository,
	) {}

	async execute(): Promise<{ properties: PropertyResponseDto[] }> {
		const properties = await this.repository.findAllFeatured();
		return { properties: properties.map((p) => PropertyResponseDto.fromEntity(p)) };
	}
}
