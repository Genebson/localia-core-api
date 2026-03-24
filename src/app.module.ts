import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration.js';
import { HealthController } from './presentation/controllers/health.controller.js';
import { AuthController } from './presentation/controllers/auth.controller.js';
import { ProfileController } from './presentation/controllers/profile.controller.js';
import { NotificationsController } from './presentation/controllers/notifications.controller.js';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './config/database.config.js';
import { UserRepository } from './infrastructure/repositories/user/user.repository.js';
import { EmailModule } from './infrastructure/email/email.module.js';
import { GET_USER_REPOSITORY_KEY } from './application/user/get-user/get-user.repository.interface.js';
import { UPDATE_USER_REPOSITORY_KEY } from './application/user/update-user/update-user.repository.interface.js';
import { GetUserUseCase } from './application/user/get-user/get-user.use-case.js';
import { UpdateUserUseCase } from './application/user/update-user/update-user.use-case.js';

const getUserRepositoryProvider: Provider = {
	provide: GET_USER_REPOSITORY_KEY,
	useClass: UserRepository,
};

const updateUserRepositoryProvider: Provider = {
	provide: UPDATE_USER_REPOSITORY_KEY,
	useClass: UserRepository,
};

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
		}),
		AuthModule.forRoot({
			auth,
		}),
		EmailModule,
	],
	controllers: [HealthController, AuthController, ProfileController, NotificationsController],
	providers: [
		getUserRepositoryProvider,
		updateUserRepositoryProvider,
		GetUserUseCase,
		UpdateUserUseCase,
	],
})
export class AppModule {}
