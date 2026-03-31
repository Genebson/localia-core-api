import { Property } from '../../../domain/entities/property.entity.js';

export class PropertyResponseDto {
	id: string;
	title: string;
	description: string | null;
	operation: 'buy' | 'rent';
	propertyType:
		| 'apartment'
		| 'house'
		| 'penthouse'
		| 'terrain'
		| 'commercial'
		| 'lot'
		| 'farm'
		| 'country-house'
		| 'warehouse'
		| 'estate'
		| 'land'
		| 'commercial-space';
	price: number;
	currency: 'USD' | 'ARS';
	location: string;
	address: string | null;
	attributes: { bedrooms: number; bathrooms: number; area: number };
	images: string[];
	priceLabel: string;
	image: string | null;
	featured: boolean;
	published: boolean;
	publishedAt: string | null;
	listingCode: string | null;
	isFinancingEligible: boolean;
	petFriendly: boolean;
	airConditioning: boolean;
	elevator: boolean;
	balcony: boolean;
	outdoor: boolean;
	garage: boolean;
	garden: boolean;
	pool: boolean;
	storageRoom: boolean;
	accessible: boolean;
	condition: 'new' | 'good' | 'needs-renovation' | null;
	furnishings: 'furnished' | 'equipped-kitchen' | null;
	distributedTo: string[];
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
		dto.published = prop.published;
		dto.publishedAt = prop.publishedAt?.toISOString() ?? null;
		dto.listingCode = prop.listingCode;
		dto.isFinancingEligible = prop.isFinancingEligible;
		dto.petFriendly = prop.petFriendly;
		dto.airConditioning = prop.airConditioning;
		dto.elevator = prop.elevator;
		dto.balcony = prop.balcony;
		dto.outdoor = prop.outdoor;
		dto.garage = prop.garage;
		dto.garden = prop.garden;
		dto.pool = prop.pool;
		dto.storageRoom = prop.storageRoom;
		dto.accessible = prop.accessible;
		dto.condition = prop.condition;
		dto.furnishings = prop.furnishings;
		dto.distributedTo = [...prop.distributedTo];
		dto.agentId = prop.agentId;
		dto.createdAt = prop.createdAt.toISOString();
		dto.updatedAt = prop.updatedAt.toISOString();
		return dto;
	}
}
