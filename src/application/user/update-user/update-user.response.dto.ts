import { User } from '../../../domain/entities/user.domain.js';
import { UserRole } from '../../../domain/entities/user-role.enum.js';

export class UpdateUserResponseDto {
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

	constructor(partial: Partial<UpdateUserResponseDto>) {
		Object.assign(this, partial);
	}

	static fromEntity(entity: User): UpdateUserResponseDto {
		return new UpdateUserResponseDto({
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
