import { db } from "@/db";
import { glossaryTerm, glossaryTermLocale } from "@/db/schema";

const sampleTerms = [
  {
    slug: "seo",
    title: "SEO",
    definition: "<p>Search Engine Optimization (SEO) is the practice of increasing the quantity and quality of traffic to your website through organic search engine results.</p>",
    titleZh: "SEO",
    definitionZh: "<p>搜索引擎优化（SEO）是通过有机搜索引擎结果增加网站流量的数量和质量的实践。</p>",
  },
  {
    slug: "api",
    title: "API",
    definition: "<p>Application Programming Interface (API) is a set of protocols, routines, and tools for building software applications. It specifies how software components should interact.</p>",
    titleZh: "API",
    definitionZh: "<p>应用程序编程接口（API）是用于构建软件应用程序的协议、例程和工具集。它指定软件组件应该如何交互。</p>",
  },
  {
    slug: "ui-ux",
    title: "UI/UX",
    definition: "<p>UI (User Interface) and UX (User Experience) design focus on creating intuitive, accessible, and enjoyable interactions between users and digital products.</p>",
    titleZh: "UI/UX",
    definitionZh: "<p>UI（用户界面）和UX（用户体验）设计专注于在用户和数字产品之间创建直观、可访问和愉快的交互。</p>",
  },
];

async function seedGlossary() {
  console.log("Seeding glossary...");

  try {
    for (const termData of sampleTerms) {
      const firstLetter = /^[a-z]/i.test(termData.slug)
        ? termData.slug[0].toUpperCase()
        : "#";

      // Insert term
      const [term] = await db()
        .insert(glossaryTerm)
        .values({
          slug: termData.slug,
          firstLetter,
          status: "published",
        })
        .returning();

      // Insert English locale
      await db().insert(glossaryTermLocale).values({
        termId: term.id,
        locale: "en",
        title: termData.title,
        definition: termData.definition,
      });

      // Insert Chinese locale
      await db().insert(glossaryTermLocale).values({
        termId: term.id,
        locale: "zh",
        title: termData.titleZh,
        definition: termData.definitionZh,
      });

      console.log(`✓ Created term: ${termData.slug}`);
    }

    console.log("Glossary seeding completed!");
  } catch (error) {
    console.error("Error seeding glossary:", error);
  }
}

if (require.main === module) {
  seedGlossary().then(() => process.exit(0));
}

export { seedGlossary };