import { CreatePropertyUseCase } from './create-property.use-case.js';
import { IPropertyRepository, PROPERTY_REPOSITORY_KEY } from './property.repository.interface.js';
import { Property } from '../../../domain/entities/property.entity.js';
import { CreatePropertyRequestDto } from './create-property.request.dto.js';

describe('CreatePropertyUseCase', () => {
	let useCase: CreatePropertyUseCase;
	let mockRepository: jest.Mocked<IPropertyRepository>;

	beforeEach(() => {
		mockRepository = {
			create: jest.fn(),
			findById: jest.fn(),
			findByAgentId: jest.fn(),
			findAllFeatured: jest.fn(),
			findAllFeaturedPaginated: jest.fn(),
			countAllFeatured: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		};
		useCase = new CreatePropertyUseCase(mockRepository);
	});

	const baseDto = () => {
		const dto = new CreatePropertyRequestDto();
		dto.title = 'Casa en Palermo';
		dto.operation = 'buy';
		dto.propertyType = 'house';
		dto.price = 150000;
		dto.currency = 'USD';
		dto.location = 'Palermo, Buenos Aires';
		dto.attributes = { bedrooms: 3, bathrooms: 2, area: 120 };
		return dto;
	};

	it('should create a property with all required fields', async () => {
		const dto = baseDto();
		const savedProperty = Property.create({
			title: dto.title,
			operation: dto.operation as 'buy' | 'rent',
			propertyType: dto.propertyType as Property['propertyType'],
			price: dto.price,
			currency: dto.currency,
			location: dto.location,
			attributes: dto.attributes,
			agentId: 'agent-123',
		});

		mockRepository.create.mockResolvedValue(savedProperty);

		const result = await useCase.execute('agent-123', dto);

		expect(result.property.title).toBe('Casa en Palermo');
		expect(result.property.operation).toBe('buy');
		expect(result.property.propertyType).toBe('house');
		expect(result.property.price).toBe(150000);
		expect(result.property.currency).toBe('USD');
		expect(result.property.location).toBe('Palermo, Buenos Aires');
		expect(result.property.attributes).toEqual({ bedrooms: 3, bathrooms: 2, area: 120 });
		expect(mockRepository.create).toHaveBeenCalled();
	});

	it('should default published to true when not provided', async () => {
		const dto = baseDto();
		const savedProperty = Property.create({
			title: dto.title,
			operation: dto.operation as 'buy' | 'rent',
			propertyType: dto.propertyType as Property['propertyType'],
			price: dto.price,
			currency: dto.currency,
			location: dto.location,
			attributes: dto.attributes,
			agentId: 'agent-123',
			published: true,
		});

		mockRepository.create.mockResolvedValue(savedProperty);

		const result = await useCase.execute('agent-123', dto);

		expect(result.property.published).toBe(true);
	});

	it('should pass published false to repository when explicitly set', async () => {
		const dto = baseDto();
		dto.published = false;
		const savedProperty = Property.create({
			title: dto.title,
			operation: dto.operation as 'buy' | 'rent',
			propertyType: dto.propertyType as Property['propertyType'],
			price: dto.price,
			currency: dto.currency,
			location: dto.location,
			attributes: dto.attributes,
			agentId: 'agent-123',
			published: false,
		});

		mockRepository.create.mockResolvedValue(savedProperty);

		const result = await useCase.execute('agent-123', dto);

		expect(result.property.published).toBe(false);
	});

	it('should pass all extended fields to Property.create', async () => {
		const dto = baseDto();
		dto.listingCode = 'LCL-CUSTOM-001';
		dto.isFinancingEligible = true;
		dto.petFriendly = true;
		dto.airConditioning = true;
		dto.elevator = true;
		dto.balcony = true;
		dto.outdoor = true;
		dto.garage = true;
		dto.garden = true;
		dto.pool = true;
		dto.storageRoom = true;
		dto.accessible = true;
		dto.condition = 'good';
		dto.furnishings = 'furnished';
		dto.distributedTo = ['Zonaprop', 'Argenprop'];
		dto.images = ['https://example.com/img1.jpg'];

		const savedProperty = Property.create({
			title: dto.title,
			operation: dto.operation as 'buy' | 'rent',
			propertyType: dto.propertyType as Property['propertyType'],
			price: dto.price,
			currency: dto.currency,
			location: dto.location,
			attributes: dto.attributes,
			agentId: 'agent-123',
			listingCode: dto.listingCode,
			isFinancingEligible: dto.isFinancingEligible,
			petFriendly: dto.petFriendly,
			airConditioning: dto.airConditioning,
			elevator: dto.elevator,
			balcony: dto.balcony,
			outdoor: dto.outdoor,
			garage: dto.garage,
			garden: dto.garden,
			pool: dto.pool,
			storageRoom: dto.storageRoom,
			accessible: dto.accessible,
			condition: dto.condition as 'new' | 'good' | 'needs-renovation',
			furnishings: dto.furnishings as 'furnished' | 'equipped-kitchen',
			distributedTo: dto.distributedTo,
			images: dto.images,
		});

		mockRepository.create.mockResolvedValue(savedProperty);

		const result = await useCase.execute('agent-123', dto);

		expect(result.property.listingCode).toBe('LCL-CUSTOM-001');
		expect(result.property.isFinancingEligible).toBe(true);
		expect(result.property.petFriendly).toBe(true);
		expect(result.property.airConditioning).toBe(true);
		expect(result.property.elevator).toBe(true);
		expect(result.property.balcony).toBe(true);
		expect(result.property.outdoor).toBe(true);
		expect(result.property.garage).toBe(true);
		expect(result.property.garden).toBe(true);
		expect(result.property.pool).toBe(true);
		expect(result.property.storageRoom).toBe(true);
		expect(result.property.accessible).toBe(true);
		expect(result.property.condition).toBe('good');
		expect(result.property.furnishings).toBe('furnished');
		expect(result.property.distributedTo).toEqual(['Zonaprop', 'Argenprop']);
		expect(result.property.images).toEqual(['https://example.com/img1.jpg']);
	});

	it('should default all feature booleans to false when not provided', async () => {
		const dto = baseDto();
		const savedProperty = Property.create({
			title: dto.title,
			operation: dto.operation as 'buy' | 'rent',
			propertyType: dto.propertyType as Property['propertyType'],
			price: dto.price,
			currency: dto.currency,
			location: dto.location,
			attributes: dto.attributes,
			agentId: 'agent-123',
		});

		mockRepository.create.mockResolvedValue(savedProperty);

		const result = await useCase.execute('agent-123', dto);

		expect(result.property.isFinancingEligible).toBe(false);
		expect(result.property.petFriendly).toBe(false);
		expect(result.property.airConditioning).toBe(false);
		expect(result.property.elevator).toBe(false);
		expect(result.property.balcony).toBe(false);
		expect(result.property.outdoor).toBe(false);
		expect(result.property.garage).toBe(false);
		expect(result.property.garden).toBe(false);
		expect(result.property.pool).toBe(false);
		expect(result.property.storageRoom).toBe(false);
		expect(result.property.accessible).toBe(false);
	});

	it('should set condition and furnishings to null when not provided', async () => {
		const dto = baseDto();
		const savedProperty = Property.create({
			title: dto.title,
			operation: dto.operation as 'buy' | 'rent',
			propertyType: dto.propertyType as Property['propertyType'],
			price: dto.price,
			currency: dto.currency,
			location: dto.location,
			attributes: dto.attributes,
			agentId: 'agent-123',
		});

		mockRepository.create.mockResolvedValue(savedProperty);

		const result = await useCase.execute('agent-123', dto);

		expect(result.property.condition).toBeNull();
		expect(result.property.furnishings).toBeNull();
	});

	it('should default distributedTo to empty array when not provided', async () => {
		const dto = baseDto();
		const savedProperty = Property.create({
			title: dto.title,
			operation: dto.operation as 'buy' | 'rent',
			propertyType: dto.propertyType as Property['propertyType'],
			price: dto.price,
			currency: dto.currency,
			location: dto.location,
			attributes: dto.attributes,
			agentId: 'agent-123',
		});

		mockRepository.create.mockResolvedValue(savedProperty);

		const result = await useCase.execute('agent-123', dto);

		expect(result.property.distributedTo).toEqual([]);
	});

	it('should set featured to false when not provided', async () => {
		const dto = baseDto();
		const savedProperty = Property.create({
			title: dto.title,
			operation: dto.operation as 'buy' | 'rent',
			propertyType: dto.propertyType as Property['propertyType'],
			price: dto.price,
			currency: dto.currency,
			location: dto.location,
			attributes: dto.attributes,
			agentId: 'agent-123',
			featured: false,
		});

		mockRepository.create.mockResolvedValue(savedProperty);

		const result = await useCase.execute('agent-123', dto);

		expect(result.property.featured).toBe(false);
	});

	it('should call repository.create with property entity', async () => {
		const dto = baseDto();
		const savedProperty = Property.create({
			title: dto.title,
			operation: dto.operation as 'buy' | 'rent',
			propertyType: dto.propertyType as Property['propertyType'],
			price: dto.price,
			currency: dto.currency,
			location: dto.location,
			attributes: dto.attributes,
			agentId: 'agent-123',
		});

		mockRepository.create.mockResolvedValue(savedProperty);

		await useCase.execute('agent-123', dto);

		expect(mockRepository.create).toHaveBeenCalledTimes(1);
		const createdProp = mockRepository.create.mock.calls[0][0];
		expect(createdProp).toBeInstanceOf(Property);
	});

	it('should map condition needs-renovation enum value', async () => {
		const dto = baseDto();
		dto.condition = 'needs-renovation';
		const savedProperty = Property.create({
			title: dto.title,
			operation: dto.operation as 'buy' | 'rent',
			propertyType: dto.propertyType as Property['propertyType'],
			price: dto.price,
			currency: dto.currency,
			location: dto.location,
			attributes: dto.attributes,
			agentId: 'agent-123',
			condition: 'needs-renovation',
		});

		mockRepository.create.mockResolvedValue(savedProperty);

		const result = await useCase.execute('agent-123', dto);

		expect(result.property.condition).toBe('needs-renovation');
	});

	it('should map furnishings equipped-kitchen enum value', async () => {
		const dto = baseDto();
		dto.furnishings = 'equipped-kitchen';
		const savedProperty = Property.create({
			title: dto.title,
			operation: dto.operation as 'buy' | 'rent',
			propertyType: dto.propertyType as Property['propertyType'],
			price: dto.price,
			currency: dto.currency,
			location: dto.location,
			attributes: dto.attributes,
			agentId: 'agent-123',
			furnishings: 'equipped-kitchen',
		});

		mockRepository.create.mockResolvedValue(savedProperty);

		const result = await useCase.execute('agent-123', dto);

		expect(result.property.furnishings).toBe('equipped-kitchen');
	});
});
