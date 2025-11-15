'use client';

import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HappyUsers from "../happy-users";
import HeroBg from "../bg";
import { Hero as HeroType } from "@/types/blocks/hero";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";

// Dynamic import for PDF viewer to avoid SSR issues
// const PdfViewer = dynamic(() => import("@/components/Tools/pdf-viewer"), {
//   ssr: false,
//   loading: () => (
//     <div className="h-[600px] w-full animate-pulse rounded-2xl border border-white/10 bg-slate-900/60" />
//   ),
// });

export default function Hero({ hero }: { hero: HeroType }) {
  if (hero.disabled) {
    return null;
  }

  const highlightText = hero.highlight_text;
  const texts = highlightText ? hero.title?.split(highlightText, 2) : null;
  const docHighlights = [
    { label: "Pages", value: "240+" },
    { label: "Updated", value: "2025 edition" },
    { label: "Audience", value: "CPAs & controllers" },
  ];

  return (
    <section className="relative overflow-hidden">
      <HeroBg />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%)]" />
      <div className="pointer-events-none absolute -left-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-400/20 to-transparent blur-3xl opacity-70" />

      <div className="container relative z-10 py-20 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(420px,600px)] lg:items-start">
          <div className="mx-auto w-full max-w-2xl space-y-10 text-left lg:mx-0 lg:py-12">
            {hero.show_badge && (
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                  {hero.tip || "Macrs Depreciation Calculator"}
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

          <div className="relative flex flex-col gap-6 lg:min-h-[780px]">
            <div className="absolute inset-0 -z-10 rounded-[3rem] bg-gradient-to-br from-sky-500/15 via-purple-500/10 to-transparent blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 text-white/80 shadow-[0_35px_120px_rgba(6,10,48,0.45)] backdrop-blur-xl">
              <div className="absolute inset-0 opacity-40">
                <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" />
              </div>
              <div className="relative space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">IRS publication</p>
                    <h3 className="text-2xl font-semibold text-white">Publication 946</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80">
                      Verified guidance
                    </span>
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-200">
                      2025 updates live
                    </span>
                  </div>
                </div>

                <p className="max-w-xl text-sm text-white/70">
                  Preview the official IRS reference inside the product. Zoom, download, or print without leaving
                  your depreciation workflow.
                </p>

                <dl className="grid gap-4 sm:grid-cols-3">
                  {docHighlights.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                      <dt className="text-xs uppercase tracking-wide text-white/60">{item.label}</dt>
                      <dd className="text-lg font-semibold text-white">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="relative rounded-[2.75rem] border border-white/15 bg-gradient-to-br from-white/10 via-purple-500/10 to-transparent p-3 shadow-[0_30px_120px_rgba(8,8,32,0.65)]">
              <div className="pointer-events-none absolute -top-10 right-12 hidden max-w-[220px] rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/80 backdrop-blur lg:flex">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">Live preview</p>
                  <p className="font-semibold text-white">Interactive IRS guidance</p>
                </div>
              </div>

              <div className="pointer-events-none absolute -bottom-8 left-12 hidden rounded-full border border-white/10 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 backdrop-blur-sm lg:flex">
                Trusted by 99+ firms
              </div>

              <div className="relative rounded-[2.2rem] border border-white/15 bg-slate-950/80 p-4 sm:p-6 backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(147,197,253,0.35),_transparent_65%)] blur-2xl" />
                {/* <PdfViewer
                  fileUrl="/p946.pdf"
                  title="How To Depreciate Property - IRS Publication 946"
                  initialPage={1}
                  initialZoom={0.9}
                  className="relative h-[560px] border-0 bg-transparent shadow-none"
                /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
