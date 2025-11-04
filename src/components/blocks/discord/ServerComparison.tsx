"use client";

import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ServerComparison() {
  const t = useTranslations("pages.discord.discord.comparison");

  const servers = [
    {
      name: t("servers.main.name"),
      badge: t("badges.recommended"),
      members: "15,247",
      activity: t("activity.veryHigh"),
      bestFor: t("servers.main.bestFor"),
      language: t("languages.english"),
    },
    {
      name: t("servers.scripts.name"),
      members: "8,932",
      activity: t("activity.high"),
      bestFor: t("servers.scripts.bestFor"),
      language: t("languages.english"),
    },
    {
      name: t("servers.international.name"),
      members: "7,890",
      activity: t("activity.high"),
      bestFor: t("servers.international.bestFor"),
      language: t("languages.multiLanguage"),
    },
    {
      name: t("servers.trading.name"),
      members: "5,678",
      activity: t("activity.medium"),
      bestFor: t("servers.trading.bestFor"),
      language: t("languages.english"),
    },
    {
      name: t("servers.competitive.name"),
      members: "3,421",
      activity: t("activity.medium"),
      bestFor: t("servers.competitive.bestFor"),
      language: t("languages.english"),
    },
    {
      name: t("servers.roleplay.name"),
      members: "2,156",
      activity: t("activity.medium"),
      bestFor: t("servers.roleplay.bestFor"),
      language: t("languages.english"),
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">{t("title")}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("description")}
        </p>
      </div>
      <div className="rounded-3xl border border-border/60 bg-card/80 shadow-sm">
        <Table>
          <TableCaption>{t("caption")}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{t("headers.server")}</TableHead>
              <TableHead>{t("headers.members")}</TableHead>
              <TableHead>{t("headers.activity")}</TableHead>
              <TableHead>{t("headers.bestFor")}</TableHead>
              <TableHead>{t("headers.language")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {servers.map((server, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {server.name}
                    {server.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {server.badge}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{server.members}</TableCell>
                <TableCell>{server.activity}</TableCell>
                <TableCell>{server.bestFor}</TableCell>
                <TableCell>{server.language}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}