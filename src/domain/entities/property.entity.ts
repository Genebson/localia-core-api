export type PropertyOperation = 'buy' | 'rent';
export type PropertyType =
	| 'apartment'
	| 'house'
	| 'penthouse'
	| 'terrain'
	| 'commercial'
	| 'lot'
	| 'farm'
	| 'country-house'
	| 'warehouse'
	| 'estate'
	| 'land'
	| 'commercial-space';
export type PropertyCondition = 'new' | 'good' | 'needs-renovation';
export type Furnishings = 'furnished' | 'equipped-kitchen';
export type PropertyFeature =
	| 'petFriendly'
	| 'airConditioning'
	| 'elevator'
	| 'balcony'
	| 'outdoor'
	| 'garage'
	| 'garden'
	| 'pool'
	| 'storageRoom'
	| 'accessible';

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
	private _published: boolean;
	private _publishedAt: Date | null;
	private _listingCode: string | null;
	private _isFinancingEligible: boolean;
	private _petFriendly: boolean;
	private _airConditioning: boolean;
	private _elevator: boolean;
	private _balcony: boolean;
	private _outdoor: boolean;
	private _garage: boolean;
	private _garden: boolean;
	private _pool: boolean;
	private _storageRoom: boolean;
	private _accessible: boolean;
	private _condition: PropertyCondition | null;
	private _furnishings: Furnishings | null;
	private _distributedTo: string[];
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
		published: boolean,
		publishedAt: Date | null,
		listingCode: string | null,
		isFinancingEligible: boolean,
		petFriendly: boolean,
		airConditioning: boolean,
		elevator: boolean,
		balcony: boolean,
		outdoor: boolean,
		garage: boolean,
		garden: boolean,
		pool: boolean,
		storageRoom: boolean,
		accessible: boolean,
		condition: PropertyCondition | null,
		furnishings: Furnishings | null,
		distributedTo: string[],
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
		this._published = published;
		this._publishedAt = publishedAt;
		this._listingCode = listingCode;
		this._isFinancingEligible = isFinancingEligible;
		this._petFriendly = petFriendly;
		this._airConditioning = airConditioning;
		this._elevator = elevator;
		this._balcony = balcony;
		this._outdoor = outdoor;
		this._garage = garage;
		this._garden = garden;
		this._pool = pool;
		this._storageRoom = storageRoom;
		this._accessible = accessible;
		this._condition = condition;
		this._furnishings = furnishings;
		this._distributedTo = distributedTo;
		this.agentId = agentId;
		this.createdAt = createdAt;
		this._updatedAt = updatedAt;
		this._deletedAt = deletedAt;
	}

	static generateListingCode(): string {
		const date = new Date();
		const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
		const random = Math.random().toString(36).substring(2, 8).toUpperCase();
		return `LCL-${dateStr}-${random}`;
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
		published?: boolean;
		publishedAt?: Date | null;
		listingCode?: string;
		isFinancingEligible?: boolean;
		petFriendly?: boolean;
		airConditioning?: boolean;
		elevator?: boolean;
		balcony?: boolean;
		outdoor?: boolean;
		garage?: boolean;
		garden?: boolean;
		pool?: boolean;
		storageRoom?: boolean;
		accessible?: boolean;
		condition?: PropertyCondition | null;
		furnishings?: Furnishings | null;
		distributedTo?: string[];
		agentId: string;
	}): Property {
		const now = new Date();
		const published = props.published ?? true;
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
			props.featured ?? false,
			published,
			published ? (props.publishedAt ?? now) : null,
			props.listingCode ?? Property.generateListingCode(),
			props.isFinancingEligible ?? false,
			props.petFriendly ?? false,
			props.airConditioning ?? false,
			props.elevator ?? false,
			props.balcony ?? false,
			props.outdoor ?? false,
			props.garage ?? false,
			props.garden ?? false,
			props.pool ?? false,
			props.storageRoom ?? false,
			props.accessible ?? false,
			props.condition ?? null,
			props.furnishings ?? null,
			props.distributedTo ?? [],
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
		published: boolean;
		publishedAt: Date | null;
		listingCode: string | null;
		isFinancingEligible: boolean;
		petFriendly: boolean;
		airConditioning: boolean;
		elevator: boolean;
		balcony: boolean;
		outdoor: boolean;
		garage: boolean;
		garden: boolean;
		pool: boolean;
		storageRoom: boolean;
		accessible: boolean;
		condition: string | null;
		furnishings: string | null;
		distributedTo: string[];
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
			props.published,
			props.publishedAt,
			props.listingCode,
			props.isFinancingEligible,
			props.petFriendly,
			props.airConditioning,
			props.elevator,
			props.balcony,
			props.outdoor,
			props.garage,
			props.garden,
			props.pool,
			props.storageRoom,
			props.accessible,
			(props.condition as PropertyCondition) ?? null,
			(props.furnishings as Furnishings) ?? null,
			props.distributedTo,
			props.agentId,
			props.createdAt,
			props.updatedAt,
			props.deletedAt,
		);
	}

	update(props: {
		title?: string;
		description?: string;
		operation?: PropertyOperation;
		propertyType?: PropertyType;
		price?: number;
		currency?: 'USD' | 'ARS';
		location?: string;
		address?: string;
		attributes?: PropertyAttributes;
		images?: string[];
		featured?: boolean;
		published?: boolean;
		publishedAt?: Date | null;
		listingCode?: string;
		isFinancingEligible?: boolean;
		petFriendly?: boolean;
		airConditioning?: boolean;
		elevator?: boolean;
		balcony?: boolean;
		outdoor?: boolean;
		garage?: boolean;
		garden?: boolean;
		pool?: boolean;
		storageRoom?: boolean;
		accessible?: boolean;
		condition?: PropertyCondition | null;
		furnishings?: Furnishings | null;
		distributedTo?: string[];
	}): void {
		// Special: published toggle auto-sets publishedAt
		if (props.published !== undefined) {
			if (props.published && !this._published) {
				this._publishedAt = new Date();
			}
			this._published = props.published;
		}

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
		if (props.publishedAt !== undefined) this._publishedAt = props.publishedAt;
		if (props.listingCode !== undefined) this._listingCode = props.listingCode;
		if (props.isFinancingEligible !== undefined)
			this._isFinancingEligible = props.isFinancingEligible;
		if (props.condition !== undefined) this._condition = props.condition;
		if (props.furnishings !== undefined) this._furnishings = props.furnishings;
		if (props.distributedTo !== undefined) this._distributedTo = props.distributedTo;

		(
			[
				['petFriendly', props.petFriendly],
				['airConditioning', props.airConditioning],
				['elevator', props.elevator],
				['balcony', props.balcony],
				['outdoor', props.outdoor],
				['garage', props.garage],
				['garden', props.garden],
				['pool', props.pool],
				['storageRoom', props.storageRoom],
				['accessible', props.accessible],
			] as const
		).forEach(([key, value]) => {
			if (value !== undefined) {
				(this as unknown as Record<string, boolean | undefined>)[`_${key}`] = value;
			}
		});

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

	publish(): void {
		if (!this._published) {
			this._publishedAt = new Date();
		}
		this._published = true;
		this._updatedAt = new Date();
	}

	unpublish(): void {
		this._published = false;
		this._updatedAt = new Date();
	}

	togglePublished(): void {
		if (this._published) {
			this.unpublish();
		} else {
			this.publish();
		}
	}

	distributeTo(portal: string): void {
		if (!this._distributedTo.includes(portal)) {
			this._distributedTo.push(portal);
			this._updatedAt = new Date();
		}
	}

	removeDistributedTo(portal: string): void {
		this._distributedTo = this._distributedTo.filter((p) => p !== portal);
		this._updatedAt = new Date();
	}

	markDeleted(): void {
		this._deletedAt = new Date();
		this._updatedAt = new Date();
	}

	isOwnedBy(agentId: string): boolean {
		return this.agentId === agentId;
	}

	get title(): string {
		return this._title;
	}
	get description(): string | null {
		return this._description;
	}
	get operation(): PropertyOperation {
		return this._operation;
	}
	get propertyType(): PropertyType {
		return this._propertyType;
	}
	get price(): number {
		return this._price;
	}
	get currency(): 'USD' | 'ARS' {
		return this._currency;
	}
	get location(): string {
		return this._location;
	}
	get address(): string | null {
		return this._address;
	}
	get attributes(): PropertyAttributes {
		return this._attributes;
	}
	get images(): string[] {
		return [...this._images];
	}
	get featured(): boolean {
		return this._featured;
	}
	get published(): boolean {
		return this._published;
	}
	get publishedAt(): Date | null {
		return this._publishedAt;
	}
	get listingCode(): string | null {
		return this._listingCode;
	}
	get isFinancingEligible(): boolean {
		return this._isFinancingEligible;
	}
	get petFriendly(): boolean {
		return this._petFriendly;
	}
	get airConditioning(): boolean {
		return this._airConditioning;
	}
	get elevator(): boolean {
		return this._elevator;
	}
	get balcony(): boolean {
		return this._balcony;
	}
	get outdoor(): boolean {
		return this._outdoor;
	}
	get garage(): boolean {
		return this._garage;
	}
	get garden(): boolean {
		return this._garden;
	}
	get pool(): boolean {
		return this._pool;
	}
	get storageRoom(): boolean {
		return this._storageRoom;
	}
	get accessible(): boolean {
		return this._accessible;
	}
	get condition(): PropertyCondition | null {
		return this._condition;
	}
	get furnishings(): Furnishings | null {
		return this._furnishings;
	}
	get distributedTo(): string[] {
		return [...this._distributedTo];
	}
	get updatedAt(): Date {
		return this._updatedAt;
	}
	get deletedAt(): Date | null {
		return this._deletedAt;
	}
	get priceLabel(): string {
		const formatted =
			this._currency === 'USD'
				? `USD ${this._price.toLocaleString('en-US')}`
				: `$ ${this._price.toLocaleString('es-AR')}`;
		return this._operation === 'rent' ? `${formatted}/mes` : formatted;
	}
}
