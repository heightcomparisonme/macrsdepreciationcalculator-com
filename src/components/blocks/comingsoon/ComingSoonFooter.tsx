'use client'

import { useTranslations } from 'next-intl'

export function ComingSoonFooter() {
  const t = useTranslations('pages.comingsoon.comingsoon.page')

  return (
    <div className="pt-8 text-white/40 text-sm">
      <p>{t('footer')}</p>
    </div>
  )
}
