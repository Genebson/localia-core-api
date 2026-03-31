ALTER TABLE "property" ADD COLUMN "published" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "published_at" timestamp;--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "listing_code" text;--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "is_financing_eligible" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "pet_friendly" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "air_conditioning" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "elevator" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "balcony" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "outdoor" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "garage" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "garden" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "pool" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "storage_room" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "accessible" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "estado" varchar(20);--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "furnishings" varchar(30);--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "distributed_to" text[] DEFAULT '{}' NOT NULL;