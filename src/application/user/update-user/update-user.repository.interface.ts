import { User } from '../../../domain/entities/user.domain.js';
import { UserRole } from '../../../domain/entities/user-role.enum.js';

export const UPDATE_USER_REPOSITORY_KEY = 'update_user_repository';

export interface IUpdateUserRepository {
	updateRole(id: string, role: UserRole, licenseNumber: string | null): Promise<User>;
	updateImage(id: string, image: string): Promise<User>;
	updateNameAndPhone(id: string, name: string, phone: string): Promise<User>;
	updateRentalProfile(id: string, tenantCount: number, pets: string, moveDate: string, monthlyIncome: number | null): Promise<User>;
	updateIntroductionLetter(id: string, introductionLetter: string): Promise<User>;
}
