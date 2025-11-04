'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

export function ComingSoonCountdown() {
  const t = useTranslations('pages.comingsoon.comingsoon.page.countdown')
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // 设置倒计时目标日期（30天后）
  useEffect(() => {
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 30)

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const countdownItems = [
    { label: t('days'), value: timeLeft.days },
    { label: t('hours'), value: timeLeft.hours },
    { label: t('minutes'), value: timeLeft.minutes },
    { label: t('seconds'), value: timeLeft.seconds },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
      {countdownItems.map((item, index) => (
        <div
          key={item.label}
          className="relative group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 hover:border-emerald-500/30 transition-all duration-500 hover:scale-105">
            <div className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-white to-emerald-200 bg-clip-text text-transparent">
              {String(item.value).padStart(2, '0')}
            </div>
            <div className="text-sm md:text-base text-white/60 mt-2 font-medium">
              {item.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
