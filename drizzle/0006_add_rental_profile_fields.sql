ALTER TABLE "user" ADD COLUMN "tenant_count" integer DEFAULT 1;
ALTER TABLE "user" ADD COLUMN "pets" varchar(20) DEFAULT 'none';
ALTER TABLE "user" ADD COLUMN "move_date" varchar(20) DEFAULT 'flexible';
ALTER TABLE "user" ADD COLUMN "monthly_income" integer;
ALTER TABLE "user" ADD COLUMN "introduction_letter" text;
