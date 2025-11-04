CREATE TABLE "glossary_term" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(160) NOT NULL,
	"first_letter" varchar(1) NOT NULL,
	"status" varchar(16) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	CONSTRAINT "glossary_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "glossary_term_locale" (
	"term_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"title" varchar(180) NOT NULL,
	"definition" text NOT NULL,
	"synonyms" text,
	"seo_title" varchar(180),
	"seo_description" varchar(240),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "glossary_term_locale_pk" PRIMARY KEY("term_id","locale")
);
--> statement-breakpoint
ALTER TABLE "glossary_term_locale" ADD CONSTRAINT "glossary_term_locale_term_id_glossary_term_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."glossary_term"("id") ON DELETE cascade ON UPDATE no action;