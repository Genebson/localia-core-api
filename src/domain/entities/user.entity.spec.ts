import { User } from './user.domain.js';
import { UserRole } from './user-role.enum.js';

describe('User Domain Entity', () => {
	describe('User class', () => {
		it('should have correct structure', () => {
			const user = new User(
				'test-id-123',
				'test@example.com',
				'Test User',
				true,
				null,
				UserRole.SEEKER,
				null,
				new Date(),
				new Date(),
			);

			expect(user.id).toBe('test-id-123');
			expect(user.email).toBe('test@example.com');
			expect(user.name).toBe('Test User');
			expect(user.role).toBe(UserRole.SEEKER);
			expect(user.emailVerified).toBe(true);
			expect(user.createdAt).toBeInstanceOf(Date);
			expect(user.updatedAt).toBeInstanceOf(Date);
		});

		it('should allow agent users', () => {
			const agent = new User(
				'test-id-456',
				'agent@example.com',
				'Agent User',
				true,
				null,
				UserRole.AGENT,
				'COL-2024-12345',
				new Date(),
				new Date(),
			);

			expect(agent.role).toBe(UserRole.AGENT);
			expect(agent.tuition).toBe('COL-2024-12345');
		});

		it('should have default values', () => {
			const user = new User();

			expect(user.id).toBe('');
			expect(user.email).toBe('');
			expect(user.name).toBeNull();
			expect(user.role).toBe(UserRole.SEEKER);
			expect(user.emailVerified).toBe(false);
			expect(user.tuition).toBeNull();
		});
	});
});
