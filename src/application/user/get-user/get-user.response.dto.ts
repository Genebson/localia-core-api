import { User } from '../../../domain/entities/user.domain.js';
import { UserRole } from '../../../domain/entities/user-role.enum.js';

export class GetUserResponseDto {
	data: {
		type: 'user';
		id: string;
		attributes: {
			email: string;
			name: string | null;
			image: string | null;
			phone: string | null;
			role: UserRole;
			licenseNumber: string | null;
			tenantCount: number;
			pets: 'none' | 'has_pet';
			moveDate: 'asap' | 'flexible' | 'exact_date';
			monthlyIncome: number | null;
			introductionLetter: string | null;
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
					image: entity.image,
					phone: entity.phone,
					role: entity.role,
					licenseNumber: entity.licenseNumber,
					tenantCount: entity.tenantCount,
					pets: entity.pets,
					moveDate: entity.moveDate,
					monthlyIncome: entity.monthlyIncome,
					introductionLetter: entity.introductionLetter,
				},
			},
		});
	}
}
