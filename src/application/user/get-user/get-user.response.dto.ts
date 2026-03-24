import { User } from '../../../domain/entities/user.domain.js';
import { UserRole } from '../../../domain/entities/user-role.enum.js';

export class GetUserResponseDto {
	data: {
		type: 'user';
		id: string;
		attributes: {
			email: string;
			name: string | null;
			role: UserRole;
			tuition: string | null;
		};
	};

	constructor(partial: Partial<GetUserResponseDto>) {
		Object.assign(this, partial);
	}

	static fromEntity(entity: User): GetUserResponseDto {
		return new GetUserResponseDto({
			data: {
				type: 'user',
				id: entity.id,
				attributes: {
					email: entity.email,
					name: entity.name,
					role: entity.role,
					tuition: entity.tuition,
				},
			},
		});
	}
}
