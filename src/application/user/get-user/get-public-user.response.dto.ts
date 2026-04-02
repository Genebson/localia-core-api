import { User } from '../../../domain/entities/user.domain.js';

export class GetPublicUserResponseDto {
	data: {
		type: 'user';
		id: string;
		attributes: {
			name: string | null;
			image: string | null;
			phone: string | null;
			email: string;
			licenseNumber: string | null;
		};
	};

	constructor(partial: Partial<GetPublicUserResponseDto>) {
		Object.assign(this, partial);
	}

	static fromEntity(entity: User): GetPublicUserResponseDto {
		return new GetPublicUserResponseDto({
			data: {
				type: 'user',
				id: entity.id,
				attributes: {
					name: entity.name,
					image: entity.image,
					phone: entity.phone,
					email: entity.email,
					licenseNumber: entity.licenseNumber,
				},
			},
		});
	}
}
