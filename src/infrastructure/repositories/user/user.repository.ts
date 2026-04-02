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

		const user = new User(
			foundUser.id,
			foundUser.email,
			foundUser.name,
			foundUser.emailVerified ?? false,
			foundUser.image,
			foundUser.role as UserRole,
			foundUser.licenseNumber,
			foundUser.createdAt ?? undefined,
			foundUser.updatedAt ?? undefined,
		);
		user.phone = foundUser.phone ?? null;
		user.tenantCount = foundUser.tenantCount ?? 1;
		user.pets = (foundUser.pets as 'none' | 'has_pet') ?? 'none';
		user.moveDate = (foundUser.moveDate as 'asap' | 'flexible' | 'exact_date') ?? 'flexible';
		user.monthlyIncome = foundUser.monthlyIncome ?? null;
		user.introductionLetter = foundUser.introductionLetter ?? null;
		return user;
	}

	async updateRole(id: string, role: UserRole, licenseNumber: string | null): Promise<User> {
		const [updatedUser] = await db
			.update(userSchema)
			.set({
				role: role,
				licenseNumber: licenseNumber,
			})
			.where(eq(userSchema.id, id))
			.returning();

		const user = new User(
			updatedUser.id,
			updatedUser.email,
			updatedUser.name,
			updatedUser.emailVerified ?? false,
			updatedUser.image,
			updatedUser.role as UserRole,
			updatedUser.licenseNumber,
			updatedUser.createdAt ?? undefined,
			updatedUser.updatedAt ?? undefined,
		);
		user.phone = updatedUser.phone ?? null;
		user.tenantCount = updatedUser.tenantCount ?? 1;
		user.pets = (updatedUser.pets as 'none' | 'has_pet') ?? 'none';
		user.moveDate = (updatedUser.moveDate as 'asap' | 'flexible' | 'exact_date') ?? 'flexible';
		user.monthlyIncome = updatedUser.monthlyIncome ?? null;
		user.introductionLetter = updatedUser.introductionLetter ?? null;
		return user;
	}

	async updateImage(id: string, image: string): Promise<User> {
		const [updatedUser] = await db
			.update(userSchema)
			.set({ image })
			.where(eq(userSchema.id, id))
			.returning();

		const user = new User(
			updatedUser.id,
			updatedUser.email,
			updatedUser.name,
			updatedUser.emailVerified ?? false,
			updatedUser.image,
			updatedUser.role as UserRole,
			updatedUser.licenseNumber,
			updatedUser.createdAt ?? undefined,
			updatedUser.updatedAt ?? undefined,
		);
		user.phone = updatedUser.phone ?? null;
		user.tenantCount = updatedUser.tenantCount ?? 1;
		user.pets = (updatedUser.pets as 'none' | 'has_pet') ?? 'none';
		user.moveDate = (updatedUser.moveDate as 'asap' | 'flexible' | 'exact_date') ?? 'flexible';
		user.monthlyIncome = updatedUser.monthlyIncome ?? null;
		user.introductionLetter = updatedUser.introductionLetter ?? null;
		return user;
	}

	async updateNameAndPhone(id: string, name: string, phone: string): Promise<User> {
		const [updatedUser] = await db
			.update(userSchema)
			.set({ name, phone })
			.where(eq(userSchema.id, id))
			.returning();

		const user = new User(
			updatedUser.id,
			updatedUser.email,
			updatedUser.name,
			updatedUser.emailVerified ?? false,
			updatedUser.image,
			updatedUser.role as UserRole,
			updatedUser.licenseNumber,
			updatedUser.createdAt ?? undefined,
			updatedUser.updatedAt ?? undefined,
		);
		user.phone = updatedUser.phone ?? null;
		user.tenantCount = updatedUser.tenantCount ?? 1;
		user.pets = (updatedUser.pets as 'none' | 'has_pet') ?? 'none';
		user.moveDate = (updatedUser.moveDate as 'asap' | 'flexible' | 'exact_date') ?? 'flexible';
		user.monthlyIncome = updatedUser.monthlyIncome ?? null;
		user.introductionLetter = updatedUser.introductionLetter ?? null;
		return user;
	}

	async updateRentalProfile(
		id: string,
		tenantCount: number,
		pets: string,
		moveDate: string,
		monthlyIncome: number | null,
	): Promise<User> {
		const [updatedUser] = await db
			.update(userSchema)
			.set({ tenantCount, pets, moveDate, monthlyIncome })
			.where(eq(userSchema.id, id))
			.returning();

		const user = new User(
			updatedUser.id,
			updatedUser.email,
			updatedUser.name,
			updatedUser.emailVerified ?? false,
			updatedUser.image,
			updatedUser.role as UserRole,
			updatedUser.licenseNumber,
			updatedUser.createdAt ?? undefined,
			updatedUser.updatedAt ?? undefined,
		);
		user.phone = updatedUser.phone ?? null;
		user.tenantCount = updatedUser.tenantCount ?? 1;
		user.pets = (updatedUser.pets as 'none' | 'has_pet') ?? 'none';
		user.moveDate = (updatedUser.moveDate as 'asap' | 'flexible' | 'exact_date') ?? 'flexible';
		user.monthlyIncome = updatedUser.monthlyIncome ?? null;
		user.introductionLetter = updatedUser.introductionLetter ?? null;
		return user;
	}

	async updateIntroductionLetter(id: string, introductionLetter: string): Promise<User> {
		const [updatedUser] = await db
			.update(userSchema)
			.set({ introductionLetter })
			.where(eq(userSchema.id, id))
			.returning();

		const user = new User(
			updatedUser.id,
			updatedUser.email,
			updatedUser.name,
			updatedUser.emailVerified ?? false,
			updatedUser.image,
			updatedUser.role as UserRole,
			updatedUser.licenseNumber,
			updatedUser.createdAt ?? undefined,
			updatedUser.updatedAt ?? undefined,
		);
		user.phone = updatedUser.phone ?? null;
		user.tenantCount = updatedUser.tenantCount ?? 1;
		user.pets = (updatedUser.pets as 'none' | 'has_pet') ?? 'none';
		user.moveDate = (updatedUser.moveDate as 'asap' | 'flexible' | 'exact_date') ?? 'flexible';
		user.monthlyIncome = updatedUser.monthlyIncome ?? null;
		user.introductionLetter = updatedUser.introductionLetter ?? null;
		return user;
	}
}
