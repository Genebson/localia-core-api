import { PropertyResponseDto } from '../create-property/create-property.response.dto.js';

export class ListMyPropertiesResponseDto {
	constructor(
		public readonly properties: PropertyResponseDto[],
		public readonly total: number,
		public readonly page: number,
		public readonly limit: number,
		public readonly totalPages: number,
	) {}

	static from(
		properties: PropertyResponseDto[],
		total: number,
		page: number,
		limit: number,
	): ListMyPropertiesResponseDto {
		return new ListMyPropertiesResponseDto(
			properties,
			total,
			page,
			limit,
			Math.ceil(total / limit),
		);
	}
}
