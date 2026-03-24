import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@ApiTags('Health')
@Controller()
export class HealthController {
	@Get('health')
	@ApiOperation({ summary: 'Health check endpoint' })
	@ApiResponse({
		status: 200,
		description: 'Application health status',
		content: {
			'application/vnd.api+json': {
				schema: {
					type: 'object',
					properties: {
						data: {
							type: 'object',
							properties: {
								type: { type: 'string', example: 'health' },
								id: { type: 'string', example: '1' },
								attributes: {
									type: 'object',
									properties: {
										status: { type: 'string', example: 'ok' },
										timestamp: { type: 'string', format: 'date-time' },
									},
								},
							},
						},
					},
				},
			},
		},
	})
	@AllowAnonymous()
	check() {
		return {
			data: {
				type: 'health',
				id: '1',
				attributes: {
					status: 'ok',
					timestamp: new Date().toISOString(),
				},
			},
		};
	}
}
