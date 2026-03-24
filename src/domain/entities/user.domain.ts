import { Base } from './base.entity.js';
import { UserRole } from './user-role.enum.js';

export class User extends Base {
	email: string;
	name: string | null;
	emailVerified: boolean;
	image: string | null;
	role: UserRole;
	licenseNumber: string | null;

	constructor(
		id?: string,
		email?: string,
		name?: string | null,
		emailVerified?: boolean,
		image?: string | null,
		role?: UserRole,
		licenseNumber?: string | null,
		createdAt?: Date,
		updatedAt?: Date,
	) {
		super(id, createdAt, updatedAt);
		this.email = email ?? '';
		this.name = name ?? null;
		this.emailVerified = emailVerified ?? false;
		this.image = image ?? null;
		this.role = role ?? UserRole.SEEKER;
		this.licenseNumber = licenseNumber ?? null;
	}
}
