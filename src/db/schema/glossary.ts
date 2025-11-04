import {
  pgTable,
  text,
  varchar,
  timestamp,
  uuid,
  unique,
  primaryKey,
} from "drizzle-orm/pg-core";

export const glossaryTerm = pgTable(
  "glossary_term",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull(),
    firstLetter: varchar("first_letter", { length: 1 }).notNull(),
    status: varchar("status", { length: 16 }).notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdBy: uuid("created_by"),
    updatedBy: uuid("updated_by"),
  },
  (t) => ({
    slugUnique: unique("glossary_slug_unique").on(t.slug),
  })
);

export const glossaryTermLocale = pgTable(
  "glossary_term_locale",
  {
    termId: uuid("term_id")
      .notNull()
      .references(() => glossaryTerm.id, { onDelete: "cascade" }),
    locale: varchar("locale", { length: 10 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    definition: text("definition").notNull(),
    synonyms: text("synonyms"),
    seoTitle: varchar("seo_title", { length: 180 }),
    seoDescription: varchar("seo_description", { length: 240 }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.termId, t.locale],
      name: "glossary_term_locale_pk",
    }),
  })
);

export type GlossaryTerm = typeof glossaryTerm.$inferSelect;
export type NewGlossaryTerm = typeof glossaryTerm.$inferInsert;
export type GlossaryTermLocale = typeof glossaryTermLocale.$inferSelect;
export type NewGlossaryTermLocale = typeof glossaryTermLocale.$inferInsert;