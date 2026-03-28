import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IPropertyRepository, PROPERTY_REPOSITORY_KEY } from '../create-property/property.repository.interface.js';

@Injectable()
export class DeletePropertyUseCase {
	constructor(
		@Inject(PROPERTY_REPOSITORY_KEY)
		private readonly repository: IPropertyRepository,
	) {}

	async execute(propertyId: string, agentId: string): Promise<void> {
		const existing = await this.repository.findById(propertyId);

		if (!existing) {
			throw new NotFoundException('Property not found');
		}

		if (!existing.isOwnedBy(agentId)) {
			throw new ForbiddenException('You do not own this property');
		}

		await this.repository.delete(propertyId);
	}
}
