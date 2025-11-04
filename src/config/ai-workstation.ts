/**
 * AI Workstation Configuration
 * Contains fallback images and other configuration for the AI workstation feature
 */

export const AI_WORKSTATION_CONFIG = {
  // 回退图片配置
  fallbackImages: {
    // 默认前图（before image）
    defaultBefore: process.env.NEXT_PUBLIC_AI_WORKSTATION_DEFAULT_BEFORE || 
      "https://s.magicaitool.com/flux-ai/flux-kontext/before-4.jpg",
    
    // 默认后图（after image）
    defaultAfter: process.env.NEXT_PUBLIC_AI_WORKSTATION_DEFAULT_AFTER || 
      "https://s.magicaitool.com/flux-kontext/after-4.jpg",
      
    // API 失败时的回退图片
    apiFallback: process.env.NEXT_PUBLIC_AI_WORKSTATION_API_FALLBACK || 
      "https://s.magicaitool.com/flux-ai/flux-kontext/after-4.jpg",
  },
  
  // API 配置
  api: {
    // 支持的模型类型
    supportedModels: ["Pro", "Max"] as const,
    
    // 支持的纵横比
    supportedAspectRatios: ["1:1", "2:3", "16:9", "9:16", "Match Input"] as const,
    
    // 每张图片的积分消耗
    creditsPerImage: 5,
    
    // 最大图片数量
    maxImageCount: 5,
    
    // 提示词最大长度
    maxPromptLength: 2000,
    maxPromptLengthWarning: 1500,
  },
  
  // 用户体验配置
  ui: {
    // 防抖时间（毫秒）
    debounceTime: 3000,
    
    // 积分刷新间隔（毫秒）
    creditRefreshInterval: 30000,
  },
  
  // 安全配置
  security: {
    // 允许的图片域名
    allowedImageDomains: [
      'magicaitool.com',
      'replicate.delivery', 
      'pbxt.replicate.delivery'
    ],
    
    // 最大图片 URL 长度
    maxImageUrlLength: 2048,
  }
} as const;

export type AIWorkstationConfig = typeof AI_WORKSTATION_CONFIG;
export type SupportedModel = typeof AI_WORKSTATION_CONFIG.api.supportedModels[number];
export type SupportedAspectRatio = typeof AI_WORKSTATION_CONFIG.api.supportedAspectRatios[number];