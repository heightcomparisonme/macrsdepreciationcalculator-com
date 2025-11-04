# Hero切换组件使用指南

## 概述

本Hero切换组件提供了一个动态的、交互式的用户界面，支持在两种模式之间切换：
- **Hero One**: 营销展示模式（左侧营销内容 + 中间控制面板）点击Get MiSaaS 切换成Hero Two
- **Hero three**: 模型展示模式（左侧模型展示内容 + 中间控制面板）点击See Demo 切换成Hero three
- **Hero Two**: 图片预览模式（中间控制面板 + 右侧图片轮播）

## 特性

- ✅ **状态保持**: 控制面板在模式切换时保持所有状态
- ✅ **流畅动画**: 使用Framer Motion实现平滑过渡
- ✅ **完全可定制**: 支持自定义所有子组件和样式
- ✅ **类型安全**: 完整的TypeScript类型定义
- ✅ **响应式设计**: 支持移动端和桌面端
- ✅ **无障碍性**: 完整的ARIA支持和键盘导航
- ✅ **多语言支持**: 集成next-intl，支持中英文切换

## 基础使用

### 简单集成

```tsx
import { HeroSection } from '@/components/blocks/hero';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
    </div>
  );
}
```

### 自定义配置

```tsx
import { HeroSection } from '@/components/blocks/hero';

export default function HomePage() {
  return (
    <HeroSection
      initialMode="two"
      animationDuration={0.5}
      initialPanelState={{
        prompt: "默认提示词",
        aspectRatio: "16:9",
        outputCount: 4
      }}
      onModeChange={(mode) => {
        console.log('切换到模式:', mode);
      }}
      className="bg-gradient-to-r from-blue-50 to-purple-50"
    />
  );
}
```

## 多语言支持

### 翻译配置

Hero组件已完全集成next-intl多语言系统，支持以下语言：

- 🇺🇸 English (en)
- 🇨🇳 中文 (zh)

### 自定义翻译

如果需要修改翻译文本，请编辑以下文件：

```json
// src/i18n/messages/en.json
{
  "hero_switcher": {
    "component_one": {
      "title": "Make Your Mondkalender Product in a weekend",
      "description": "...",
      "button_text": "Get MiSaaS"
    }
  }
}

// src/i18n/messages/zh.json  
{
  "hero_switcher": {
    "component_one": {
      "title": "一个周末构建您的Mondkalender产品",
      "description": "...",
      "button_text": "获取MiSaaS"
    }
  }
}
```

### 添加新语言

1. 在 `src/i18n/messages/` 中添加新的语言文件
2. 复制英文翻译结构并翻译对应文本
3. 更新项目的语言配置

## 高级用法

### 自定义子组件

```tsx
import { HeroSection, ComponentOneVariants } from '@/components/blocks/hero';
import CustomControlPanel from './CustomControlPanel';

function CustomMarketingComponent({ onSwitchToTwo }) {
  return (
    <div className="p-8 bg-purple-900 text-white rounded-2xl">
      <h1>自定义营销组件</h1>
      <button onClick={onSwitchToTwo}>
        切换到预览模式
      </button>
    </div>
  );
}

export default function HomePage() {
  return (
    <HeroSection
      ComponentOne={CustomMarketingComponent}
      ControlPanel={CustomControlPanel}
    />
  );
}
```

### 预设变体

```tsx
import { HeroSection, ComponentOneVariants } from '@/components/blocks/hero';

// 使用企业版预设
<ComponentOne
  {...ComponentOneVariants.enterprise}
  onSwitchToTwo={switchToTwo}
/>

// 可用预设:
// - ComponentOneVariants.default
// - ComponentOneVariants.minimal  
// - ComponentOneVariants.enterprise
```

### 状态管理

```tsx
import { useHeroSwitcher } from '@/components/blocks/hero';

function MyCustomComponent() {
  const {
    mode,
    panelState,
    switchToOne,
    switchToTwo,
    updatePrompt,
    hasImages,
    canGenerate
  } = useHeroSwitcher({
    initialMode: 'one',
    onModeChange: (mode) => console.log('模式切换:', mode)
  });

  return (
    <div>
      <p>当前模式: {mode}</p>
      <p>是否有图片: {hasImages ? '是' : '否'}</p>
      <button onClick={switchToTwo}>切换到模式二</button>
    </div>
  );
}
```

## 组件API

### HeroSection Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `initialMode` | `'one' \| 'two'` | `'one'` | 初始显示模式 |
| `initialPanelState` | `Partial<ImageUploadState>` | `{}` | 控制面板初始状态 |
| `onModeChange` | `(mode: HeroMode) => void` | - | 模式切换回调 |
| `className` | `string` | - | 自定义CSS类名 |
| `animationDuration` | `number` | `0.3` | 动画持续时间（秒） |
| `ComponentOne` | `React.ComponentType` | `DefaultComponentOne` | 自定义营销组件 |
| `ControlPanel` | `React.ComponentType` | `DefaultControlPanel` | 自定义控制面板 |
| `PreviewCarousel` | `React.ComponentType` | `DefaultPreviewCarousel` | 自定义轮播组件 |

### useHeroSwitcher Hook

```typescript
const {
  // 状态
  mode,              // 当前模式
  panelState,        // 控制面板状态
  
  // 方法
  switchToOne,       // 切换到hero-one
  switchToTwo,       // 切换到hero-two
  toggleMode,        // 切换模式
  updatePanelState,  // 更新面板状态
  addImages,         // 添加图片
  removeImage,       // 删除图片
  updatePrompt,      // 更新提示词
  
  // 计算属性
  isHeroOne,         // 是否为hero-one模式
  isHeroTwo,         // 是否为hero-two模式
  hasImages,         // 是否有上传图片
  canGenerate,       // 是否可以生成
} = useHeroSwitcher(options);
```

## 在项目中的集成

### 开发环境测试

项目已配置为在开发环境中自动使用新的Hero组件：

```tsx
// src/app/[locale]/(default)/page.tsx
const useNewHero = process.env.NODE_ENV === 'development';

{useNewHero ? (
  <HeroSection 
    initialMode="one"
    animationDuration={0.3}
    className="mb-12"
  />
) : (
  page.hero && <Hero hero={page.hero} />
)}
```

### 单独测试页面

访问 `/hero-test` 路由可以单独测试Hero组件功能。

## 样式定制

### Tailwind CSS类

```tsx
<HeroSection className="bg-gradient-to-r from-blue-50 to-purple-50" />
<ComponentOne className="bg-red-900 text-white" />
<ControlPanel className="shadow-2xl border-2 border-blue-200" />
```

### CSS变量（可选）

```css
.hero-section {
  --hero-bg: #f8fafc;
  --hero-border-radius: 1rem;
  --hero-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
}
```

## 性能优化

- PreviewCarousel组件使用动态导入，优化首屏加载
- 图片使用Next.js Image组件自动优化
- 状态管理使用useCallback避免不必要的重渲染

## 浏览器支持

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 故障排除

### 常见问题

1. **状态丢失**: 确保ControlPanel组件始终挂载，不要用条件渲染包裹
2. **动画卡顿**: 检查CSS transform和opacity是否被其他样式覆盖
3. **图片加载失败**: 确保Next.js配置了正确的图片域名
4. **TypeScript错误**: 确保导入了完整的类型定义

### 调试

启用开发模式指示器：
```tsx
<HeroSection className="debug" />
```

## 更新日志

- v1.0.0: 初始版本发布
  - 支持双模式切换
  - 完整的状态管理
  - 响应式设计
  - TypeScript支持
