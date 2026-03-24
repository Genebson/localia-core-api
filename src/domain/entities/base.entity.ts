export abstract class Base {
	id: string;
	createdAt: Date;
	updatedAt: Date;

	constructor(id?: string, createdAt?: Date, updatedAt?: Date) {
		this.id = id ?? '';
		this.createdAt = createdAt ?? new Date();
		this.updatedAt = updatedAt ?? new Date();
	}
}
