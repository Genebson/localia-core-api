import { User } from '../../../domain/entities/user.domain.js';
import { UserRole } from '../../../domain/entities/user-role.enum.js';

export const UPDATE_USER_REPOSITORY_KEY = 'update_user_repository';

export interface IUpdateUserRepository {
	updateRole(id: string, role: UserRole, licenseNumber: string | null): Promise<User>;
}
