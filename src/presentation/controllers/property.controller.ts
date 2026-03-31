import { Controller, Post, Get, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { Session, UserSession, AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { CreatePropertyUseCase } from '../../application/property/create-property/create-property.use-case.js';
import { CreatePropertyRequestDto } from '../../application/property/create-property/create-property.request.dto.js';
import { ListMyPropertiesUseCase } from '../../application/property/list-my-properties/list-my-properties.use-case.js';
import { ListFeaturedPropertiesUseCase } from '../../application/property/list-featured-properties/list-featured-properties.use-case.js';
import { ListFeaturedPropertiesRequestDto } from '../../application/property/list-featured-properties/list-featured-properties.request.dto.js';
import { PaginatedPropertiesResponseDto } from '../../application/property/list-featured-properties/list-featured-properties.response.dto.js';
import { UpdatePropertyUseCase } from '../../application/property/update-property/update-property.use-case.js';
import { UpdatePropertyRequestDto } from '../../application/property/update-property/update-property.request.dto.js';
import { DeletePropertyUseCase } from '../../application/property/delete-property/delete-property.use-case.js';
import { GetPropertyUseCase } from '../../application/property/get-property/get-property.use-case.js';

@Controller()
export class PropertyController {
	constructor(
		private readonly createPropertyUseCase: CreatePropertyUseCase,
		private readonly listMyPropertiesUseCase: ListMyPropertiesUseCase,
		private readonly listFeaturedPropertiesUseCase: ListFeaturedPropertiesUseCase,
		private readonly updatePropertyUseCase: UpdatePropertyUseCase,
		private readonly deletePropertyUseCase: DeletePropertyUseCase,
		private readonly getPropertyUseCase: GetPropertyUseCase,
	) {}

	@AllowAnonymous()
	@Get('properties/featured')
	async listFeatured(
		@Query() query: ListFeaturedPropertiesRequestDto,
	): Promise<PaginatedPropertiesResponseDto> {
		return this.listFeaturedPropertiesUseCase.execute(query.page ?? 1, query.limit ?? 12);
	}

	@Post('property')
	async create(
		@Session() session: UserSession,
		@Body() dto: CreatePropertyRequestDto,
	) {
		if (!session?.user?.id) throw new Error('Not authenticated');
		return this.createPropertyUseCase.execute(session.user.id, dto);
	}

	@Get('properties')
	async list(@Session() session: UserSession) {
		if (!session?.user?.id) throw new Error('Not authenticated');
		return this.listMyPropertiesUseCase.execute(session.user.id);
	}

	@AllowAnonymous()
	@Get('property/:id')
	async get(@Param('id') id: string) {
		return this.getPropertyUseCase.execute(id);
	}

	@Put('property/:id')
	async update(
		@Session() session: UserSession,
		@Param('id') id: string,
		@Body() dto: UpdatePropertyRequestDto,
	) {
		if (!session?.user?.id) throw new Error('Not authenticated');
		return this.updatePropertyUseCase.execute(id, session.user.id, dto);
	}

	@Delete('property/:id')
	async delete(@Session() session: UserSession, @Param('id') id: string) {
		if (!session?.user?.id) throw new Error('Not authenticated');
		await this.deletePropertyUseCase.execute(id, session.user.id);
	}
}
