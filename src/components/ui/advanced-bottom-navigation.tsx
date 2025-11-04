import type React from 'react';
import { useState } from 'react';
import {
  Home,
  Search,
  Heart,
  ShoppingBag,
  User,
  Plus,
  Bell,
  MessageCircle,
  Camera,
  Music,
  Star
} from 'lucide-react';

interface AdvancedNavItem {
  id: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  color?: string;
  isActive?: boolean;
  isSpecial?: boolean; // 特殊按钮，如发布按钮
}

interface AdvancedBottomNavProps {
  items?: AdvancedNavItem[];
  onItemClick?: (item: AdvancedNavItem) => void;
  theme?: 'dark' | 'light' | 'gradient' | 'glassmorphism';
  showLabels?: boolean;
  animationType?: 'bounce' | 'slide' | 'scale' | 'rotate';
  hapticFeedback?: boolean;
}

const defaultItems: AdvancedNavItem[] = [
  { id: 'home', icon: Home, label: '首页', isActive: true, color: '#8B5CF6' },
  { id: 'search', icon: Search, label: '搜索', color: '#06B6D4' },
  { id: 'camera', icon: Camera, label: '创建', isSpecial: true, color: '#F59E0B' },
  { id: 'notifications', icon: Bell, label: '通知', badge: 3, color: '#EF4444' },
  { id: 'profile', icon: User, label: '我的', color: '#10B981' }
];

export const AdvancedBottomNavigation: React.FC<AdvancedBottomNavProps> = ({
  items = defaultItems,
  onItemClick,
  theme = 'dark',
  showLabels = true,
  animationType = 'bounce',
  hapticFeedback = true
}) => {
  const [activeItem, setActiveItem] = useState(items.find(item => item.isActive)?.id || items[0]?.id);
  const [ripples, setRipples] = useState<{ [key: string]: boolean }>({});

  const handleItemClick = (item: AdvancedNavItem, event: React.MouseEvent) => {
    setActiveItem(item.id);

    // 触觉反馈
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }

    // 涟漪效果
    setRipples(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setRipples(prev => ({ ...prev, [item.id]: false }));
    }, 600);

    onItemClick?.(item);
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'light':
        return 'bg-background/95 border-border shadow-lg';
      case 'gradient':
        return 'bg-gradient-to-r from-purple-600/90 via-pink-600/90 to-red-600/90 border-white/20';
      case 'glassmorphism':
        return 'bg-background/10 border-border/20 shadow-2xl backdrop-blur-2xl';
      default:
        return 'bg-background/90 border-border shadow-xl';
    }
  };

  const getItemStyles = (item: AdvancedNavItem, isActive: boolean) => {
    const baseStyles = 'relative flex flex-col items-center justify-center transition-all duration-300 ease-out transform active:scale-95';

    if (item.isSpecial) {
      return `${baseStyles} w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 shadow-lg scale-110 -translate-y-2`;
    }

    if (isActive) {
      return `${baseStyles} min-w-[3.5rem] h-12 rounded-xl shadow-lg scale-105`;
    }

    return `${baseStyles} min-w-[3.5rem] h-12 rounded-xl hover:scale-105`;
  };

  const getActiveBackground = (item: AdvancedNavItem) => {
    if (theme === 'light') {
      return `bg-muted`;
    }
    return `bg-muted/20`;
  };

  const getTextColor = (item: AdvancedNavItem, isActive: boolean) => {
    if (item.isSpecial) return 'text-white';

    if (theme === 'light') {
      return isActive ? 'text-primary' : 'text-muted-foreground';
    }

    if (theme === 'gradient') {
      return 'text-white';
    }

    return isActive ? 'text-foreground' : 'text-muted-foreground';
  };

  const getAnimationClass = (isActive: boolean) => {
    if (!isActive) return '';

    switch (animationType) {
      case 'bounce':
        return 'animate-bounce';
      case 'slide':
        return 'animate-slide-up';
      case 'scale':
        return 'animate-pulse';
      case 'rotate':
        return 'animate-spin';
      default:
        return 'animate-bounce';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="pb-safe">
        <div className={`backdrop-blur-xl border-t transition-all duration-500 ${getThemeStyles()}`}>
          {/* 顶部装饰线 */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />

          <div className="flex items-center justify-around px-3 py-3">
            {items.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <button
                  key={item.id}
                  onClick={(e) => handleItemClick(item, e)}
                  className={getItemStyles(item, isActive)}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {/* 活跃状态背景 */}
                  {isActive && !item.isSpecial && (
                    <div
                      className={`absolute inset-0 rounded-xl ${getActiveBackground(item)}`}
                      style={{ backgroundColor: `${item.color}20` }}
                    />
                  )}

                  {/* 涟漪效果 */}
                  {ripples[item.id] && (
                    <div className="absolute inset-0 rounded-xl bg-white/30 animate-ripple" />
                  )}

                  {/* 图标容器 */}
                  <div className="relative z-10">
                    <Icon
                      size={item.isSpecial ? 24 : 20}
                      className={`
                        transition-all duration-300 ${getTextColor(item, isActive)}
                        ${isActive && !item.isSpecial ? getAnimationClass(isActive) : ''}
                      `}
                      style={{
                        color: isActive && !item.isSpecial ? item.color : undefined
                      }}
                    />

                    {/* 徽章 */}
                    {item.badge && item.badge > 0 && (
                      <div className="absolute -top-2 -right-2 min-w-[1.125rem] h-[1.125rem] bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg">
                        {item.badge > 99 ? '99+' : item.badge}
                      </div>
                    )}

                    {/* 活跃状态点 */}
                    {isActive && !item.isSpecial && (
                      <div
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full animate-pulse"
                        style={{ backgroundColor: item.color }}
                      />
                    )}
                  </div>

                  {/* 标签 */}
                  {showLabels && !item.isSpecial && (
                    <span
                      className={`
                        text-xs font-medium mt-1 transition-all duration-300 z-10
                        ${getTextColor(item, isActive)}
                        ${isActive ? 'opacity-100 scale-100' : 'opacity-70 scale-95'}
                      `}
                      style={{
                        color: isActive ? item.color : undefined
                      }}
                    >
                      {item.label}
                    </span>
                  )}

                  {/* 特殊按钮标签 */}
                  {showLabels && item.isSpecial && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-foreground bg-background/50 px-2 py-1 rounded-full whitespace-nowrap">
                      {item.label}
                    </span>
                  )}

                  {/* 悬停效果 */}
                  <div className="absolute inset-0 rounded-xl bg-muted/5 opacity-0 hover:opacity-100 transition-opacity duration-200" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// 高级预设配置
export const advancedPresets = {
  social: [
    { id: 'home', icon: Home, label: '首页', isActive: true, color: '#8B5CF6' },
    { id: 'search', icon: Search, label: '发现', color: '#06B6D4' },
    { id: 'camera', icon: Camera, label: '创建', isSpecial: true, color: '#F59E0B' },
    { id: 'likes', icon: Heart, label: '活动', badge: 12, color: '#EF4444' },
    { id: 'profile', icon: User, label: '我的', color: '#10B981' }
  ],
  music: [
    { id: 'home', icon: Home, label: '首页', isActive: true, color: '#8B5CF6' },
    { id: 'search', icon: Search, label: '搜索', color: '#06B6D4' },
    { id: 'player', icon: Music, label: '播放器', isSpecial: true, color: '#F59E0B' },
    { id: 'favorites', icon: Star, label: '收藏', color: '#F59E0B' },
    { id: 'profile', icon: User, label: '我的', color: '#10B981' }
  ],
  shopping: [
    { id: 'home', icon: Home, label: '首页', isActive: true, color: '#8B5CF6' },
    { id: 'search', icon: Search, label: '搜索', color: '#06B6D4' },
    { id: 'scan', icon: Plus, label: '扫描', isSpecial: true, color: '#F59E0B' },
    { id: 'cart', icon: ShoppingBag, label: '购物车', badge: 2, color: '#EF4444' },
    { id: 'account', icon: User, label: '账户', color: '#10B981' }
  ]
};

export default AdvancedBottomNavigation;
