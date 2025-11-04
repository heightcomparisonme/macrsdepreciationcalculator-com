"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

export default function CommunityGuidelines() {
  const t = useTranslations("pages.discord.discord.guidelines");

  const dos = [
    t("dos.1"),
    t("dos.2"),
    t("dos.3"),
    t("dos.4"),
    t("dos.5"),
  ];

  const donts = [
    t("donts.1"),
    t("donts.2"),
    t("donts.3"),
    t("donts.4"),
    t("donts.5"),
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto rounded-3xl border border-border/60 bg-muted/40 backdrop-blur-sm">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <span>📋</span> {t("title")}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("description")}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              {t("dosTitle")}
            </h3>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {dos.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              {t("dontsTitle")}
            </h3>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {donts.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="text-center mt-12">
        <a
          href="https://discord.gg/WEWMqwb5"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          {t("joinButton")}
        </a>
      </div>
    </section>
  );
}