import { defineConfig } from 'drizzle-kit';
import { databaseConfig } from './src/config/database.config.js';
import { property } from './src/infrastructure/database/schema.js';

export default defineConfig({
	schema: ['./src/infrastructure/auth/schema.ts', './src/infrastructure/database/schema.ts'],
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		host: databaseConfig.host,
		port: databaseConfig.port,
		user: databaseConfig.user,
		password: databaseConfig.password,
		database: databaseConfig.dbName,
	},
});
