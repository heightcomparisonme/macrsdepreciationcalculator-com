import React from 'react';
import { useTranslations } from 'next-intl';
import { ComponentOneProps } from '@/types/hero';
import { cn } from '@/lib/utils';
import Image from 'next/image';

/**
 * ComponentOne - 营销组件
 *
 * 用于显示产品介绍和触发切换到hero-two模式的组件
 * 完全可定制的内容和样式
 */
export default function ComponentOne({
  onSwitchToTwo,
  onSwitchToThree,
  title,
  description,
  subdescription,
  buttonText,
  className,
}: ComponentOneProps) {
  const t = useTranslations('hero_switcher.component_one');
  
  // 使用翻译值作为默认值
  const brandName = t('brand_name');
  const displayTitle = title || t('title');
  const displayDescription = description || t('description');
  const displaySubDescription = subdescription || t('subdescription');
  const displayButtonText = buttonText || t('button_text');

  // 模型logo列表
  const modelLogos = [
    { src: '/imgs/ComponentOne/ComponentOne-01.svg', alt: 'OpenAI GPT artificial intelligence language model logo for Mondkalender development' },
    { src: '/imgs/ComponentOne/ComponentOne-02.svg', alt: 'Anthropic Claude AI assistant model logo for conversational AI applications' },
    { src: '/imgs/ComponentOne/ComponentOne-03.svg', alt: 'Google Gemini multimodal AI model logo for text image video generation' },
    { src: '/imgs/ComponentOne/ComponentOne-04.svg', alt: 'Stability AI diffusion model logo for AI image generation and art creation' },
    { src: '/imgs/ComponentOne/ComponentOne-05.svg', alt: 'Replicate AI model hosting platform logo for machine learning deployment' },
    { src: '/imgs/ComponentOne/ComponentOne-06.svg', alt: 'Hugging Face transformers AI model hub logo for open source machine learning' },
    { src: '/imgs/ComponentOne/ComponentOne-07.svg', alt: 'Microsoft Azure OpenAI service logo for enterprise AI solutions' },
    { src: '/imgs/ComponentOne/ComponentOne-08.svg', alt: 'Cohere natural language processing AI model logo for text understanding' },
    { src: '/imgs/ComponentOne/ComponentOne-09.svg', alt: 'Midjourney AI art generator logo for creative image synthesis and design' },
    { src: '/imgs/ComponentOne/ComponentOne-10.svg', alt: 'RunwayML AI video generation model logo for creative content production' },
    { src: '/imgs/ComponentOne/ComponentOne-11.svg', alt: 'DeepSeek advanced AI reasoning model logo for complex problem solving' },
  ];

  return (
    <div className={cn(
      "rounded-2xl p-8 bg-gradient-to-br from-blue-500/6 via-purple-600/5 to-indigo-700/5 backdrop-blur-2xl border border-white/30 shadow-2xl h-full flex flex-col relative overflow-hidden",
      className
    )}>
      {/* 流动的边缘高光效果 */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        {/* 流动的高光条 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-flow-highlight"></div>
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-white/40 to-transparent animate-flow-highlight" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-white/40 to-transparent animate-flow-highlight" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-0 w-1 h-full bg-gradient-to-t from-transparent via-white/40 to-transparent animate-flow-highlight" style={{ animationDelay: '3s' }}></div>
        
        {/* 角落流动高光 */}
        <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-white/30 via-white/20 to-transparent animate-corner-flow"></div>
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-white/30 via-white/20 to-transparent animate-corner-flow" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-white/30 via-white/20 to-transparent animate-corner-flow" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-white/30 via-white/20 to-transparent animate-corner-flow" style={{ animationDelay: '4.5s' }}></div>
      </div>
      {/* 磨砂颗粒效果 */}
      <div className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none">
        <div className="absolute top-4 left-4 w-2 h-2 bg-white/40 rounded-full animate-grain-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-8 right-6 w-3 h-3 bg-white/30 rounded-full animate-grain-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-16 left-8 w-2 h-2 bg-white/50 rounded-full animate-grain-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-24 right-12 w-2 h-2 bg-white/40 rounded-full animate-grain-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-32 left-16 w-3 h-3 bg-white/30 rounded-full animate-grain-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-40 right-8 w-2 h-2 bg-white/50 rounded-full animate-grain-float" style={{ animationDelay: '5s' }}></div>
        <div className="absolute top-48 left-12 w-2 h-2 bg-white/40 rounded-full animate-grain-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-56 right-16 w-3 h-3 bg-white/30 rounded-full animate-grain-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-64 left-20 w-2 h-2 bg-white/50 rounded-full animate-grain-float" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute top-72 right-24 w-2 h-2 bg-white/40 rounded-full animate-grain-float" style={{ animationDelay: '3.5s' }}></div>
      </div>
      {/* 主要内容区域 - 紧凑排版 */}
      <div className="flex-1 flex flex-col justify-start pt-4">
        {/* 品牌名称 */}
        <div className="mb-26 relative">
          {/* 主品牌名称 */}
          <h2 className="text-6xl md:text-7xl font-black leading-none bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x animate-pulse hover:animate-brand-glow transition-all duration-300 hover:scale-105 cursor-default">
            {brandName}
          </h2>
          
          {/* 倒影效果 - 贴近主体 */}
          <div className="absolute top-full left-0 w-full h-full overflow-hidden">
            <h2 
              className="text-6xl md:text-7xl font-black leading-none bg-gradient-to-r from-blue-400/30 via-purple-500/40 to-pink-500/30 bg-clip-text text-transparent animate-water-ripple animate-reflection-mask"
              style={{
                transform: 'scaleY(-1) translateY(-1px)',
                filter: 'blur(0.5px)',
              }}
            >
              {brandName}
            </h2>
          </div>
          
          {/* 波光粼粼的光点效果 */}
          <div className="absolute top-full left-0 w-full h-32 overflow-hidden pointer-events-none">
            {/* 动态光点 */}
            <div className="absolute top-8 left-1/4 w-1 h-1 bg-blue-400/60 rounded-full animate-sparkle animate-float-light" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-12 left-1/3 w-1 h-1 bg-purple-400/60 rounded-full animate-sparkle animate-float-light" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-16 left-1/2 w-1 h-1 bg-pink-400/60 rounded-full animate-sparkle animate-float-light" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-20 left-2/3 w-1 h-1 bg-blue-400/60 rounded-full animate-sparkle animate-float-light" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-24 left-3/4 w-1 h-1 bg-purple-400/60 rounded-full animate-sparkle animate-float-light" style={{ animationDelay: '2s' }}></div>
            
            {/* 更大的光点 */}
            <div className="absolute top-10 left-1/5 w-2 h-2 bg-blue-400/40 rounded-full animate-sparkle animate-float-light" style={{ animationDelay: '0.3s' }}></div>
            <div className="absolute top-18 left-2/5 w-2 h-2 bg-purple-400/40 rounded-full animate-sparkle animate-float-light" style={{ animationDelay: '0.8s' }}></div>
            <div className="absolute top-26 left-4/5 w-2 h-2 bg-pink-400/40 rounded-full animate-sparkle animate-float-light" style={{ animationDelay: '1.3s' }}></div>
            
            {/* 涟漪效果 */}
            <div className="absolute top-16 left-1/2 w-4 h-4 border border-blue-400/30 rounded-full animate-ripple-wave" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-20 left-1/3 w-3 h-3 border border-purple-400/30 rounded-full animate-ripple-wave" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-24 left-2/3 w-2 h-2 border border-pink-400/30 rounded-full animate-ripple-wave" style={{ animationDelay: '3s' }}></div>
          </div>
        </div>

        {/* 标题 */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          {/* 处理标题中的Product或产品高亮 */}
          {(displayTitle.includes('Product') || displayTitle.includes('产品')) ? (
            <>
              {displayTitle.includes('Product') ? (
                <>
                  {displayTitle.split('Product')[0]}
                  <span className="text-yellow-400">Product</span>
                  {displayTitle.split('Product')[1]}
                </>
              ) : (
                <>
                  {displayTitle.split('产品')[0]}
                  <span className="text-yellow-400">产品</span>
                  {displayTitle.split('产品')[1]}
                </>
              )}
            </>
          ) : (
            displayTitle
          )}
        </h1>

        {/* 描述文字 */}
        <p className="text-gray-300 mb-4 text-lg leading-relaxed">
          {displayDescription}
        </p>

        {/* 副描述文字 */}
        <p className="text-gray-400 mb-16 text-sm leading-relaxed">
          {displaySubDescription}
        </p>

        {/* 模型Logo走马灯区域 */}
        <div className="mb-6">
          <div className="relative overflow-hidden">
            {/* 流动显示的logo走马灯 */}
            <div className="relative overflow-hidden">
              <div className="flex gap-4 animate-scroll">
                {modelLogos.map((logo, index) => (
                  <div
                    key={`scroll-${index}`}
                    className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center p-3 backdrop-blur-sm border border-white/20 flex-shrink-0"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      title={logo.alt}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                ))}
                {/* 重复logo实现无缝滚动 */}
                {modelLogos.map((logo, index) => (
                  <div
                    key={`scroll-repeat-${index}`}
                    className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center p-3 backdrop-blur-sm border border-white/20 flex-shrink-0"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      title={logo.alt}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部按钮区域 */}
      <div className="flex gap-4 mt-auto justify-end">
        <button
          type="button"
          className="rounded-xl bg-green-500 hover:bg-green-600 px-6 py-3 text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          onClick={onSwitchToTwo}
          aria-controls="hero"
          aria-label={`Switch to hero mode two - ${displayButtonText}`}
        >
          {displayButtonText}
        </button>
        {/* <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black" onClick={onSwitchToTwo} aria-controls="hero" aria-label={`See demo and switch to hero mode two - ${displayButtonText}`}>
          {t('see_demo')}
        </button> */}
        {onSwitchToThree && (
          <button
            type="button"
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black"
            onClick={onSwitchToThree}
            aria-controls="hero"
            aria-label={`Switch to hero mode three - ${displayButtonText}`}
          >
            {t('see_demo')}
          </button>
        )}
      </div>
    </div>
  );
}

// 预设变体
export const ComponentOneVariants = {
  default: {
    title: 'Make Your Mondkalender Product in a weekend',
    description: 'The complete Next.js boilerplate for building profitable SaaS, packed with AI, auth, payments, i18n, newsletter, dashboard, blog, docs, blocks, themes, SEO and more.',
    subdescription: 'Explore, create, and innovate with cutting-edge AI applications.',
    buttonText: 'Get MiSaaS',
  },
  minimal: {
    title: 'Build Better Products',
    description: 'Transform your ideas into reality with our powerful platform.',
    subdescription: 'Start building today with our comprehensive toolkit.',
    buttonText: 'Get Started',
  },
  enterprise: {
    title: 'Enterprise AI Solutions',
    description: 'Scalable AI infrastructure for enterprise teams. Deploy, monitor and scale AI applications with confidence.',
    subdescription: 'Built for scale, designed for enterprise.',
    buttonText: 'Contact Sales',
  },
};
