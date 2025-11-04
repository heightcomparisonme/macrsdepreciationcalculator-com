# 移动端底部导航组件

这是一个专为Next.js应用设计的现代化移动端底部导航组件，支持多种主题、动画效果和路由集成。

## 📚 组件结构

```
src/components/
├── ui/
│   ├── bottom-navigation.tsx      # 基础底部导航组件
│   └── advanced-bottom-navigation.tsx  # 高级底部导航组件
└── navigation/
    ├── mobile-navigation.tsx      # 路由集成包装组件
    └── README.md                  # 本文档
```

## 🚀 快速开始

### 基础使用

```tsx
import { MobileNavigation } from '@/components/navigation/mobile-navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main className="main-content">
        {children}
      </main>
      <MobileNavigation />
    </div>
  );
}
```

### 高级配置

```tsx
<MobileNavigation
  variant="advanced"           // 'basic' | 'advanced'
  preset="social"             // 'default' | 'social' | 'ecommerce'
  theme="glassmorphism"       // 多种主题选择
  showLabels={true}           // 显示标签
  animationType="bounce"      // 动画类型
  hapticFeedback={true}       // 触觉反馈
/>
```

## 🎨 主题和样式

### 基础组件主题
- `default`: 深色主题（默认）
- `minimal`: 简约浅色主题
- `colorful`: 彩色渐变主题

### 高级组件主题
- `dark`: 深色主题（默认）
- `light`: 浅色主题
- `gradient`: 彩色渐变
- `glassmorphism`: 玻璃拟态效果

### 动画类型
- `bounce`: 弹跳动画（默认）
- `slide`: 滑动动画
- `scale`: 缩放动画
- `rotate`: 旋转动画

## 📱 预设配置

### 默认配置
```tsx
const defaultNavItems = [
  { id: 'home', icon: Home, label: '首页', path: '/' },
  { id: 'search', icon: Search, label: '搜索', path: '/search' },
  { id: 'create', icon: Plus, label: '创建', path: '/create' },
  { id: 'favorites', icon: Heart, label: '收藏', path: '/favorites' },
  { id: 'profile', icon: User, label: '我的', path: '/profile' }
];
```

### 社交应用配置
```tsx
const socialNavItems = [
  { id: 'home', icon: Home, label: '首页', path: '/' },
  { id: 'search', icon: Search, label: '发现', path: '/discover' },
  { id: 'create', icon: Plus, label: '发布', path: '/create', isSpecial: true },
  { id: 'activity', icon: Heart, label: '动态', path: '/activity' },
  { id: 'profile', icon: User, label: '我的', path: '/profile' }
];
```

### 电商应用配置
```tsx
const ecommerceNavItems = [
  { id: 'home', icon: Home, label: '首页', path: '/' },
  { id: 'search', icon: Search, label: '搜索', path: '/search' },
  { id: 'cart', icon: Plus, label: '购物车', path: '/cart' },
  { id: 'favorites', icon: Heart, label: '收藏', path: '/favorites' },
  { id: 'account', icon: User, label: '账户', path: '/account' }
];
```

## 🔧 特性

### 移动端检测
组件使用 `useIsMobile` hook 自动检测设备类型，只在移动端显示。

```tsx
import { useIsMobile } from '@/hooks/use-is-mobile';

const isMobile = useIsMobile(); // 768px 断点
const isMobileCustom = useIsMobile(600); // 自定义断点
```

### 路由集成
自动集成Next.js路由系统，支持国际化：

```tsx
// 自动处理路由跳转
const handleNavClick = (item) => {
  const fullPath = item.path === '/' ? `/${locale}` : `/${locale}${item.path}`;
  router.push(fullPath);
};

// 自动检测当前页面
const isActive = pathname === `/${locale}${item.path}`;
```

### 国际化支持
在 `src/i18n/messages/` 中添加翻译：

```json
// en.json
{
  "navigation": {
    "home": "Home",
    "search": "Search",
    "create": "Create",
    "profile": "Profile"
  }
}

// zh.json
{
  "navigation": {
    "home": "首页",
    "search": "搜索", 
    "create": "创建",
    "profile": "我的"
  }
}
```

### 安全区域适配
自动适配iOS设备的安全区域：

```css
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

.main-content {
  padding-bottom: calc(5rem + env(safe-area-inset-bottom, 0));
}
```

## 🎯 API 参考

### MobileNavigation Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `variant` | `'basic' \| 'advanced'` | `'basic'` | 组件变体 |
| `preset` | `'default' \| 'social' \| 'ecommerce'` | `'default'` | 预设配置 |
| `theme` | `string` | `'default'` | 主题样式 |
| `showLabels` | `boolean` | `true` | 是否显示标签 |
| `animationType` | `'bounce' \| 'slide' \| 'scale' \| 'rotate'` | `'bounce'` | 动画类型 |
| `hapticFeedback` | `boolean` | `true` | 触觉反馈 |

### NavItem 类型

```typescript
interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
  isActive?: boolean;
  isSpecial?: boolean; // 仅高级组件
  color?: string;      // 仅高级组件
}
```

## 🛠️ 自定义扩展

### 添加新的导航项

```tsx
// 在 mobile-navigation.tsx 中扩展
const customNavItems = [
  { id: 'dashboard', icon: BarChart, label: '仪表板', path: '/dashboard' },
  { id: 'settings', icon: Settings, label: '设置', path: '/settings' },
  // ... 更多项目
];
```

### 自定义点击行为

```tsx
const handleNavClick = (item) => {
  if (item.isSpecial) {
    // 特殊按钮处理
    if (item.id === 'create') {
      // 打开创建模态框
      setCreateModalOpen(true);
      return;
    }
  }
  
  // 正常路由跳转
  router.push(item.path);
};
```

### 添加新主题

```tsx
// 在组件中扩展主题
const getThemeStyles = () => {
  switch (theme) {
    case 'custom':
      return 'bg-custom-gradient border-custom-border';
    // ... 其他主题
  }
};
```

## 📱 移动端优化

### 性能优化
- 使用 `transform` 属性实现动画，避免重排
- 使用 `will-change` 提示浏览器优化
- 懒加载非关键图标

### 用户体验
- 支持触觉反馈（振动）
- 涟漪点击效果
- 平滑的动画过渡
- 防止误触的安全区域

### 可访问性
- 语义化的HTML结构
- 支持键盘导航
- 屏幕阅读器友好
- 适当的对比度

## 🧪 测试和调试

### 测试页面
访问 `/mobile-demo` 查看组件演示效果。

### 调试工具
```tsx
// 开启调试模式
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Navigation item clicked:', item);
  console.log('Current pathname:', pathname);
  console.log('Is mobile:', isMobile);
}
```

## 💡 最佳实践

1. **移动优先设计**：优先考虑移动端体验
2. **性能优化**：使用适当的动画和优化技术
3. **一致性**：保持与应用整体设计的一致性
4. **可访问性**：确保所有用户都能使用
5. **测试**：在不同设备上测试效果

## 📄 许可证

本组件基于 MIT 许可证开源。
