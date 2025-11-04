'use client'

import { useTranslations } from 'next-intl'

export function ComingSoonHero() {
  const t = useTranslations('pages.comingsoon.comingsoon.page')

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="inline-block">
        <span className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium backdrop-blur-sm">
          {t('badge')}
        </span>
      </div>
      <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent leading-tight">
        {t('title')}
      </h1>
      <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed">
        {t('subtitle')}
      </p>
    </div>
  )
}
