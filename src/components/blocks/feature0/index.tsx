'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';

// 卡片数据接口
interface CardData {
  id: number;
  title: string;
  image: string;
  alt: string;
  link?: string;
}

// 卡片数据 - Updated to Mondkalender tools
const getCardData = (locale: string): CardData[] => [
  {
    id: 1,
    title: locale === 'zh' ? "Mondkalender 2026" : "Mondkalender 2026",
    image: "/imgs/features0/tools-01.jpg",
    alt: locale === 'zh' ? "Mondkalender 2026 - 您的月相指南。了解最佳的头发护理、园艺和健康时机。" : "Mondkalender 2026 - Your moon phase guide. Discover the best times for hair care, gardening and health.",
    link: "/mondkalender-2026"
  },
  {
    id: 2,
    title: locale === 'zh' ? "剪发月历" : "Haare Schneiden",
    image: "/imgs/features0/tools-02.jpg",
    alt: locale === 'zh' ? "根据月相找到最佳的剪发日期。月亮影响头发生长 - 明智地利用月相。" : "Find the best days for haircuts according to moon phases. The moon influences hair growth - use moon phases wisely.",
    link: "/tools/mondkalender-haare-schneiden"
  },
  {
    id: 3,
    title: locale === 'zh' ? "月相烹饪" : "Kochen nach Mondkalender",
    image: "/imgs/features0/tools-03.jpg",
    alt: locale === 'zh' ? "按照月历烹饪的专业工具。了解最佳的烹饪和烘焙时机。" : "Professional tool for cooking by moon calendar. Discover optimal times for cooking and baking.",
    link: "/tools/kochen"
  },
  {
    id: 4,
    title: locale === 'zh' ? "月出月落" : "Mondaufgang",
    image: "/imgs/features0/tools-04.jpg",
    alt: locale === 'zh' ? "便捷的月出月落时间查询工具，了解您所在地区的月亮升落时间。" : "Convenient moon rise and set time lookup tool for your location.",
    link: "/tools/auf-untergang"
  },
  {
    id: 5,
    title: locale === 'zh' ? "打印版月历" : "Druckversion",
    image: "/imgs/features0/tools-05.jpg",
    alt: locale === 'zh' ? "下载 Mondkalender 2026 打印版。包含所有月相、星座和吉日的实用年历。" : "Download Mondkalender 2026 zum Ausdrucken. Practical annual calendar with all moon phases, zodiac signs and favorable days.",
    link: "/mondkalender-2026-zum-ausdrucken"
  },
  {
    id: 6,
    title: locale === 'zh' ? "今日月相" : "Mond Heute",
    image: "/imgs/features0/tools-06.jpg",
    alt: locale === 'zh' ? "查看今日月相和每日建议。获取关于剪发、园艺、健康等方面的实时推荐。" : "View today's moon phase and daily recommendations. Get real-time advice for hair cutting, gardening, health and more.",
    link: "/tools/mond-heute"
  },
  { 
    id: 7, 
    title: locale === 'zh' ? "计算CPM" : "calculate the cpm", 
    image: "/imgs/features0/tools-07.jpg",
    alt: locale === 'zh' ? "深入讲解CPM的计算方法及实用技巧，助力广告投放决策。" : "In-depth explanation of CPM calculation methods and practical tips to aid advertising decisions."
  },
  { 
    id: 8, 
    title: locale === 'zh' ? "如何计算CPM" : "How to Calculate CPM", 
    image: "/imgs/features0/tools-08.jpg",
    alt: locale === 'zh' 
      ? "详细介绍如何计算CPM，包括公式、步骤和实际案例，帮助用户直观理解成本计算方法。"
      : "Detailed explanation on how to calculate CPM, including formulas, steps, and practical examples to help users easily understand the cost calculation method."
  },
  { 
    id: 9, 
    title: locale === 'zh' ? "计算CPM" : "Calculate CPM", 
    image: "/imgs/features0/tools-09.jpg",
    alt: locale === 'zh' 
      ? "教你用简单公式快速计算CPM，助力广告主高效管理广告支出及收益。"
      : "Teaches you to quickly calculate CPM using simple formulas, helping advertisers efficiently manage ad spending and returns."
  },
  { 
    id: 10, 
    title: locale === 'zh' ? "计算CPM" : "CPM Calculation", 
    image: "/imgs/features0/tools-10.jpg",
    alt: locale === 'zh' 
      ? "通俗易懂地讲解CPM的计算逻辑和实用场景，使广告效果分析更直观。"
      : "Clear and understandable explanation of CPM calculation logic and practical scenarios, making ad performance analysis more intuitive."
  }
];

const Feature0 = () => {
  const locale = useLocale();
  const t = useTranslations('feature0');
  const cardData = getCardData(locale);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPointerX, setLastPointerX] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const animationFrameRef = useRef<number>();
  const autoRotateFrameRef = useRef<number>();
  const velocityRef = useRef(0);
  const interactionTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // 圆盘半径（根据屏幕大小调整）
  const getRadius = useCallback(() => {
    if (!isMounted) return 400; // 服务器端和客户端初始渲染时使用固定值
    return window.innerWidth < 768 ? 300 : 400;
  }, [isMounted]);

  // 自动旋转动画
  const autoRotateAnimate = useCallback(() => {
    if (isAutoRotating && !isUserInteracting && isMounted) {
      setRotation(prev => prev + 0.2); // 每帧旋转0.2度，缓慢旋转
      autoRotateFrameRef.current = requestAnimationFrame(autoRotateAnimate);
    }
  }, [isAutoRotating, isUserInteracting, isMounted]);

  // 惯性滚动动画
  const animate = useCallback(() => {
    if (Math.abs(velocityRef.current) > 0.1) {
      setRotation(prev => prev + velocityRef.current);

      // 指数衰减
      velocityRef.current *= 0.95;
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      // 惯性动画结束，重新开始自动旋转
      setIsUserInteracting(false);
    }
  }, []);

  // 开始用户交互
  const startUserInteraction = useCallback(() => {
    if (!isMounted) return;
    
    setIsUserInteracting(true);

    // 取消自动旋转
    if (autoRotateFrameRef.current) {
      cancelAnimationFrame(autoRotateFrameRef.current);
    }

    // 清除恢复定时器
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
  }, [isMounted]);

  // 结束用户交互（延迟恢复自动旋转）
  const endUserInteraction = useCallback(() => {
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }

    // 2秒后恢复自动旋转
    interactionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 2000);
  }, []);

  // 处理鼠标滚轮
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!isMounted) return;
    
    e.preventDefault();

    startUserInteraction();

    const delta = e.deltaY;
    const newVelocity = delta * 0.1;

    setVelocity(newVelocity);
    velocityRef.current = newVelocity;

    // 取消之前的动画
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // 开始新的惯性动画
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotion) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setRotation(prev => prev + newVelocity * 2);
      endUserInteraction();
    }
  }, [animate, startUserInteraction, endUserInteraction, isMounted]);

  // 处理拖拽
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isMounted) return;
    
    startUserInteraction();

    setIsDragging(true);
    setLastPointerX(e.clientX);
    setVelocity(0);
    velocityRef.current = 0;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    e.preventDefault();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !isMounted) return;

    const deltaX = e.clientX - lastPointerX;
    const newVelocity = deltaX * 0.3;

    setVelocity(newVelocity);
    velocityRef.current = newVelocity;
    setLastPointerX(e.clientX);

    setRotation(prev => prev + newVelocity);
  };

  const handlePointerUp = () => {
    if (!isMounted) return;
    
    setIsDragging(false);

    // 检查是否应该开始惯性动画
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotion && Math.abs(velocityRef.current) > 1) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      endUserInteraction();
    }
  };

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isMounted) return;
    
    const rotationStep = 36; // 每次旋转36度（360/10）

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      startUserInteraction();
      setRotation(prev => prev - rotationStep);
      endUserInteraction();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      startUserInteraction();
      setRotation(prev => prev + rotationStep);
      endUserInteraction();
    }
  };

  // 切换自动旋转
  const toggleAutoRotate = () => {
    if (!isMounted) return;
    setIsAutoRotating(!isAutoRotating);
  };

  // 计算卡片位置和旋转
  const getCardTransform = useCallback((index: number, isHovered: boolean) => {
    if (!isMounted) {
      // 服务器端渲染时返回初始位置
      return 'translate3d(0px, 0px, 0px) rotateY(0deg) rotateX(0deg) rotateZ(0deg)';
    }
    
    const totalCards = cardData.length;
    const angleStep = 360 / totalCards;
    const cardAngle = (index * angleStep + rotation) * (Math.PI / 180);
    const radius = getRadius();

    const x = Math.cos(cardAngle) * radius;
    const z = Math.sin(cardAngle) * radius;

    // 计算卡片朝向中心的旋转
    const cardRotationY = -(index * angleStep + rotation);

    // 3D 倾斜效果
    const tiltX = Math.sin(cardAngle) * 15; // 前后倾斜
    const tiltZ = Math.cos(cardAngle) * 5;  // 左右倾斜

    if (isHovered) {
      return `translate3d(${x}px, -20px, ${z}px) rotateY(${cardRotationY}deg) rotateX(0deg) rotateZ(0deg) scale(1.1)`;
    }

    return `translate3d(${x}px, 0px, ${z}px) rotateY(${cardRotationY}deg) rotateX(${tiltX}deg) rotateZ(${tiltZ}deg)`;
  }, [cardData.length, rotation, getRadius, isMounted]);

  // 设置事件监听器和自动旋转
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isMounted) return;

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (autoRotateFrameRef.current) {
        cancelAnimationFrame(autoRotateFrameRef.current);
      }
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, [handleWheel, isMounted]);

  // 自动旋转控制
  useEffect(() => {
    if (!isMounted) return;
    
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isAutoRotating && !isUserInteracting && !reducedMotion) {
      autoRotateFrameRef.current = requestAnimationFrame(autoRotateAnimate);
    } else if (autoRotateFrameRef.current) {
      cancelAnimationFrame(autoRotateFrameRef.current);
    }

    return () => {
      if (autoRotateFrameRef.current) {
        cancelAnimationFrame(autoRotateFrameRef.current);
      }
    };
  }, [isAutoRotating, isUserInteracting, autoRotateAnimate, isMounted]);

  // 客户端挂载状态
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden relative">
      <div className="container mx-auto px-4">
        {/* 主标题 */}
        <div className="text-center relative z-20 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t('description')}</p>
        </div>

        {/* 自动旋转控制按钮 */}
        {isMounted && (
          <div className="absolute top-6 right-6 z-30">
            <button
              onClick={toggleAutoRotate}
              className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-full p-3 transition-all duration-200 hover:bg-gray-700/80 hover:scale-105"
              title={isAutoRotating ? t('pause_rotation') : t('start_rotation')}
            >
              {isAutoRotating ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10v18a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h8l4 4z" />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* 自动旋转状态指示器 */}
        {isMounted && isAutoRotating && !isUserInteracting && (
          <div className="absolute top-6 left-6 z-30">
            <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-full px-4 py-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-300 text-sm font-medium">{t('auto_rotating')}</span>
            </div>
          </div>
        )}

        {/* 3D轮盘容器 */}
        <div
          className="relative mx-auto h-[600px] flex items-center justify-center"
          style={{ perspective: '1200px' }}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {/* 轮盘中心区域 */}
          <div
            ref={containerRef}
            className={`relative w-full h-full ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              transformStyle: 'preserve-3d'
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {cardData.map((card, index) => (
              <CardComponent
                key={card.id}
                card={card}
                index={index}
                getTransform={getCardTransform}
                isMounted={isMounted}
              />
            ))}

            {/* 中心点指示器 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white/20 rounded-full border-2 border-white/40 z-10" />
          </div>

          {/* 轮盘边框指示器 */}
          {isMounted && (
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-white/10 rounded-full pointer-events-none"
              style={{
                width: `${getRadius() * 2}px`,
                height: `${getRadius() * 2}px`
              }}
            />
          )}
        </div>

        {/* 底部提示胶囊 */}
        <div className="flex justify-center pt-8 relative z-20">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-6 py-3">
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('scroll_hint')}
              </div>
              <div className="w-1 h-1 bg-gray-500 rounded-full" />
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {t('swipe_hint')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 卡片组件
function CardComponent({
  card,
  index,
  getTransform,
  isMounted
}: {
  card: CardData;
  index: number;
  getTransform: (index: number, isHovered: boolean) => string;
  isMounted: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="absolute w-80 h-[420px] sm:w-[280px] sm:h-[360px] rounded-[28px] shadow-2xl ring-1 ring-white/5 overflow-hidden transition-all duration-300 ease-out"
      style={{
        left: '50%',
        top: '50%',
        marginLeft: '-160px', // -w/2
        marginTop: '-210px',  // -h/2
        transform: getTransform(index, isHovered),
        transformStyle: 'preserve-3d'
      }}
      onMouseEnter={() => isMounted && setIsHovered(true)}
      onMouseLeave={() => isMounted && setIsHovered(false)}
      onFocus={() => isMounted && setIsHovered(true)}
      onBlur={() => isMounted && setIsHovered(false)}
      tabIndex={0}
    >
      <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900">
        <img
          src={card.image}
          alt={card.alt}
          title={card.alt}
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl font-semibold">{card.title}</h3>
        </div>
      </div>
    </div>
  );
}

export default Feature0;
