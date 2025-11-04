"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NewGlossaryTermPage() {
  const router = useRouter();
  const { locale } = useParams() as { locale: string };
  const t = useTranslations("pages.glossary");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    status: "draft",
    locale,
    title: "",
    definition: "",
    synonyms: "",
    seoTitle: "",
    seoDescription: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/glossary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: form.slug,
          status: form.status,
          locales: [
            {
              locale: form.locale,
              title: form.title,
              definition: form.definition,
              synonyms: form.synonyms || null,
              seoTitle: form.seoTitle || null,
              seoDescription: form.seoDescription || null,
            },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/${locale}/admin/glossary/${data.termId}`);
      } else {
        alert("Failed to create term");
      }
    } catch (error) {
      console.error(error);
      alert("Error creating term");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Button asChild variant="ghost" className="mb-6">
        <Link href={`/${locale}/admin/glossary`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Glossary
        </Link>
      </Button>

      <h1 className="text-2xl font-bold mb-6">{t("glossary.admin.newTerm")}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="slug">{t("glossary.admin.slug")}</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) =>
                setForm({ ...form, slug: e.target.value.toLowerCase() })
              }
              placeholder="e.g., seo-optimization"
              required
            />
          </div>

          <div>
            <Label htmlFor="status">{t("glossary.admin.status")}</Label>
            <Select
              value={form.status}
              onValueChange={(value) => setForm({ ...form, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">{t("glossary.admin.draft")}</SelectItem>
                <SelectItem value="published">{t("glossary.admin.published")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="title">{t("glossary.admin.termTitle")}</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="SEO Optimization"
            required
          />
        </div>

        <div>
          <Label htmlFor="definition">{t("glossary.admin.definition")}</Label>
          <Textarea
            id="definition"
            value={form.definition}
            onChange={(e) => setForm({ ...form, definition: e.target.value })}
            placeholder="HTML content allowed..."
            className="min-h-[200px]"
            required
          />
        </div>

        <div>
          <Label htmlFor="synonyms">{t("glossary.page.synonyms")}</Label>
          <Input
            id="synonyms"
            value={form.synonyms}
            onChange={(e) => setForm({ ...form, synonyms: e.target.value })}
            placeholder="Search Engine Optimization, SEO"
          />
        </div>

        <div>
          <Label htmlFor="seoTitle">{t("glossary.admin.seoTitle")}</Label>
          <Input
            id="seoTitle"
            value={form.seoTitle}
            onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
            placeholder="Optional SEO title"
          />
        </div>

        <div>
          <Label htmlFor="seoDescription">{t("glossary.admin.seoDescription")}</Label>
          <Textarea
            id="seoDescription"
            value={form.seoDescription}
            onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
            placeholder="Optional SEO description"
            className="min-h-[100px]"
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Term"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            {t("glossary.admin.cancel")}
          </Button>
        </div>
      </form>
    </div>
  );
}