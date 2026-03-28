import { Property } from '../../../domain/entities/property.entity.js';

export class PropertyResponseDto {
	id: string;
	title: string;
	description: string | null;
	operation: 'buy' | 'rent';
	propertyType: 'apartment' | 'house' | 'penthouse' | 'terrain' | 'commercial';
	price: number;
	currency: 'USD' | 'ARS';
	location: string;
	address: string | null;
	attributes: { bedrooms: number; bathrooms: number; area: number };
	images: string[];
	priceLabel: string;
	image: string | null;
	featured: boolean;
	agentId: string;
	createdAt: string;
	updatedAt: string;

	static fromEntity(prop: Property): PropertyResponseDto {
		const dto = new PropertyResponseDto();
		dto.id = prop.id;
		dto.title = prop.title;
		dto.description = prop.description;
		dto.operation = prop.operation;
		dto.propertyType = prop.propertyType;
		dto.price = prop.price;
		dto.currency = prop.currency;
		dto.location = prop.location;
		dto.address = prop.address;
		dto.attributes = { ...prop.attributes };
		dto.images = [...prop.images];
		dto.priceLabel = prop.priceLabel;
		dto.image = prop.images[0] ?? null;
		dto.featured = prop.featured;
		dto.agentId = prop.agentId;
		dto.createdAt = prop.createdAt.toISOString();
		dto.updatedAt = prop.updatedAt.toISOString();
		return dto;
	}
}
