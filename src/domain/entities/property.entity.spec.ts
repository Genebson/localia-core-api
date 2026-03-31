import {
	Property,
	PropertyOperation,
	PropertyType,
	PropertyCondition,
	Furnishings,
} from './property.entity.js';

describe('Property Domain Entity', () => {
	describe('Property.create', () => {
		it('should create a property with all required fields', () => {
			const prop = Property.create({
				title: 'Casa en Palermo',
				operation: 'buy',
				propertyType: 'house',
				price: 150000,
				currency: 'USD',
				location: 'Palermo, Buenos Aires',
				attributes: { bedrooms: 3, bathrooms: 2, area: 120 },
				agentId: 'agent-123',
			});

			expect(prop.title).toBe('Casa en Palermo');
			expect(prop.operation).toBe('buy');
			expect(prop.propertyType).toBe('house');
			expect(prop.price).toBe(150000);
			expect(prop.currency).toBe('USD');
			expect(prop.location).toBe('Palermo, Buenos Aires');
			expect(prop.attributes).toEqual({ bedrooms: 3, bathrooms: 2, area: 120 });
			expect(prop.agentId).toBe('agent-123');
			expect(prop.id).toBeTruthy();
			expect(prop.createdAt).toBeInstanceOf(Date);
		});

		it('should default published to true and set publishedAt', () => {
			const prop = Property.create({
				title: 'Departamento',
				operation: 'rent',
				propertyType: 'apartment',
				price: 50000,
				currency: 'ARS',
				location: 'Recoleta',
				attributes: { bedrooms: 2, bathrooms: 1, area: 60 },
				agentId: 'agent-123',
			});

			expect(prop.published).toBe(true);
			expect(prop.publishedAt).toBeInstanceOf(Date);
		});

		it('should not set publishedAt when published is false', () => {
			const prop = Property.create({
				title: 'Lote',
				operation: 'buy',
				propertyType: 'terrain',
				price: 80000,
				currency: 'USD',
				location: 'Nordelta',
				attributes: { bedrooms: 0, bathrooms: 0, area: 500 },
				agentId: 'agent-123',
				published: false,
			});

			expect(prop.published).toBe(false);
			expect(prop.publishedAt).toBeNull();
		});

		it('should generate a listing code when not provided', () => {
			const prop = Property.create({
				title: 'Ph',
				operation: 'buy',
				propertyType: 'penthouse',
				price: 200000,
				currency: 'USD',
				location: 'Puerto Madero',
				attributes: { bedrooms: 4, bathrooms: 3, area: 200 },
				agentId: 'agent-123',
			});

			expect(prop.listingCode).toMatch(/^LCL-\d{8}-[A-Z0-9]{6}$/);
		});

		it('should use provided listing code when given', () => {
			const prop = Property.create({
				title: 'Local comercial',
				operation: 'buy',
				propertyType: 'commercial-space',
				price: 300000,
				currency: 'USD',
				location: 'Centro',
				attributes: { bedrooms: 0, bathrooms: 1, area: 150 },
				agentId: 'agent-123',
				listingCode: 'LCL-CUSTOM-001',
			});

			expect(prop.listingCode).toBe('LCL-CUSTOM-001');
		});

		it('should default all feature booleans to false', () => {
			const prop = Property.create({
				title: 'Casa',
				operation: 'buy',
				propertyType: 'house',
				price: 100000,
				currency: 'USD',
				location: 'Barrio',
				attributes: { bedrooms: 2, bathrooms: 1, area: 80 },
				agentId: 'agent-123',
			});

			expect(prop.isFinancingEligible).toBe(false);
			expect(prop.petFriendly).toBe(false);
			expect(prop.airConditioning).toBe(false);
			expect(prop.elevator).toBe(false);
			expect(prop.balcony).toBe(false);
			expect(prop.outdoor).toBe(false);
			expect(prop.garage).toBe(false);
			expect(prop.garden).toBe(false);
			expect(prop.pool).toBe(false);
			expect(prop.storageRoom).toBe(false);
			expect(prop.accessible).toBe(false);
		});

		it('should set feature booleans when provided', () => {
			const prop = Property.create({
				title: 'Casa con pileta',
				operation: 'buy',
				propertyType: 'house',
				price: 180000,
				currency: 'USD',
				location: 'Barrio Privado',
				attributes: { bedrooms: 4, bathrooms: 3, area: 250 },
				agentId: 'agent-123',
				pool: true,
				garden: true,
				garage: true,
				petFriendly: true,
			});

			expect(prop.pool).toBe(true);
			expect(prop.garden).toBe(true);
			expect(prop.garage).toBe(true);
			expect(prop.petFriendly).toBe(true);
		});

		it('should default condition and furnishings to null', () => {
			const prop = Property.create({
				title: 'Departamento',
				operation: 'rent',
				propertyType: 'apartment',
				price: 60000,
				currency: 'ARS',
				location: 'Recoleta',
				attributes: { bedrooms: 1, bathrooms: 1, area: 45 },
				agentId: 'agent-123',
			});

			expect(prop.condition).toBeNull();
			expect(prop.furnishings).toBeNull();
		});

		it('should set condition and furnishings when provided', () => {
			const prop = Property.create({
				title: 'Casa amueblada',
				operation: 'rent',
				propertyType: 'house',
				price: 100000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 3, bathrooms: 2, area: 150 },
				agentId: 'agent-123',
				condition: 'good',
				furnishings: 'furnished',
			});

			expect(prop.condition).toBe('good');
			expect(prop.furnishings).toBe('furnished');
		});

		it('should default distributedTo to empty array', () => {
			const prop = Property.create({
				title: 'Lote',
				operation: 'buy',
				propertyType: 'lot',
				price: 50000,
				currency: 'USD',
				location: 'Tigre',
				attributes: { bedrooms: 0, bathrooms: 0, area: 1000 },
				agentId: 'agent-123',
			});

			expect(prop.distributedTo).toEqual([]);
		});

		it('should set distributedTo when provided', () => {
			const prop = Property.create({
				title: 'Departamento premium',
				operation: 'buy',
				propertyType: 'apartment',
				price: 250000,
				currency: 'USD',
				location: 'Puerto Madero',
				attributes: { bedrooms: 2, bathrooms: 2, area: 100 },
				agentId: 'agent-123',
				distributedTo: ['Zonaprop', 'Argenprop'],
			});

			expect(prop.distributedTo).toEqual(['Zonaprop', 'Argenprop']);
		});

		it('should default images to empty array', () => {
			const prop = Property.create({
				title: 'PH',
				operation: 'buy',
				propertyType: 'house',
				price: 90000,
				currency: 'USD',
				location: 'Almagro',
				attributes: { bedrooms: 2, bathrooms: 1, area: 70 },
				agentId: 'agent-123',
			});

			expect(prop.images).toEqual([]);
		});

		it('should set images when provided', () => {
			const prop = Property.create({
				title: 'Casa con fotos',
				operation: 'buy',
				propertyType: 'house',
				price: 120000,
				currency: 'USD',
				location: 'Belgrano',
				attributes: { bedrooms: 3, bathrooms: 2, area: 140 },
				agentId: 'agent-123',
				images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
			});

			expect(prop.images).toEqual(['https://example.com/img1.jpg', 'https://example.com/img2.jpg']);
		});
	});

	describe('Property.fromPersistence', () => {
		it('should restore a property from database row', () => {
			const now = new Date();
			const prop = Property.fromPersistence({
				id: 'prop-456',
				title: 'Restored Property',
				description: 'A restored property',
				operation: 'rent',
				propertyType: 'apartment',
				price: 45000,
				currency: 'ARS',
				location: 'Palermo',
				address: 'Calle Falsa 123',
				bedrooms: 2,
				bathrooms: 1,
				area: 65,
				images: ['img1.jpg'],
				featured: true,
				published: true,
				publishedAt: now,
				listingCode: 'LCL-20260331-ABCDEF',
				isFinancingEligible: true,
				petFriendly: true,
				airConditioning: false,
				elevator: true,
				balcony: false,
				outdoor: false,
				garage: false,
				garden: false,
				pool: false,
				storageRoom: false,
				accessible: false,
				condition: 'new',
				furnishings: 'equipped-kitchen',
				distributedTo: ['Zonaprop'],
				agentId: 'agent-789',
				createdAt: now,
				updatedAt: now,
				deletedAt: null,
			});

			expect(prop.id).toBe('prop-456');
			expect(prop.title).toBe('Restored Property');
			expect(prop.operation).toBe('rent');
			expect(prop.propertyType).toBe('apartment');
			expect(prop.published).toBe(true);
			expect(prop.publishedAt).toBe(now);
			expect(prop.listingCode).toBe('LCL-20260331-ABCDEF');
			expect(prop.isFinancingEligible).toBe(true);
			expect(prop.condition).toBe('new');
			expect(prop.furnishings).toBe('equipped-kitchen');
			expect(prop.distributedTo).toEqual(['Zonaprop']);
		});

		it('should handle null condition and furnishings from database', () => {
			const now = new Date();
			const prop = Property.fromPersistence({
				id: 'prop-789',
				title: 'No condition',
				description: null,
				operation: 'buy',
				propertyType: 'terrain',
				price: 70000,
				currency: 'USD',
				location: 'Escobar',
				address: null,
				bedrooms: 0,
				bathrooms: 0,
				area: 2000,
				images: [],
				featured: false,
				published: false,
				publishedAt: null,
				listingCode: null,
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
				agentId: 'agent-123',
				createdAt: now,
				updatedAt: now,
				deletedAt: null,
			});

			expect(prop.condition).toBeNull();
			expect(prop.furnishings).toBeNull();
			expect(prop.listingCode).toBeNull();
		});
	});

	describe('Property.update', () => {
		it('should update scalar fields', () => {
			const prop = Property.create({
				title: 'Original Title',
				operation: 'buy',
				propertyType: 'house',
				price: 100000,
				currency: 'USD',
				location: 'Location A',
				attributes: { bedrooms: 2, bathrooms: 1, area: 80 },
				agentId: 'agent-123',
			});

			prop.update({
				title: 'Updated Title',
				price: 120000,
				location: 'Location B',
			});

			expect(prop.title).toBe('Updated Title');
			expect(prop.price).toBe(120000);
			expect(prop.location).toBe('Location B');
		});

		it('should update published and auto-set publishedAt on first publish', () => {
			const prop = Property.create({
				title: 'Test Property',
				operation: 'buy',
				propertyType: 'apartment',
				price: 80000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 1, bathrooms: 1, area: 50 },
				agentId: 'agent-123',
				published: false,
			});

			expect(prop.published).toBe(false);
			expect(prop.publishedAt).toBeNull();

			const beforeUpdate = new Date();
			prop.update({ published: true });

			expect(prop.published).toBe(true);
			expect(prop.publishedAt).toBeInstanceOf(Date);
			expect(prop.publishedAt!.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
		});

		it('should not reset publishedAt when toggling published off then on', () => {
			const prop = Property.create({
				title: 'Test Property',
				operation: 'buy',
				propertyType: 'apartment',
				price: 80000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 1, bathrooms: 1, area: 50 },
				agentId: 'agent-123',
			});

			const originalPublishedAt = prop.publishedAt;
			prop.update({ published: false });
			prop.update({ published: true });

			expect(prop.publishedAt).toEqual(originalPublishedAt);
		});

		it('should update feature booleans via loop', () => {
			const prop = Property.create({
				title: 'Casa sin features',
				operation: 'buy',
				propertyType: 'house',
				price: 100000,
				currency: 'USD',
				location: 'Barrio',
				attributes: { bedrooms: 3, bathrooms: 2, area: 150 },
				agentId: 'agent-123',
			});

			prop.update({
				pool: true,
				garden: true,
				garage: true,
				airConditioning: true,
			});

			expect(prop.pool).toBe(true);
			expect(prop.garden).toBe(true);
			expect(prop.garage).toBe(true);
			expect(prop.airConditioning).toBe(true);
		});

		it('should update condition and furnishings', () => {
			const prop = Property.create({
				title: 'Departamento',
				operation: 'rent',
				propertyType: 'apartment',
				price: 50000,
				currency: 'ARS',
				location: 'Recoleta',
				attributes: { bedrooms: 2, bathrooms: 1, area: 70 },
				agentId: 'agent-123',
			});

			prop.update({ condition: 'needs-renovation', furnishings: 'furnished' });

			expect(prop.condition).toBe('needs-renovation');
			expect(prop.furnishings).toBe('furnished');
		});

		it('should replace entire distributedTo array', () => {
			const prop = Property.create({
				title: 'Propiedad',
				operation: 'buy',
				propertyType: 'apartment',
				price: 100000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 2, bathrooms: 1, area: 80 },
				agentId: 'agent-123',
				distributedTo: ['Zonaprop'],
			});

			prop.update({ distributedTo: ['Argenprop', 'MercadoLibre'] });

			expect(prop.distributedTo).toEqual(['Argenprop', 'MercadoLibre']);
		});

		it('should ignore undefined fields', () => {
			const prop = Property.create({
				title: 'Original',
				operation: 'buy',
				propertyType: 'house',
				price: 100000,
				currency: 'USD',
				location: 'Original Location',
				attributes: { bedrooms: 2, bathrooms: 1, area: 80 },
				agentId: 'agent-123',
			});

			const originalTitle = prop.title;
			const originalLocation = prop.location;
			prop.update({ title: 'Updated', price: 200000 });

			expect(prop.title).toBe('Updated');
			expect(prop.location).toBe(originalLocation);
		});

		it('should update updatedAt timestamp', () => {
			const prop = Property.create({
				title: 'Test',
				operation: 'buy',
				propertyType: 'apartment',
				price: 80000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 1, bathrooms: 1, area: 50 },
				agentId: 'agent-123',
			});

			const originalUpdatedAt = prop.updatedAt;
			prop.update({ title: 'New Title' });

			expect(prop.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
		});
	});

	describe('Property.publish / unpublish / togglePublished', () => {
		it('should publish and set publishedAt', () => {
			const prop = Property.create({
				title: 'Test',
				operation: 'buy',
				propertyType: 'apartment',
				price: 80000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 1, bathrooms: 1, area: 50 },
				agentId: 'agent-123',
				published: false,
			});

			prop.publish();

			expect(prop.published).toBe(true);
			expect(prop.publishedAt).toBeInstanceOf(Date);
		});

		it('should not reset publishedAt when publishing already published property', () => {
			const prop = Property.create({
				title: 'Test',
				operation: 'buy',
				propertyType: 'apartment',
				price: 80000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 1, bathrooms: 1, area: 50 },
				agentId: 'agent-123',
			});

			const originalPublishedAt = prop.publishedAt;
			prop.publish();

			expect(prop.publishedAt).toEqual(originalPublishedAt);
		});

		it('should unpublish', () => {
			const prop = Property.create({
				title: 'Test',
				operation: 'buy',
				propertyType: 'apartment',
				price: 80000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 1, bathrooms: 1, area: 50 },
				agentId: 'agent-123',
			});

			prop.unpublish();

			expect(prop.published).toBe(false);
		});

		it('should toggle from published to unpublished', () => {
			const prop = Property.create({
				title: 'Test',
				operation: 'buy',
				propertyType: 'apartment',
				price: 80000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 1, bathrooms: 1, area: 50 },
				agentId: 'agent-123',
			});

			prop.togglePublished();

			expect(prop.published).toBe(false);
		});

		it('should toggle from unpublished to published', () => {
			const prop = Property.create({
				title: 'Test',
				operation: 'buy',
				propertyType: 'apartment',
				price: 80000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 1, bathrooms: 1, area: 50 },
				agentId: 'agent-123',
				published: false,
			});

			prop.togglePublished();

			expect(prop.published).toBe(true);
		});
	});

	describe('Property.distributeTo / removeDistributedTo', () => {
		it('should add a portal to distributedTo', () => {
			const prop = Property.create({
				title: 'Test',
				operation: 'buy',
				propertyType: 'apartment',
				price: 80000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 1, bathrooms: 1, area: 50 },
				agentId: 'agent-123',
			});

			prop.distributeTo('Zonaprop');

			expect(prop.distributedTo).toContain('Zonaprop');
		});

		it('should not add duplicate portal', () => {
			const prop = Property.create({
				title: 'Test',
				operation: 'buy',
				propertyType: 'apartment',
				price: 80000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 1, bathrooms: 1, area: 50 },
				agentId: 'agent-123',
				distributedTo: ['Zonaprop'],
			});

			prop.distributeTo('Zonaprop');

			expect(prop.distributedTo).toEqual(['Zonaprop']);
		});

		it('should remove a portal from distributedTo', () => {
			const prop = Property.create({
				title: 'Test',
				operation: 'buy',
				propertyType: 'apartment',
				price: 80000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 1, bathrooms: 1, area: 50 },
				agentId: 'agent-123',
				distributedTo: ['Zonaprop', 'Argenprop'],
			});

			prop.removeDistributedTo('Zonaprop');

			expect(prop.distributedTo).toEqual(['Argenprop']);
		});
	});

	describe('Property.addImage / removeImage', () => {
		it('should add an image', () => {
			const prop = Property.create({
				title: 'Test',
				operation: 'buy',
				propertyType: 'apartment',
				price: 80000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 1, bathrooms: 1, area: 50 },
				agentId: 'agent-123',
			});

			prop.addImage('https://example.com/img1.jpg');

			expect(prop.images).toContain('https://example.com/img1.jpg');
		});

		it('should not add duplicate image', () => {
			const prop = Property.create({
				title: 'Test',
				operation: 'buy',
				propertyType: 'apartment',
				price: 80000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 1, bathrooms: 1, area: 50 },
				agentId: 'agent-123',
				images: ['https://example.com/img1.jpg'],
			});

			prop.addImage('https://example.com/img1.jpg');

			expect(prop.images).toEqual(['https://example.com/img1.jpg']);
		});

		it('should remove an image', () => {
			const prop = Property.create({
				title: 'Test',
				operation: 'buy',
				propertyType: 'apartment',
				price: 80000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 1, bathrooms: 1, area: 50 },
				agentId: 'agent-123',
				images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
			});

			prop.removeImage('https://example.com/img1.jpg');

			expect(prop.images).toEqual(['https://example.com/img2.jpg']);
		});

		it('should return a copy of images array from getter', () => {
			const prop = Property.create({
				title: 'Test',
				operation: 'buy',
				propertyType: 'apartment',
				price: 80000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 1, bathrooms: 1, area: 50 },
				agentId: 'agent-123',
				images: ['https://example.com/img1.jpg'],
			});

			const images1 = prop.images;
			images1.push('https://example.com/hacked.jpg');

			expect(prop.images).toEqual(['https://example.com/img1.jpg']);
		});
	});

	describe('Property.toggleFeatured', () => {
		it('should toggle featured from false to true', () => {
			const prop = Property.create({
				title: 'Test',
				operation: 'buy',
				propertyType: 'apartment',
				price: 80000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 1, bathrooms: 1, area: 50 },
				agentId: 'agent-123',
				featured: false,
			});

			prop.toggleFeatured();

			expect(prop.featured).toBe(true);
		});

		it('should toggle featured from true to false', () => {
			const prop = Property.create({
				title: 'Test',
				operation: 'buy',
				propertyType: 'apartment',
				price: 80000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 1, bathrooms: 1, area: 50 },
				agentId: 'agent-123',
				featured: true,
			});

			prop.toggleFeatured();

			expect(prop.featured).toBe(false);
		});
	});

	describe('Property.isOwnedBy', () => {
		it('should return true for owning agent', () => {
			const prop = Property.create({
				title: 'Test',
				operation: 'buy',
				propertyType: 'apartment',
				price: 80000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 1, bathrooms: 1, area: 50 },
				agentId: 'agent-123',
			});

			expect(prop.isOwnedBy('agent-123')).toBe(true);
		});

		it('should return false for non-owning agent', () => {
			const prop = Property.create({
				title: 'Test',
				operation: 'buy',
				propertyType: 'apartment',
				price: 80000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 1, bathrooms: 1, area: 50 },
				agentId: 'agent-123',
			});

			expect(prop.isOwnedBy('agent-456')).toBe(false);
		});
	});

	describe('Property.markDeleted', () => {
		it('should set deletedAt', () => {
			const prop = Property.create({
				title: 'Test',
				operation: 'buy',
				propertyType: 'apartment',
				price: 80000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 1, bathrooms: 1, area: 50 },
				agentId: 'agent-123',
			});

			expect(prop.deletedAt).toBeNull();

			prop.markDeleted();

			expect(prop.deletedAt).toBeInstanceOf(Date);
		});
	});

	describe('Property.priceLabel', () => {
		it('should format USD price for sell operation', () => {
			const prop = Property.create({
				title: 'Test',
				operation: 'buy',
				propertyType: 'house',
				price: 150000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 3, bathrooms: 2, area: 120 },
				agentId: 'agent-123',
			});

			expect(prop.priceLabel).toBe('USD 150,000');
		});

		it('should format ARS price for rent operation with /mes', () => {
			const prop = Property.create({
				title: 'Test',
				operation: 'rent',
				propertyType: 'apartment',
				price: 50000,
				currency: 'ARS',
				location: 'Recoleta',
				attributes: { bedrooms: 2, bathrooms: 1, area: 60 },
				agentId: 'agent-123',
			});

			expect(prop.priceLabel).toMatch(/\$ [\d,]+/);
			expect(prop.priceLabel).toContain('/mes');
		});
	});

	describe('Property.generateListingCode', () => {
		it('should generate a code with LCL prefix and date', () => {
			const code = Property.generateListingCode();

			expect(code).toMatch(/^LCL-\d{8}-[A-Z0-9]{6}$/);
		});

		it('should generate unique codes', () => {
			const code1 = Property.generateListingCode();
			const code2 = Property.generateListingCode();

			expect(code1).not.toBe(code2);
		});
	});

	describe('Property return types', () => {
		it('should return copy of distributedTo array', () => {
			const prop = Property.create({
				title: 'Test',
				operation: 'buy',
				propertyType: 'apartment',
				price: 80000,
				currency: 'USD',
				location: 'Palermo',
				attributes: { bedrooms: 1, bathrooms: 1, area: 50 },
				agentId: 'agent-123',
				distributedTo: ['Zonaprop'],
			});

			const dt1 = prop.distributedTo;
			dt1.push('Argenprop');

			expect(prop.distributedTo).toEqual(['Zonaprop']);
		});
	});
});
