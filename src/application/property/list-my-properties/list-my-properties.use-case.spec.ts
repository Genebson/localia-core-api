import { ListMyPropertiesUseCase } from './list-my-properties.use-case.js';
import { IPropertyRepository, PROPERTY_REPOSITORY_KEY } from '../create-property/property.repository.interface.js';
import { Property } from '../../../domain/entities/property.entity.js';
import { ListMyPropertiesRequestDto } from './list-my-properties.request.dto.js';

describe('ListMyPropertiesUseCase', () => {
	let useCase: ListMyPropertiesUseCase;
	let mockRepository: jest.Mocked<IPropertyRepository>;

	const mockAgentId = 'agent-123';

	function makeProperty(overrides: Partial<{
		id: string;
		title: string;
		createdAt: Date;
		agentId: string;
	}> = {}): Property {
		return Property.create({
			title: overrides.title ?? 'Casa en Palermo',
			operation: 'buy',
			propertyType: 'house',
			price: 150000,
			currency: 'USD',
			location: 'Palermo, Buenos Aires',
			attributes: { bedrooms: 3, bathrooms: 2, area: 120 },
			images: [],
			agentId: overrides.agentId ?? mockAgentId,
		});
	}

	beforeEach(() => {
		mockRepository = {
			create: jest.fn(),
			findById: jest.fn(),
			findByAgentId: jest.fn(),
			findByAgentIdPaginated: jest.fn(),
			findAllPaginated: jest.fn(),
			countAll: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		};
		useCase = new ListMyPropertiesUseCase(mockRepository);
	});

	it('should return paginated properties with correct metadata', async () => {
		const now = new Date();
		const props = [
			makeProperty({ id: 'prop-1', title: 'Casa 1', createdAt: now }),
			makeProperty({ id: 'prop-2', title: 'Casa 2', createdAt: new Date(now.getTime() - 1000) }),
		];

		mockRepository.findByAgentIdPaginated.mockResolvedValue({
			properties: props,
			total: 2,
		});

		const dto = new ListMyPropertiesRequestDto();
		dto.page = 1;
		dto.limit = 10;
		dto.sort = 'desc';

		const result = await useCase.execute(mockAgentId, dto);

		expect(result.properties).toHaveLength(2);
		expect(result.total).toBe(2);
		expect(result.page).toBe(1);
		expect(result.limit).toBe(10);
		expect(result.totalPages).toBe(1);
		expect(mockRepository.findByAgentIdPaginated).toHaveBeenCalledWith(mockAgentId, 1, 10, 'desc');
	});

	it('should apply default values when params are undefined', async () => {
		mockRepository.findByAgentIdPaginated.mockResolvedValue({
			properties: [],
			total: 0,
		});

		const dto = new ListMyPropertiesRequestDto();

		const result = await useCase.execute(mockAgentId, dto);

		expect(mockRepository.findByAgentIdPaginated).toHaveBeenCalledWith(mockAgentId, 1, 10, 'desc');
		expect(result.page).toBe(1);
		expect(result.limit).toBe(10);
		expect(result.totalPages).toBe(0);
	});

	it('should calculate totalPages correctly', async () => {
		const now = new Date();
		const props = Array.from({ length: 10 }, (_, i) =>
			makeProperty({ id: `prop-${i}`, createdAt: now }),
		);

		mockRepository.findByAgentIdPaginated.mockResolvedValue({
			properties: props,
			total: 25,
		});

		const dto = new ListMyPropertiesRequestDto();
		dto.page = 1;
		dto.limit = 10;
		dto.sort = 'desc';

		const result = await useCase.execute(mockAgentId, dto);

		expect(result.totalPages).toBe(3);
	});

	it('should pass sort asc to repository', async () => {
		mockRepository.findByAgentIdPaginated.mockResolvedValue({
			properties: [],
			total: 0,
		});

		const dto = new ListMyPropertiesRequestDto();
		dto.page = 1;
		dto.limit = 10;
		dto.sort = 'asc';

		await useCase.execute(mockAgentId, dto);

		expect(mockRepository.findByAgentIdPaginated).toHaveBeenCalledWith(mockAgentId, 1, 10, 'asc');
	});

	it('should return empty when agent has no properties', async () => {
		mockRepository.findByAgentIdPaginated.mockResolvedValue({
			properties: [],
			total: 0,
		});

		const dto = new ListMyPropertiesRequestDto();
		const result = await useCase.execute(mockAgentId, dto);

		expect(result.properties).toHaveLength(0);
		expect(result.total).toBe(0);
		expect(result.totalPages).toBe(0);
	});

	it('should map property entities to response DTOs', async () => {
		const now = new Date();
		const prop = makeProperty({
			title: 'Depto Centro',
			createdAt: now,
		});

		mockRepository.findByAgentIdPaginated.mockResolvedValue({
			properties: [prop],
			total: 1,
		});

		const dto = new ListMyPropertiesRequestDto();
		const result = await useCase.execute(mockAgentId, dto);

		expect(result.properties[0].id).toBeDefined();
		expect(result.properties[0].title).toBe('Depto Centro');
	});
});
