ALTER TABLE "orders" ADD COLUMN "paypal_subscription_id" varchar(255);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "paypal_plan_id" varchar(255);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "payment_provider" varchar(50) DEFAULT 'stripe';