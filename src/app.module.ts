import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration.js';
import { HealthController } from './presentation/controllers/health.controller.js';
import { AuthController } from './presentation/controllers/auth.controller.js';
import { ProfileController } from './presentation/controllers/profile.controller.js';
import { NotificationsController } from './presentation/controllers/notifications.controller.js';
import { PropertyController } from './presentation/controllers/property.controller.js';
import { UploadController } from './presentation/controllers/upload.controller.js';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './config/database.config.js';
import { UserRepository } from './infrastructure/repositories/user/user.repository.js';
import { PropertyRepository } from './infrastructure/repositories/property/property.repository.js';
import { FavoriteRepository } from './infrastructure/repositories/favorite/favorite.repository.js';
import { EmailModule } from './infrastructure/email/email.module.js';
import { GET_USER_REPOSITORY_KEY } from './application/user/get-user/get-user.repository.interface.js';
import { UPDATE_USER_REPOSITORY_KEY } from './application/user/update-user/update-user.repository.interface.js';
import { PROPERTY_REPOSITORY_KEY } from './application/property/create-property/property.repository.interface.js';
import { FAVORITE_REPOSITORY_KEY } from './application/favorite/add-favorite/favorite.repository.interface.js';
import { GetUserUseCase } from './application/user/get-user/get-user.use-case.js';
import { UpdateUserUseCase } from './application/user/update-user/update-user.use-case.js';
import { CreatePropertyUseCase } from './application/property/create-property/create-property.use-case.js';
import { ListAllPropertiesUseCase } from './application/property/list-all-properties/list-all-properties.use-case.js';
import { ListMyPropertiesUseCase } from './application/property/list-my-properties/list-my-properties.use-case.js';
import { UpdatePropertyUseCase } from './application/property/update-property/update-property.use-case.js';
import { DeletePropertyUseCase } from './application/property/delete-property/delete-property.use-case.js';
import { GetPropertyUseCase } from './application/property/get-property/get-property.use-case.js';
import { UploadImageUseCase } from './application/upload/upload-image/upload-image.use-case.js';
import { AddFavoriteUseCase } from './application/favorite/add-favorite/add-favorite.use-case.js';
import { RemoveFavoriteUseCase } from './application/favorite/remove-favorite/remove-favorite.use-case.js';
import { ListFavoritesUseCase } from './application/favorite/list-favorites/list-favorites.use-case.js';
import { FavoritesController } from './presentation/controllers/favorites.controller.js';

const getUserRepositoryProvider: Provider = {
	provide: GET_USER_REPOSITORY_KEY,
	useClass: UserRepository,
};

const updateUserRepositoryProvider: Provider = {
	provide: UPDATE_USER_REPOSITORY_KEY,
	useClass: UserRepository,
};

const propertyRepositoryProvider: Provider = {
	provide: PROPERTY_REPOSITORY_KEY,
	useClass: PropertyRepository,
};

const favoriteRepositoryProvider: Provider = {
	provide: FAVORITE_REPOSITORY_KEY,
	useClass: FavoriteRepository,
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
	controllers: [
		HealthController,
		AuthController,
		ProfileController,
		NotificationsController,
		PropertyController,
		UploadController,
		FavoritesController,
	],
	providers: [
		getUserRepositoryProvider,
		updateUserRepositoryProvider,
		propertyRepositoryProvider,
		favoriteRepositoryProvider,
		GetUserUseCase,
		UpdateUserUseCase,
		CreatePropertyUseCase,
		ListAllPropertiesUseCase,
		ListMyPropertiesUseCase,
		UpdatePropertyUseCase,
		DeletePropertyUseCase,
		GetPropertyUseCase,
		UploadImageUseCase,
		AddFavoriteUseCase,
		RemoveFavoriteUseCase,
		ListFavoritesUseCase,
	],
})
export class AppModule {}
