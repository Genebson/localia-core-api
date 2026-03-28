CREATE TABLE "property" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"operation" varchar(10) NOT NULL,
	"property_type" varchar(20) NOT NULL,
	"price" integer NOT NULL,
	"currency" varchar(5) DEFAULT 'USD' NOT NULL,
	"location" text NOT NULL,
	"address" text,
	"bedrooms" integer DEFAULT 0,
	"bathrooms" integer DEFAULT 0,
	"area" integer DEFAULT 0,
	"images" text[] DEFAULT '{}',
	"featured" boolean DEFAULT false,
	"agent_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
