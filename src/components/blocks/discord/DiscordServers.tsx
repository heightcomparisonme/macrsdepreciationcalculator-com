"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, Globe, Code, Trophy, Drama } from "lucide-react";

const serverIcons = {
  main: MessageCircle,
  scripts: Code,
  trading: Trophy,
  competitive: Trophy,
  roleplay: Drama,
  international: Globe,
};

export default function DiscordServers() {
  const t = useTranslations("pages.discord.discord.servers");

  const servers = [
    {
      id: "main",
      icon: serverIcons.main,
      badge: t("badges.recommended"),
      members: "15,247",
      status: t("status.veryActive"),
      link: "https://discord.gg/WEWMqwb5",
    },
    {
      id: "scripts",
      icon: serverIcons.scripts,
      badge: t("badges.scripts"),
      members: "8,932",
      status: t("status.active"),
      link: "https://discord.gg/WEWMqwb5",
    },
    {
      id: "trading",
      icon: serverIcons.trading,
      badge: t("badges.trading"),
      members: "5,678",
      status: t("status.trading"),
      link: "https://discord.gg/WEWMqwb5",
    },
    {
      id: "competitive",
      icon: serverIcons.competitive,
      badge: t("badges.competitive"),
      members: "3,421",
      status: t("status.competitive"),
      link: "https://discord.gg/WEWMqwb5",
    },
    {
      id: "roleplay",
      icon: serverIcons.roleplay,
      badge: t("badges.roleplay"),
      members: "2,156",
      status: t("status.roleplay"),
      link: "https://discord.gg/WEWMqwb5",
    },
    {
      id: "international",
      icon: serverIcons.international,
      badge: t("badges.global"),
      members: "7,890",
      status: t("status.global"),
      link: "https://discord.gg/WEWMqwb5",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{t("title")}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servers.map((server) => {
          const Icon = server.icon;
          return (
            <Card key={server.id} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{t(`${server.id}.title`)}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {server.badge}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {t(`${server.id}.description`)}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-green-500" />
                    <span>{server.members}</span>
                  </div>
                  <span className="text-muted-foreground">{server.status}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a href={server.link} target="_blank" rel="noopener noreferrer">
                    {t("joinButton")}
                  </a>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}