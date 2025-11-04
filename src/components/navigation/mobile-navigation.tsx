'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, Search, User, Heart, Plus } from 'lucide-react';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';

// 默认导航配置
const NAV_ITEMS = [
  { id: 'home', icon: Home, path: '/' },
  { id: 'search', icon: Search, path: '/social' },
  { id: 'moon', icon: Plus, path: '/tools' },
  { id: 'favorites', icon: Heart, path: '/posts' },
  { id: 'profile', icon: User, path: '/glossary' }
];

export const MobileNavigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const isMobile = useIsMobile();
  const t = useTranslations('navigation');

  // 如果不是移动端，不显示底部导航
  if (!isMobile) {
    return null;
  }

  // 添加国际化支持和当前路径检测
  const navItems = NAV_ITEMS.map(item => ({
    ...item,
    label: t(item.id),
    isActive: pathname === `/${locale}${item.path}` ||
              (item.path === '/' && pathname === `/${locale}`)
  }));

  // 处理导航点击
  const handleNavClick = (item: any) => {
    const fullPath = item.path === '/' ? `/${locale}` : `/${locale}${item.path}`;
    router.push(fullPath);
  };

  return (
    <BottomNavigation
      items={navItems}
      onItemClick={handleNavClick}
      variant="default"
    />
  );
};

export default MobileNavigation;
