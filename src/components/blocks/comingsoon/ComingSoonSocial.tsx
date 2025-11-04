'use client'

import { useTranslations } from 'next-intl'

export function ComingSoonSocial() {
  const t = useTranslations('pages.comingsoon.comingsoon.page.social')

  const socialLinks = [
    { name: t('twitter'), icon: '𝕏' },
    { name: t('instagram'), icon: 'IG' },
    { name: t('linkedin'), icon: 'in' },
    { name: t('github'), icon: 'GH' },
  ]

  return (
    <div className="flex items-center justify-center gap-4 pt-8">
      {socialLinks.map((social) => (
        <button
          key={social.name}
          className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-emerald-500/50 hover:bg-white/10 transition-all duration-300 hover:scale-110 flex items-center justify-center text-white/60 hover:text-emerald-400 font-semibold"
          aria-label={social.name}
        >
          {social.icon}
        </button>
      ))}
    </div>
  )
}
