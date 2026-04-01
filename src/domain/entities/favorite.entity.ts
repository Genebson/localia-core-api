export class Favorite {
	readonly id: string;
	readonly userId: string;
	readonly propertyId: string;
	readonly createdAt: Date;

	constructor(id: string, userId: string, propertyId: string, createdAt: Date) {
		this.id = id;
		this.userId = userId;
		this.propertyId = propertyId;
		this.createdAt = createdAt;
	}

	static create(userId: string, propertyId: string): Favorite {
		return new Favorite(crypto.randomUUID(), userId, propertyId, new Date());
	}

	static fromPersistence(row: {
		id: string;
		userId: string;
		propertyId: string;
		createdAt: Date | null;
	}): Favorite {
		return new Favorite(row.id, row.userId, row.propertyId, row.createdAt ?? new Date());
	}
}
