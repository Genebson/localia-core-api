import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../../config/database.config.js';
import { user as userSchema } from '../../../infrastructure/auth/schema.js';
import { IGetUserRepository } from '../../../application/user/get-user/get-user.repository.interface.js';
import { IUpdateUserRepository } from '../../../application/user/update-user/update-user.repository.interface.js';
import { User } from '../../../domain/entities/user.domain.js';
import { UserRole } from '../../../domain/entities/user-role.enum.js';

@Injectable()
export class UserRepository implements IGetUserRepository, IUpdateUserRepository {
	async findById(id: string): Promise<User | null> {
		const [foundUser] = await db
			.select()
			.from(userSchema)
			.where(eq(userSchema.id, id))
			.limit(1);

		if (!foundUser) {
			return null;
		}

		return new User(
			foundUser.id,
			foundUser.email,
			foundUser.name,
			foundUser.emailVerified ?? false,
			foundUser.image,
			foundUser.role as UserRole,
			foundUser.tuition,
			foundUser.createdAt ?? undefined,
			foundUser.updatedAt ?? undefined,
		);
	}

	async updateRole(id: string, role: UserRole, tuition: string | null): Promise<User> {
		const [updatedUser] = await db
			.update(userSchema)
			.set({
				role: role,
				tuition: tuition,
			})
			.where(eq(userSchema.id, id))
			.returning();

		return new User(
			updatedUser.id,
			updatedUser.email,
			updatedUser.name,
			updatedUser.emailVerified ?? false,
			updatedUser.image,
			updatedUser.role as UserRole,
			updatedUser.tuition,
			updatedUser.createdAt ?? undefined,
			updatedUser.updatedAt ?? undefined,
		);
	}
}
