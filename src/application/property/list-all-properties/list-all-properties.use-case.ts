import { Inject, Injectable } from '@nestjs/common';
import { IPropertyRepository, PROPERTY_REPOSITORY_KEY } from '../create-property/property.repository.interface.js';
import { PropertyResponseDto } from '../create-property/create-property.response.dto.js';
import { PaginatedPropertiesResponseDto } from './list-all-properties.response.dto.js';

@Injectable()
export class ListAllPropertiesUseCase {
	constructor(
		@Inject(PROPERTY_REPOSITORY_KEY)
		private readonly repository: IPropertyRepository,
	) {}

	async execute(page: number = 1, limit: number = 12): Promise<PaginatedPropertiesResponseDto> {
		const [items, totalItems] = await Promise.all([
			this.repository.findAllPaginated(page, limit),
			this.repository.countAll(),
		]);

		return PaginatedPropertiesResponseDto.from(
			page,
			totalItems,
			limit,
			items.map((p) => PropertyResponseDto.fromEntity(p)),
		);
	}
}