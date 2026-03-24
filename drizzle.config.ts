import { databaseConfig } from './src/config/database.config.js';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/infrastructure/auth/schema.ts',
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
