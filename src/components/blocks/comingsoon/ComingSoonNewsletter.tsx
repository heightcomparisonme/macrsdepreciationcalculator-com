'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ComingSoonNewsletter() {
  const t = useTranslations('pages.comingsoon.comingsoon.page.newsletter')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
      setEmail('')
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h3 className="text-white/90 text-lg font-medium">
        {t('title')}
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder={t('placeholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Button type="submit" size="lg" className="sm:w-auto w-full">
          {submitted ? t('subscribed') : t('subscribe')}
        </Button>
      </form>
      {submitted && (
        <p className="text-emerald-400 text-sm animate-fade-in">
          {t('success')}
        </p>
      )}
    </div>
  )
}
