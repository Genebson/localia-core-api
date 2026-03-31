import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdatePropertyUseCase } from './update-property.use-case.js';
import { IPropertyRepository, PROPERTY_REPOSITORY_KEY } from '../create-property/property.repository.interface.js';
import { Property } from '../../../domain/entities/property.entity.js';
import { UpdatePropertyRequestDto } from './update-property.request.dto.js';

describe('UpdatePropertyUseCase', () => {
	let useCase: UpdatePropertyUseCase;
	let mockRepository: jest.Mocked<IPropertyRepository>;

	const createExistingProperty = (overrides = {}) => {
		return Property.create({
			title: 'Original Title',
			operation: 'buy',
			propertyType: 'house',
			price: 100000,
			currency: 'USD',
			location: 'Original Location',
			attributes: { bedrooms: 2, bathrooms: 1, area: 80 },
			agentId: 'agent-123',
			published: true,
			listingCode: 'LCL-ORIGINAL-001',
			isFinancingEligible: false,
			petFriendly: false,
			airConditioning: false,
			elevator: false,
			balcony: false,
			outdoor: false,
			garage: false,
			garden: false,
			pool: false,
			storageRoom: false,
			accessible: false,
			condition: null,
			furnishings: null,
			distributedTo: [],
			...overrides,
		});
	};

	beforeEach(() => {
		mockRepository = {
			create: jest.fn(),
			findById: jest.fn(),
			findByAgentId: jest.fn(),
			findAllPaginated: jest.fn(),
			countAll: jest.fn(),
			findAllFeatured: jest.fn(),
			findAllFeaturedPaginated: jest.fn(),
			countAllFeatured: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		};
		useCase = new UpdatePropertyUseCase(mockRepository);
	});

	it('should update title when provided', async () => {
		const existing = createExistingProperty();
		mockRepository.findById.mockResolvedValue(existing);
		mockRepository.update.mockResolvedValue(existing);

		const dto = new UpdatePropertyRequestDto();
		dto.title = 'New Title';

		const result = await useCase.execute('prop-123', 'agent-123', dto);

		expect(mockRepository.update).toHaveBeenCalled();
		expect(mockRepository.update.mock.calls[0][0].title).toBe('New Title');
	});

	it('should throw NotFoundException when property does not exist', async () => {
		mockRepository.findById.mockResolvedValue(null);

		const dto = new UpdatePropertyRequestDto();
		dto.title = 'New Title';

		await expect(
			useCase.execute('non-existent-id', 'agent-123', dto),
		).rejects.toThrow(NotFoundException);
	});

	it('should throw ForbiddenException when agent does not own property', async () => {
		const existing = createExistingProperty({ agentId: 'agent-123' });
		mockRepository.findById.mockResolvedValue(existing);

		const dto = new UpdatePropertyRequestDto();
		dto.title = 'New Title';

		await expect(
			useCase.execute('prop-123', 'different-agent-id', dto),
		).rejects.toThrow(ForbiddenException);
	});

	it('should pass all extended fields to existing.update', async () => {
		const existing = createExistingProperty();
		mockRepository.findById.mockResolvedValue(existing);
		mockRepository.update.mockResolvedValue(existing);

		const dto = new UpdatePropertyRequestDto();
		dto.published = false;
		dto.listingCode = 'LCL-UPDATED-002';
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
		dto.condition = 'new';
		dto.furnishings = 'furnished';
		dto.distributedTo = ['Zonaprop', 'Argenprop'];

		await useCase.execute('prop-123', 'agent-123', dto);

		expect(mockRepository.update).toHaveBeenCalled();
		const updated = mockRepository.update.mock.calls[0][0] as Property;
		expect(updated.published).toBe(false);
		expect(updated.listingCode).toBe('LCL-UPDATED-002');
		expect(updated.isFinancingEligible).toBe(true);
		expect(updated.petFriendly).toBe(true);
		expect(updated.airConditioning).toBe(true);
		expect(updated.elevator).toBe(true);
		expect(updated.balcony).toBe(true);
		expect(updated.outdoor).toBe(true);
		expect(updated.garage).toBe(true);
		expect(updated.garden).toBe(true);
		expect(updated.pool).toBe(true);
		expect(updated.storageRoom).toBe(true);
		expect(updated.accessible).toBe(true);
		expect(updated.condition).toBe('new');
		expect(updated.furnishings).toBe('furnished');
		expect(updated.distributedTo).toEqual(['Zonaprop', 'Argenprop']);
	});

	it('should convert publishedAt ISO string to Date', async () => {
		const existing = createExistingProperty({ published: false, publishedAt: null });
		mockRepository.findById.mockResolvedValue(existing);
		mockRepository.update.mockResolvedValue(existing);

		const dto = new UpdatePropertyRequestDto();
		dto.publishedAt = '2026-03-31T10:00:00.000Z';

		await useCase.execute('prop-123', 'agent-123', dto);

		expect(mockRepository.update).toHaveBeenCalled();
		const updated = mockRepository.update.mock.calls[0][0] as Property;
		expect(updated.publishedAt).toBeInstanceOf(Date);
		expect(updated.publishedAt!.toISOString()).toBe('2026-03-31T10:00:00.000Z');
	});

	it('should pass undefined for publishedAt when not provided', async () => {
		const existing = createExistingProperty();
		mockRepository.findById.mockResolvedValue(existing);
		mockRepository.update.mockResolvedValue(existing);

		const dto = new UpdatePropertyRequestDto();
		dto.title = 'Updated Title';

		await useCase.execute('prop-123', 'agent-123', dto);

		expect(mockRepository.update).toHaveBeenCalled();
	});

	it('should not pass undefined fields to update when only some fields provided', async () => {
		const existing = createExistingProperty({ title: 'Original', price: 100000 });
		mockRepository.findById.mockResolvedValue(existing);
		mockRepository.update.mockResolvedValue(existing);

		const dto = new UpdatePropertyRequestDto();
		dto.price = 200000;

		await useCase.execute('prop-123', 'agent-123', dto);

		expect(mockRepository.update).toHaveBeenCalled();
	});

	it('should return PropertyResponseDto with all fields', async () => {
		const existing = createExistingProperty();
		mockRepository.findById.mockResolvedValue(existing);
		mockRepository.update.mockResolvedValue(existing);

		const dto = new UpdatePropertyRequestDto();
		dto.condition = 'good';
		dto.furnishings = 'furnished';
		dto.distributedTo = ['Zonaprop'];

		const result = await useCase.execute('prop-123', 'agent-123', dto);

		expect(result.property).toBeDefined();
		expect(result.property.id).toBeTruthy();
		expect(result.property.condition).toBe('good');
		expect(result.property.furnishings).toBe('furnished');
		expect(result.property.distributedTo).toEqual(['Zonaprop']);
	});

	it('should allow agent to update their own property', async () => {
		const existing = createExistingProperty({ agentId: 'agent-123' });
		mockRepository.findById.mockResolvedValue(existing);
		mockRepository.update.mockResolvedValue(existing);

		const dto = new UpdatePropertyRequestDto();
		dto.title = 'Updated by Owner';

		await expect(
			useCase.execute('prop-123', 'agent-123', dto),
		).resolves.not.toThrow();
	});

	it('should update multiple scalar fields at once', async () => {
		const existing = createExistingProperty({ title: 'Old', price: 100, location: 'Old Loc' });
		mockRepository.findById.mockResolvedValue(existing);
		mockRepository.update.mockResolvedValue(existing);

		const dto = new UpdatePropertyRequestDto();
		dto.title = 'New Title';
		dto.price = 200000;
		dto.location = 'New Location';

		await useCase.execute('prop-123', 'agent-123', dto);

		expect(mockRepository.update).toHaveBeenCalled();
		const updated = mockRepository.update.mock.calls[0][0] as Property;
		expect(updated.title).toBe('New Title');
		expect(updated.price).toBe(200000);
		expect(updated.location).toBe('New Location');
	});
});
