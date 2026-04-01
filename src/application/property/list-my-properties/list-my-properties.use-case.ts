import { Inject, Injectable } from '@nestjs/common';
import { IPropertyRepository, PROPERTY_REPOSITORY_KEY } from '../create-property/property.repository.interface.js';
import { PropertyResponseDto } from '../create-property/create-property.response.dto.js';
import { ListMyPropertiesRequestDto } from './list-my-properties.request.dto.js';
import { ListMyPropertiesResponseDto } from './list-my-properties.response.dto.js';

@Injectable()
export class ListMyPropertiesUseCase {
	constructor(
		@Inject(PROPERTY_REPOSITORY_KEY)
		private readonly repository: IPropertyRepository,
	) {}

	async execute(
		agentId: string,
		dto: ListMyPropertiesRequestDto,
	): Promise<ListMyPropertiesResponseDto> {
		const page = dto.page ?? 1;
		const limit = dto.limit ?? 10;
		const sort = dto.sort ?? 'desc';

		const { properties: entities, total } =
			await this.repository.findByAgentIdPaginated(agentId, page, limit, sort);

		const properties = entities.map((p) => PropertyResponseDto.fromEntity(p));

		return ListMyPropertiesResponseDto.from(properties, total, page, limit);
	}
}
