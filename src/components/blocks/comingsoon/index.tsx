import { ComingSoonHero } from './ComingSoonHero'
import { ComingSoonCountdown } from './ComingSoonCountdown'
import { ComingSoonNewsletter } from './ComingSoonNewsletter'
import { ComingSoonSocial } from './ComingSoonSocial'
import { ComingSoonFooter } from './ComingSoonFooter'

export function ComingSoon() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900">
      {/* 动态背景粒子效果 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* 网格背景 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      {/* 主要内容 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="max-w-4xl w-full text-center space-y-12">
          <ComingSoonHero />
          <ComingSoonCountdown />
          <ComingSoonNewsletter />
          <ComingSoonSocial />
          <ComingSoonFooter />
        </div>
      </div>
    </div>
  )
}
