import { Property } from '../../../domain/entities/property.entity.js';

export const PROPERTY_REPOSITORY_KEY = 'property_repository';

export interface IPropertyRepository {
	create(property: Property): Promise<Property>;
	findById(id: string): Promise<Property | null>;
	findByAgentId(agentId: string): Promise<Property[]>;
	findAllPaginated(page: number, limit: number): Promise<Property[]>;
	countAll(): Promise<number>;
	findAllFeatured(): Promise<Property[]>;
	findAllFeaturedPaginated(page: number, limit: number): Promise<Property[]>;
	countAllFeatured(): Promise<number>;
	update(property: Property): Promise<Property>;
	delete(id: string): Promise<void>;
}
