export default () => ({
	database: {
		host: process.env.DB_HOST || 'localhost',
		port: parseInt(process.env.DB_PORT || '5432', 10),
		user: process.env.DB_USER || 'localia',
		password: process.env.DB_PASSWORD || 'localia_dev_password',
		dbName: process.env.DB_NAME || 'localia_dev',
	},
	redis: {
		host: process.env.REDIS_HOST || 'localhost',
		port: parseInt(process.env.REDIS_PORT || '6379', 10),
	},
	meilisearch: {
		host: process.env.MEILI_HOST || 'localhost',
		port: parseInt(process.env.MEILI_PORT || '7700', 10),
		masterKey: process.env.MEILI_MASTER_KEY || 'localia_dev_master_key',
	},
	jwt: {
		secret: process.env.JWT_SECRET || 'your-secret-key',
		expiresIn: process.env.JWT_EXPIRES_IN || '7d',
	},
	email: {
		apiKey: process.env.RESEND_API_KEY || '',
		fromEmail: process.env.RESEND_FROM_EMAIL || 'Localia <noreply@localia.com>',
	},
	cloudinary: {
		cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
		uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || '',
	},
});
