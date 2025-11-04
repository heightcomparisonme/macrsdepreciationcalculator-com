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
  MessageCircle
} from 'lucide-react';

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  isActive?: boolean;
}

interface BottomNavigationProps {
  items?: NavItem[];
  onItemClick?: (item: NavItem) => void;
  variant?: 'default' | 'minimal' | 'colorful';
}

const defaultItems: NavItem[] = [
  { id: 'home', icon: Home, label: '首页', isActive: true },
  { id: 'search', icon: Search, label: '搜索' },
  { id: 'add', icon: Plus, label: '创建' },
  { id: 'notifications', icon: Bell, label: '通知', badge: 3 },
  { id: 'profile', icon: User, label: '我的' }
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items = defaultItems,
  onItemClick,
  variant = 'default'
}) => {
  const [activeItem, setActiveItem] = useState(items.find(item => item.isActive)?.id || items[0]?.id);

  const handleItemClick = (item: NavItem) => {
    setActiveItem(item.id);
    onItemClick?.(item);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return 'bg-white/90 border-gray-200/50';
      case 'colorful':
        return 'bg-gradient-to-r from-purple-600/90 to-pink-600/90 border-white/20';
      default:
        return 'bg-black/90 border-white/10';
    }
  };

  const getItemStyles = (isActive: boolean) => {
    switch (variant) {
      case 'minimal':
        return isActive
          ? 'text-primary bg-primary/10'
          : 'text-muted-foreground hover:text-primary hover:bg-muted';
      case 'colorful':
        return isActive
          ? 'text-white bg-white/20'
          : 'text-white/70 hover:text-white hover:bg-white/10';
      default:
        return isActive
          ? 'text-primary bg-primary/20'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* 底部安全区域适配 */}
      <div className="pb-safe">
        {/* 主导航栏 */}
        <div className={`
          backdrop-blur-xl border-t transition-all duration-300
          ${getVariantStyles()}
        `}>
          <div className="flex items-center justify-around px-2 py-2">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`
                    relative flex flex-col items-center justify-center
                    min-w-[3.5rem] h-14 rounded-xl
                    transition-all duration-300 ease-out
                    transform active:scale-95
                    ${getItemStyles(isActive)}
                    ${isActive ? 'shadow-lg' : ''}
                  `}
                >
                  {/* 活跃状态指示器 */}
                  {isActive && (
                    <div className="absolute -top-1 w-8 h-1 bg-primary rounded-full animate-pulse" />
                  )}

                  {/* 图标容器 */}
                  <div className="relative">
                    <Icon
                      size={20}
                      className={`
                        transition-all duration-300
                        ${isActive ? 'scale-110' : 'scale-100'}
                      `}
                    />

                    {/* 徽章 */}
                    {item.badge && item.badge > 0 && (
                      <div className="absolute -top-2 -right-2 min-w-[1.125rem] h-[1.125rem] bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                        {item.badge > 99 ? '99+' : item.badge}
                      </div>
                    )}
                  </div>

                  {/* 标签 */}
                  <span className={`
                    text-xs font-medium mt-1 transition-all duration-300
                    ${isActive ? 'opacity-100 scale-100' : 'opacity-70 scale-95'}
                  `}>
                    {item.label}
                  </span>

                  {/* 涟漪效果 */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-primary/20 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// 预设导航配置
export const navigationPresets = {
  social: [
    { id: 'home', icon: Home, label: '首页', isActive: true },
    { id: 'search', icon: Search, label: '搜索' },
    { id: 'add', icon: Plus, label: '发布' },
    { id: 'likes', icon: Heart, label: '喜欢', badge: 12 },
    { id: 'profile', icon: User, label: '我的' }
  ],
  ecommerce: [
    { id: 'home', icon: Home, label: '首页', isActive: true },
    { id: 'search', icon: Search, label: '搜索' },
    { id: 'cart', icon: ShoppingBag, label: '购物车', badge: 2 },
    { id: 'favorites', icon: Heart, label: '收藏' },
    { id: 'account', icon: User, label: '账户' }
  ],
  messaging: [
    { id: 'chats', icon: MessageCircle, label: '聊天', isActive: true, badge: 5 },
    { id: 'contacts', icon: User, label: '联系人' },
    { id: 'add', icon: Plus, label: '新建' },
    { id: 'notifications', icon: Bell, label: '通知', badge: 3 },
    { id: 'profile', icon: User, label: '我的' }
  ]
};

export default BottomNavigation;
