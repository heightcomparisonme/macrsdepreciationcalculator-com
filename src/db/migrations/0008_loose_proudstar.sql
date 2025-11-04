ALTER TABLE "users" ADD COLUMN "interests" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "timezone" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "onboarding_completed" boolean DEFAULT false NOT NULL;