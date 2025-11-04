'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { HeroSectionProps, AnimationConfig } from '@/types/hero';
import { useHeroSwitcher } from '@/hooks/useHeroSwitcher';
import { cn } from '@/lib/utils';

// 导入组件 - 可以被props覆盖
import DefaultComponentOne from './ComponentOne';
import DefaultComponentTwo from './ComponentTwo';
import DefaultControlPanel from './ControlPanel';

// 动态加载PreviewCarousel - 优化首屏性能
const DefaultPreviewCarousel = dynamic(() => import('./PreviewCarousel'), {
  ssr: false,
  loading: () => (
    <div className="h-full rounded-xl bg-gradient-to-br from-gray-900 to-black animate-pulse flex items-center justify-center">
      <div className="text-white text-sm">Loading preview...</div>
    </div>
  )
});

// 默认动画配置
const defaultAnimationConfig = {
  duration: 0.3,
  ease: "easeInOut",
  initial: { opacity: 0, x: 0 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 0 },
};

/**
 * HeroSection - 主容器组件
 *
 * 管理Hero模式切换和组件状态
 * 支持完全自定义子组件
 */
export default function HeroSection({
  initialMode = 'one',
  initialPanelState = {},
  onModeChange,
  className,
  animationDuration = 0.3,
  ComponentOne = DefaultComponentOne,
  ComponentTwo = DefaultComponentTwo,
  ControlPanel = DefaultControlPanel,
  PreviewCarousel = DefaultPreviewCarousel,
}: HeroSectionProps) {
  const t = useTranslations('hero_switcher.mode_indicator');

  const heroSwitcher = useHeroSwitcher({
    initialMode,
    initialPanelState,
    onModeChange,
  });

  // 事件联动：允许外部通过事件切换模式
  React.useEffect(() => {
    const toTwo = () => heroSwitcher.switchToTwo();
    const toThree = () => heroSwitcher.switchToThree?.();
    if (typeof window !== 'undefined') {
      window.addEventListener('switch-hero-to-two', toTwo);
      window.addEventListener('switch-hero-to-three', toThree as EventListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('switch-hero-to-two', toTwo);
        window.removeEventListener('switch-hero-to-three', toThree as EventListener);
      }
    };
  }, [heroSwitcher.switchToTwo, heroSwitcher.switchToThree]);



  return (
    <section
      id="hero"
      aria-label="Hero"
      className={cn("w-full py-8 px-4", className)}
    >
      <div className="max-w-7xl mx-auto">
        <div className={cn(
          "grid gap-6 items-stretch min-h-[80vh] lg:min-h-[700px]",
          "grid-cols-1", // 移动端单列
          heroSwitcher.isHeroOne || heroSwitcher.isHeroTwo || heroSwitcher.isHeroThree
            ? "lg:grid-cols-2" // 桌面端双列
            : "lg:grid-cols-1 lg:max-w-2xl lg:mx-auto" // 只有ControlPanel时居中
        )}>

          {/* ②：ControlPanel - 始终挂载，保证状态不丢 */}
          <div className="h-full order-1 lg:order-2">
            <ControlPanel
              state={heroSwitcher.panelState}
              onChange={heroSwitcher.updatePanelState}
              onBackToOne={heroSwitcher.switchToOne}
              currentMode={heroSwitcher.mode}
            />
          </div>

          {/* ①：ComponentOne - 只在 hero-one 时出现 */}
          <AnimatePresence initial={false} mode="popLayout">
            {heroSwitcher.isHeroOne && (
              <motion.div
                key="hero-one-left"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{
                  duration: animationDuration,
                  ease: "easeInOut"
                }}
                className="h-full order-2 lg:order-1"
              >
                <ComponentOne onSwitchToTwo={heroSwitcher.switchToTwo} onSwitchToThree={heroSwitcher.switchToThree} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ④：ComponentTwo - 只在 hero-three 时出现 */}
          <AnimatePresence initial={false} mode="popLayout">
            {heroSwitcher.isHeroThree && (
              <motion.div
                key="hero-three-left"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{
                  duration: animationDuration,
                  ease: "easeInOut"
                }}
                className="h-full order-2 lg:order-1"
              >
                <ComponentTwo />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ③：PreviewCarousel - 只在 hero-two 时出现 */}
          <AnimatePresence initial={false} mode="popLayout">
            {heroSwitcher.isHeroTwo && (
              <motion.div
                key="hero-two-right"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{
                  duration: animationDuration,
                  ease: "easeInOut"
                }}
                className="h-full order-2 lg:order-3"
              >
                <PreviewCarousel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 可选：模式指示器 */}
        <div className="flex justify-center mt-6">
          <div className="bg-white rounded-full px-4 py-2 shadow-sm border">
            <span className="text-sm text-gray-600">
              {t('mode')}: <strong className="text-gray-900">{t('current_mode', { mode: heroSwitcher.mode })}</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// 预设配置
export const HeroSectionPresets = {
  default: {
    initialMode: 'one' as const,
    animationDuration: 0.3,
  },
  fastAnimation: {
    initialMode: 'one' as const,
    animationDuration: 0.15,
  },
  slowAnimation: {
    initialMode: 'one' as const,
    animationDuration: 0.6,
  },
  startWithTwo: {
    initialMode: 'two' as const,
    animationDuration: 0.3,
  },
};
