import { PropertyResponseDto } from '../create-property/create-property.response.dto.js';

export class LinkDto {
	constructor(public readonly href: string) {}
}

export class LinksDto {
	constructor(
		public readonly prev?: LinkDto,
		public readonly next?: LinkDto,
	) {}
}

export class PaginatedPropertiesResponseDto {
	constructor(
		public readonly currentPage: number,
		public readonly totalItems: number,
		public readonly totalPages: number,
		public readonly items: PropertyResponseDto[],
		public readonly links: LinksDto,
	) {}

	static from(
		page: number,
		totalItems: number,
		limit: number,
		items: PropertyResponseDto[],
	): PaginatedPropertiesResponseDto {
		const totalPages = Math.ceil(totalItems / limit);
		const links = new LinksDto(
			page > 1
				? new LinkDto(`/properties?page=${page - 1}&limit=${limit}`)
				: undefined,
			page < totalPages
				? new LinkDto(`/properties?page=${page + 1}&limit=${limit}`)
				: undefined,
		);
		return new PaginatedPropertiesResponseDto(page, totalItems, totalPages, items, links);
	}
}