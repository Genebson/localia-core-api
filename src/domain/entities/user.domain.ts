import { Base } from './base.entity.js';
import { UserRole } from './user-role.enum.js';

export class User extends Base {
	email: string;
	name: string | null;
	emailVerified: boolean;
	image: string | null;
	role: UserRole;
	licenseNumber: string | null;
	phone: string | null;
	tenantCount: number;
	pets: 'none' | 'has_pet';
	moveDate: 'asap' | 'flexible' | 'exact_date';
	monthlyIncome: number | null;
	introductionLetter: string | null;

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
		this.phone = null;
		this.tenantCount = 1;
		this.pets = 'none';
		this.moveDate = 'flexible';
		this.monthlyIncome = null;
		this.introductionLetter = null;
	}
}
