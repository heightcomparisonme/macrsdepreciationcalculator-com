CREATE TABLE "ai_workstation_images" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai_workstation_images_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" varchar(255) NOT NULL,
	"created_at" timestamp with time zone,
	"img_url" varchar(255),
	"img_description" text,
	"status" varchar(50),
	"user_uuid" varchar(255),
	"prompt" text,
	"model" varchar(50),
	"aspect_ratio" varchar(50),
	"watermark" boolean DEFAULT true NOT NULL,
	"credits" integer NOT NULL,
	"credits_used" integer NOT NULL,
	"credits_remaining" integer NOT NULL,
	CONSTRAINT "ai_workstation_images_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "comments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" varchar(255) NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"post_uuid" varchar(255) NOT NULL,
	"user_uuid" varchar(255),
	"content" text NOT NULL,
	"guest_name" varchar(100),
	"guest_email" varchar(255),
	"guest_website" varchar(255),
	"parent_id" integer,
	"reply_to_uuid" varchar(255),
	"ip_address" varchar(45),
	"user_agent" text,
	"is_approved" boolean DEFAULT true NOT NULL,
	CONSTRAINT "comments_uuid_unique" UNIQUE("uuid")
);
