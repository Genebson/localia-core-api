export type PropertyOperation = 'buy' | 'rent';
export type PropertyType = 'apartment' | 'house' | 'penthouse' | 'terrain' | 'commercial';

export interface PropertyAttributes {
	bedrooms: number;
	bathrooms: number;
	area: number;
}

export class Property {
	readonly id: string;
	private _title: string;
	private _description: string | null;
	private _operation: PropertyOperation;
	private _propertyType: PropertyType;
	private _price: number;
	private _currency: 'USD' | 'ARS';
	private _location: string;
	private _address: string | null;
	private _attributes: PropertyAttributes;
	private _images: string[];
	private _featured: boolean;
	readonly agentId: string;
	readonly createdAt: Date;
	private _updatedAt: Date;
	private _deletedAt: Date | null;

	private constructor(
		id: string,
		title: string,
		description: string | null,
		operation: PropertyOperation,
		propertyType: PropertyType,
		price: number,
		currency: 'USD' | 'ARS',
		location: string,
		address: string | null,
		attributes: PropertyAttributes,
		images: string[],
		featured: boolean,
		agentId: string,
		createdAt: Date,
		updatedAt: Date,
		deletedAt: Date | null,
	) {
		this.id = id;
		this._title = title;
		this._description = description;
		this._operation = operation;
		this._propertyType = propertyType;
		this._price = price;
		this._currency = currency;
		this._location = location;
		this._address = address;
		this._attributes = attributes;
		this._images = images;
		this._featured = featured;
		this.agentId = agentId;
		this.createdAt = createdAt;
		this._updatedAt = updatedAt;
		this._deletedAt = deletedAt;
	}

	static create(props: {
		title: string;
		description?: string;
		operation: PropertyOperation;
		propertyType: PropertyType;
		price: number;
		currency: 'USD' | 'ARS';
		location: string;
		address?: string;
		attributes: PropertyAttributes;
		images?: string[];
		featured?: boolean;
		agentId: string;
	}): Property {
		const now = new Date();
		return new Property(
			crypto.randomUUID(),
			props.title,
			props.description ?? null,
			props.operation,
			props.propertyType,
			props.price,
			props.currency,
			props.location,
			props.address ?? null,
			props.attributes,
			props.images ?? [],
			props.featured ?? true,
			props.agentId,
			now,
			now,
			null,
		);
	}

	static fromPersistence(props: {
		id: string;
		title: string;
		description: string | null;
		operation: string;
		propertyType: string;
		price: number;
		currency: string;
		location: string;
		address: string | null;
		bedrooms: number;
		bathrooms: number;
		area: number;
		images: string[];
		featured: boolean;
		agentId: string;
		createdAt: Date;
		updatedAt: Date;
		deletedAt: Date | null;
	}): Property {
		return new Property(
			props.id,
			props.title,
			props.description,
			props.operation as PropertyOperation,
			props.propertyType as PropertyType,
			props.price,
			props.currency as 'USD' | 'ARS',
			props.location,
			props.address,
			{ bedrooms: props.bedrooms, bathrooms: props.bathrooms, area: props.area },
			props.images,
			props.featured,
			props.agentId,
			props.createdAt,
			props.updatedAt,
			props.deletedAt,
		);
	}

	update(props: Partial<Omit<Property, 'id' | 'agentId' | 'createdAt'>>): void {
		if (props.title !== undefined) this._title = props.title;
		if (props.description !== undefined) this._description = props.description;
		if (props.operation !== undefined) this._operation = props.operation;
		if (props.propertyType !== undefined) this._propertyType = props.propertyType;
		if (props.price !== undefined) this._price = props.price;
		if (props.currency !== undefined) this._currency = props.currency;
		if (props.location !== undefined) this._location = props.location;
		if (props.address !== undefined) this._address = props.address;
		if (props.attributes !== undefined) this._attributes = props.attributes;
		if (props.images !== undefined) this._images = props.images;
		if (props.featured !== undefined) this._featured = props.featured;
		this._updatedAt = new Date();
	}

	addImage(url: string): void {
		if (!this._images.includes(url)) {
			this._images.push(url);
			this._updatedAt = new Date();
		}
	}

	removeImage(url: string): void {
		this._images = this._images.filter((img) => img !== url);
		this._updatedAt = new Date();
	}

	toggleFeatured(): void {
		this._featured = !this._featured;
		this._updatedAt = new Date();
	}

	markDeleted(): void {
		this._deletedAt = new Date();
		this._updatedAt = new Date();
	}

	isOwnedBy(agentId: string): boolean {
		return this.agentId === agentId;
	}

	get title(): string { return this._title; }
	get description(): string | null { return this._description; }
	get operation(): PropertyOperation { return this._operation; }
	get propertyType(): PropertyType { return this._propertyType; }
	get price(): number { return this._price; }
	get currency(): 'USD' | 'ARS' { return this._currency; }
	get location(): string { return this._location; }
	get address(): string | null { return this._address; }
	get attributes(): PropertyAttributes { return this._attributes; }
	get images(): string[] { return [...this._images]; }
	get featured(): boolean { return this._featured; }
	get updatedAt(): Date { return this._updatedAt; }
	get deletedAt(): Date | null { return this._deletedAt; }
	get priceLabel(): string {
		const formatted =
			this._currency === 'USD'
				? `USD ${this._price.toLocaleString('en-US')}`
				: `$ ${this._price.toLocaleString('es-AR')}`;
		return this._operation === 'rent' ? `${formatted}/mes` : formatted;
	}
}
