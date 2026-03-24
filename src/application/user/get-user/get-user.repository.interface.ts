import { User } from '../../../domain/entities/user.domain.js';

export const GET_USER_REPOSITORY_KEY = 'get_user_repository';

export interface IGetUserRepository {
	findById(id: string): Promise<User | null>;
}
