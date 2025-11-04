"use client";

import { useEffect, useState } from "react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Trash2, Eye, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface LocaleData {
  locale: string;
  title: string;
  definition: string;
  synonyms?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export default function EditGlossaryTermPage() {
  const { locale, id } = useParams() as { locale: string; id: string };
  const router = useRouter();
  const t = useTranslations("pages.glossary");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>(null);
  const [currentLocale, setCurrentLocale] = useState(locale);
  const [localeData, setLocaleData] = useState<LocaleData>({
    locale,
    title: "",
    definition: "",
    synonyms: "",
    seoTitle: "",
    seoDescription: "",
  });

  useEffect(() => {
    fetchTermData();
  }, [id]);

  useEffect(() => {
    if (data) {
      const existingLocale = data.locales?.find(
        (l: any) => l.locale === currentLocale
      );
      if (existingLocale) {
        setLocaleData(existingLocale);
      } else {
        setLocaleData({
          locale: currentLocale,
          title: "",
          definition: "",
          synonyms: "",
          seoTitle: "",
          seoDescription: "",
        });
      }
    }
  }, [currentLocale, data]);

  const fetchTermData = async () => {
    try {
      const res = await fetch(`/api/admin/glossary/${id}`);
      if (res.ok) {
        const termData = await res.json();
        setData(termData);
      }
    } catch (error) {
      console.error("Error fetching term:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/glossary/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localeData),
      });

      if (res.ok) {
        alert("Saved successfully");
        fetchTermData();
      } else {
        alert("Failed to save");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving term");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/glossary/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setData({ ...data, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t("glossary.admin.confirmDelete"))) return;

    try {
      const res = await fetch(`/api/admin/glossary/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push(`/${locale}/admin/glossary`);
      } else {
        alert("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error deleting term");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Term not found</div>;

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Button asChild variant="ghost" className="mb-6">
        <Link href={`/${locale}/admin/glossary`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Glossary
        </Link>
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {t("glossary.admin.editTerm")}: {data.slug}
          </h1>
          <p className="text-muted-foreground">
            Manage translations and content for this glossary term
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/${params.locale}/glossary/${data.slug}`} target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              Preview
              <ExternalLink className="h-4 w-4 ml-1" />
            </Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            {t("glossary.admin.delete")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Term Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Slug</Label>
                  <Input value={data.slug} disabled className="font-mono" />
                </div>
                <div>
                  <Label>{t("glossary.admin.status")}</Label>
                  <Select
                    value={data.status}
                    onValueChange={handleStatusChange}
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
                <Label>First Letter</Label>
                <Input value={data.firstLetter} disabled className="w-20 font-mono" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Created</div>
                <div className="text-sm">
                  {new Date(data.createdAt).toLocaleDateString(locale)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Last Updated</div>
                <div className="text-sm">
                  {new Date(data.updatedAt).toLocaleDateString(locale)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Translations</div>
                <div className="text-sm">{data.locales?.length || 0} languages</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content & Translations</CardTitle>
        </CardHeader>
        <CardContent>

          <Tabs value={currentLocale} onValueChange={setCurrentLocale}>
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="zh">中文</TabsTrigger>
            </TabsList>

            <TabsContent value={currentLocale} className="space-y-6 mt-6">
            <div>
              <Label htmlFor="title">{t("glossary.admin.termTitle")}</Label>
              <Input
                id="title"
                value={localeData.title}
                onChange={(e) =>
                  setLocaleData({ ...localeData, title: e.target.value })
                }
                placeholder="Term title"
              />
            </div>

            <div>
              <Label htmlFor="definition">{t("glossary.admin.definition")}</Label>
              <Textarea
                id="definition"
                value={localeData.definition}
                onChange={(e) =>
                  setLocaleData({ ...localeData, definition: e.target.value })
                }
                placeholder="HTML content allowed..."
                className="min-h-[300px] font-mono text-sm"
              />
            </div>

            <div>
              <Label htmlFor="synonyms">{t("glossary.page.synonyms")}</Label>
              <Input
                id="synonyms"
                value={localeData.synonyms || ""}
                onChange={(e) =>
                  setLocaleData({ ...localeData, synonyms: e.target.value })
                }
                placeholder="Comma-separated synonyms"
              />
            </div>

            <div>
              <Label htmlFor="seoTitle">{t("glossary.admin.seoTitle")}</Label>
              <Input
                id="seoTitle"
                value={localeData.seoTitle || ""}
                onChange={(e) =>
                  setLocaleData({ ...localeData, seoTitle: e.target.value })
                }
                placeholder="Optional SEO title"
              />
            </div>

            <div>
              <Label htmlFor="seoDescription">{t("glossary.admin.seoDescription")}</Label>
              <Textarea
                id="seoDescription"
                value={localeData.seoDescription || ""}
                onChange={(e) =>
                  setLocaleData({
                    ...localeData,
                    seoDescription: e.target.value,
                  })
                }
                placeholder="Optional SEO description"
                className="min-h-[100px]"
              />
            </div>

              <div className="flex gap-4 pt-6 border-t">
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : t("glossary.admin.save")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    window.open(`/${locale}/glossary/${data.slug}`, "_blank")
                  }
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}