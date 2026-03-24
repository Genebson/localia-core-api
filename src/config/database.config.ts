import { betterAuth } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../infrastructure/auth/schema.js';
import * as dotenv from 'dotenv';

dotenv.config();

export const databaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'localia',
  password: process.env.DB_PASSWORD || 'localia_dev_password',
  dbName: process.env.DB_NAME || 'localia_dev',
};

const sql = postgres({
  host: databaseConfig.host,
  port: databaseConfig.port,
  user: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.dbName,
});

export const db = drizzle(sql, { schema });

export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
	basePath: '/auth',
	database: drizzleAdapter(db, {
		provider: 'pg',
	}),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID || '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
		},
	},
	trustedOrigins: ['http://localhost:5173'],
	user: {
		additionalFields: {
			role: {
				type: 'string',
				required: false,
				returned: true,
				input: true,
				defaultValue: 'seeker',
			},
			tuition: {
				type: 'string',
				required: false,
				returned: true,
				input: true,
			},
		},
	},
});
