'use client';

import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HappyUsers from "../happy-users";
import HeroBg from "../bg";
import { Hero as HeroType } from "@/types/blocks/hero";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";

// const MoonCalendar = dynamic(() => import("@/components/moon/MoonCalendar"), {
//   ssr: false,
//   loading: () => (
//     <div className="h-[440px] w-full max-w-md animate-pulse rounded-[2rem] border border-white/10 bg-slate-900/60" />
//   ),
// });

export default function Hero({ hero }: { hero: HeroType }) {
  if (hero.disabled) {
    return null;
  }

  const highlightText = hero.highlight_text;
  const texts = highlightText ? hero.title?.split(highlightText, 2) : null;

  return (
    <section className="relative overflow-hidden">
      <HeroBg />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%)]" />
      <div className="pointer-events-none absolute -left-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-400/20 to-transparent blur-3xl opacity-70" />

      <div className="container relative z-10 py-20 lg:py-32">
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(320px,440px)]">
          <div className="mx-auto w-full max-w-2xl space-y-10 text-left lg:mx-0">
            {hero.show_badge && (
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                  {hero.tip || "Mondkalender"}
                </span>
                <img
                  src="/imgs/badges/phdaily.svg"
                  alt="phdaily"
                  className="h-10 w-auto object-contain"
                />
              </div>
            )}

            <div className="space-y-6">
              {hero.announcement && (
                <Link
                  href={hero.announcement.url as any}
                  target={hero.announcement.target || undefined}
                  className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition-colors hover:border-white/30 hover:bg-white/10"
                >
                  {hero.announcement.label && (
                    <Badge className="border border-primary/10 bg-primary/10 text-primary">
                      {hero.announcement.label}
                    </Badge>
                  )}
                  <span>{hero.announcement.title}</span>
                </Link>
              )}

              {texts && texts.length > 1 ? (
                <h1 className="text-balance text-4xl font-bold leading-tight text-white lg:text-6xl xl:text-7xl">
                  {texts[0]}
                  <span className="relative inline-block px-1">
                    <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-20 blur-xl" />
                    <span className="relative bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {highlightText}
                    </span>
                  </span>
                  {texts[1]}
                </h1>
              ) : (
                <h1 className="text-balance text-4xl font-bold leading-tight text-white lg:text-6xl xl:text-7xl">
                  {hero.title}
                </h1>
              )}

              <p
                className="text-lg leading-relaxed text-white/70 lg:text-xl"
                dangerouslySetInnerHTML={{ __html: hero.description || "" }}
              />
            </div>

            {hero.buttons && hero.buttons.length > 0 && (
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {hero.buttons.map((item, i) => (
                  <Link
                    key={i}
                    href={item.url as any}
                    target={item.target || undefined}
                    className="flex items-center"
                  >
                    <Button
                      className="w-full rounded-full px-8 py-6 text-base font-semibold shadow-lg shadow-blue-500/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-blue-500/20 sm:w-auto"
                      size="lg"
                      variant={item.variant || "default"}
                    >
                      {item.icon && <Icon name={item.icon} className="mr-2" />}
                      {item.title}
                    </Button>
                  </Link>
                ))}
              </div>
            )}

            {hero.tip && (
              <p className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white/70 backdrop-blur">
                {hero.tip}
              </p>
            )}

            {hero.show_happy_users && (
              <div className="pt-4">
                <HappyUsers />
              </div>
            )}
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-blue-500/25 via-purple-500/20 to-transparent blur-3xl" />
            {/* <MoonCalendar className="border-white/10 bg-slate-950/70" /> */}
          </div>
        </div>
      </div>
    </section>
  );
}
