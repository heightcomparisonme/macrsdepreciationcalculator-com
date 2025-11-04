# Tool Page Components

通用的工具页面组件系统，用于创建一致的计算器工具页面。每个工具页面可以使用这些可复用组件，并通过独立的翻译文件自定义内容。

## 组件列表

### 1. ToolFeatures

展示工具的主要功能特性（4个卡片网格布局）。

**Props:**
- `namespace: string` - i18n 命名空间（例如：`"tools.roi.features"`）
- `features: FeatureItem[]` - 功能列表数组

**FeatureItem 结构:**
```typescript
{
  icon: "calculator" | "trending" | "target" | "chart" | "zap" | "shield" | "users" | "award", // 图标名称（字符串）
  key: string,             // 嵌套对象的 key（例如："calculate", "optimize"）
  color: string           // Tailwind 颜色类（例如："text-blue-600"）
}
```

**可用图标:**
- `"calculator"` - Calculator 图标
- `"trending"` - TrendingUp 图标
- `"target"` - Target 图标
- `"chart"` - BarChart3 图标
- `"zap"` - Zap 图标（闪电）
- `"shield"` - Shield 图标（盾牌）
- `"users"` - Users 图标（用户）
- `"award"` - Award 图标（奖励）

**翻译结构示例:**
```json
{
  "features": {
    "title": "Powerful ROI Analysis Features",
    "description": "Everything you need to measure and optimize...",
    "calculate": {
      "title": "Quick Calculation",
      "description": "Instantly calculate ROI..."
    },
    "optimize": {
      "title": "Optimize Returns",
      "description": "Identify high-performing campaigns..."
    }
  }
}
```

### 2. ToolShowcase

展示工具如何工作，包含优势列表和展示图片（左右布局）。

**Props:**
- `namespace: string` - i18n 命名空间（例如：`"tools.roi.showcase"`）

**翻译结构示例:**
```json
{
  "showcase": {
    "badge": "How It Works",
    "title": "Maximize Your Marketing ROI",
    "description": "Our ROI calculator helps you...",
    "image_url": "/images/roi-showcase.png",
    "image_alt": "ROI Calculator Dashboard",
    "benefits": [
      "Calculate precise ROI percentages in seconds",
      "Compare campaign performance across channels",
      "Forecast revenue based on investment levels"
    ]
  }
}
```

### 3. ToolFAQ

常见问题解答部分（手风琴样式）。

**Props:**
- `namespace: string` - i18n 命名空间（例如：`"tools.roi.faq"`）

**翻译结构示例:**
```json
{
  "faq": {
    "title": "Frequently Asked Questions",
    "description": "Common questions about ROI calculations...",
    "items": [
      {
        "title": "What is ROI in marketing?",
        "description": "ROI (Return on Investment) measures..."
      }
    ]
  }
}
```

### 4. ToolCTA

行动号召部分，包含两个按钮（主按钮和次按钮）。

**Props:**
- `namespace: string` - i18n 命名空间（例如：`"tools.roi.cta"`）

**翻译结构示例:**
```json
{
  "cta": {
    "title": "Ready to Optimize Your Marketing ROI?",
    "description": "Start calculating and improving...",
    "primary_button": "Try More Tools",
    "secondary_button": "View Documentation",
    "primary_link": "/tools",
    "secondary_link": "/docs"
  }
}
```

### 5. ToolPageHero

工具页面的 Hero 区域，包含徽章、标题、副标题和两个 CTA 按钮。

**Props:**
- `namespace: string` - i18n 命名空间（例如：`"tools.roi.hero"`）

**翻译结构示例:**
```json
{
  "hero": {
    "badge": "ROI Analysis",
    "title": "ROI Calculator",
    "subtitle": "Calculate and optimize your marketing return on investment",
    "description": "Make data-driven decisions with precise ROI calculations",
    "cta_primary": "Start Calculating",
    "cta_secondary": "Learn More"
  }
}
```

**视觉特点:**
- 渐变背景效果
- 动画进入效果（淡入 + 上移）
- 响应式布局
- 主按钮和次按钮样式对比

### 6. ToolFeatures2

高级功能展示组件，包含交互式对比滑块和动画效果。这是一个复杂的交互组件，适合展示"前后对比"类型的功能。

**Props:**
- `namespace: string` - i18n 命名空间（例如：`"tools.roi.features2"`）
- `items: Features2Item[]` - 功能列表数组

**Features2Item 结构:**
```typescript
{
  icon: "calculator" | "trending" | "target" | "chart" | "zap" | "shield" | "users" | "award" | "check" | "sparkles",
  key: string,              // 嵌套对象的 key（例如："realtime", "comparison"）
  beforeImage: string,      // 对比前的图片路径
  afterImage: string        // 对比后的图片路径
}
```

**可用图标:**
- 包含 ToolFeatures 所有图标，外加：
  - `"check"` - CheckCircle2 图标（勾选）
  - `"sparkles"` - Sparkles 图标（闪光）

**翻译结构示例:**
```json
{
  "features2": {
    "label": "Advanced Features",
    "title": "Experience ROI Analysis Like Never Before",
    "description": "Interactive features that help you visualize...",
    "hover_tip": "Click to see the comparison",
    "slider_before_alt": "Before optimization",
    "slider_after_alt": "After optimization",
    "slider_hover_title": "Drag to Compare",
    "slider_hover_description": "Drag the slider left and right...",
    "items": {
      "realtime": {
        "title": "Real-time Calculations",
        "description": "Get instant ROI calculations as you input..."
      },
      "comparison": {
        "title": "Campaign Comparison",
        "description": "Compare ROI across multiple campaigns..."
      },
      "forecasting": {
        "title": "ROI Forecasting",
        "description": "Predict future returns based on historical data..."
      },
      "insights": {
        "title": "Smart Insights",
        "description": "AI-powered recommendations to improve..."
      }
    }
  }
}
```

**交互特性:**
- ✅ 自动轮播（8秒间隔切换功能）
- ✅ 鼠标悬停效果（卡片高亮、缩放、边框渐变）
- ✅ 点击反馈动画（缩放脉冲效果）
- ✅ 进度指示器（底部圆点导航）
- ✅ Before/After 滑块（可拖动对比图片）
- ✅ 活跃状态指示器（动画脉冲点）
- ✅ 渐进式内容展示（错开入场动画）
- ✅ 悬停提示信息
- ✅ 当前功能标签叠加层

**使用建议:**
- 适合展示工具的视觉效果改进
- 需要准备"前后对比"图片（before/after images）
- 建议功能数量：2-4个（最佳体验）
- 图片尺寸建议：宽高比 4:3 或 16:9，高度至少 500px

## 完整使用示例

### 1. 创建翻译文件

在 `src/i18n/pages/tools/[tool-name]/` 目录下创建 `en.json` 和 `zh.json`：

```
src/i18n/pages/tools/
├── roi/
│   ├── en.json
│   └── zh.json
├── cpa/
│   ├── en.json
│   └── zh.json
└── ctr/
    ├── en.json
    └── zh.json
```

### 2. 配置 i18n 加载

在 `src/i18n/request.ts` 中添加新工具的翻译加载：

```typescript
const toolsRoiMessages = (await import(`./pages/tools/roi/${locale}.json`)).default;

pageTranslations = {
  tools: {
    roi: toolsRoiMessages,
    // ... other tools
  }
};
```

### 3. 创建工具页面

在 `src/app/[locale]/(default)/tools/[tool-name]/page.tsx` 中使用组件：

```typescript
import { useTranslations } from "next-intl";
import { YourCalculator } from "@/components/blocks/calculator/...";
import { ToolPageHero } from "@/components/blocks/tools/ToolPageHero";
import { ToolFeatures } from "@/components/blocks/tools/ToolFeatures";
import { ToolFeatures2 } from "@/components/blocks/tools/ToolFeatures2";
import { ToolShowcase } from "@/components/blocks/tools/ToolShowcase";
import { ToolFAQ } from "@/components/blocks/tools/ToolFAQ";
import { ToolCTA } from "@/components/blocks/tools/ToolCTA";

export default function ToolPage() {
  const t = useTranslations("tools.roi.page");

  // 使用图标名称字符串，不需要导入 Lucide 组件
  const features = [
    {
      icon: "calculator" as const,
      key: "calculate",
      color: "text-blue-600",
    },
    {
      icon: "target" as const,
      key: "optimize",
      color: "text-green-600",
    },
    {
      icon: "chart" as const,
      key: "analyze",
      color: "text-purple-600",
    },
    {
      icon: "award" as const,
      key: "report",
      color: "text-orange-600",
    },
  ];

  // ToolFeatures2 需要 before/after 图片
  const advancedFeatures = [
    {
      icon: "zap" as const,
      key: "realtime",
      beforeImage: "/images/roi-before-1.png",
      afterImage: "/images/roi-after-1.png",
    },
    {
      icon: "users" as const,
      key: "comparison",
      beforeImage: "/images/roi-before-2.png",
      afterImage: "/images/roi-after-2.png",
    },
    {
      icon: "trending" as const,
      key: "forecasting",
      beforeImage: "/images/roi-before-3.png",
      afterImage: "/images/roi-after-3.png",
    },
    {
      icon: "sparkles" as const,
      key: "insights",
      beforeImage: "/images/roi-before-4.png",
      afterImage: "/images/roi-after-4.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background">
      {/* Hero Section */}
      <ToolPageHero namespace="tools.roi.hero" />

      <div className="container mx-auto px-4 py-8">
        {/* Calculator */}
        <YourCalculator />

        {/* Features (基础) */}
        <ToolFeatures namespace="tools.roi.features" features={features} />

        {/* Features2 (高级交互) */}
        <ToolFeatures2 namespace="tools.roi.features2" items={advancedFeatures} />

        {/* Showcase */}
        <ToolShowcase namespace="tools.roi.showcase" />

        {/* FAQ */}
        <ToolFAQ namespace="tools.roi.faq" />

        {/* CTA */}
        <ToolCTA namespace="tools.roi.cta" />
      </div>
    </div>
  );
}
```

## 翻译文件完整结构模板

```json
{
  "page": {
    "title": "Tool Name - Description",
    "description": "SEO description"
  },
  "calculator": {
    // 计算器特定的翻译
  },
  "hero": {
    "badge": "Badge text",
    "title": "Main title",
    "subtitle": "Subtitle text",
    "description": "Description text",
    "cta_primary": "Primary button text",
    "cta_secondary": "Secondary button text"
  },
  "features": {
    "title": "Main title",
    "description": "Subtitle",
    "calculate": {
      "title": "Feature 1 title",
      "description": "Feature 1 description"
    },
    "optimize": {
      "title": "Feature 2 title",
      "description": "Feature 2 description"
    },
    "analyze": {
      "title": "Feature 3 title",
      "description": "Feature 3 description"
    },
    "report": {
      "title": "Feature 4 title",
      "description": "Feature 4 description"
    }
  },
  "features2": {
    "label": "Section label",
    "title": "Main title",
    "description": "Subtitle",
    "hover_tip": "Hover tip text (optional)",
    "slider_before_alt": "Before image alt text",
    "slider_after_alt": "After image alt text",
    "slider_hover_title": "Slider hover title (optional)",
    "slider_hover_description": "Slider hover description (optional)",
    "items": {
      "realtime": {
        "title": "Feature 1 title",
        "description": "Feature 1 description"
      },
      "comparison": {
        "title": "Feature 2 title",
        "description": "Feature 2 description"
      },
      "forecasting": {
        "title": "Feature 3 title",
        "description": "Feature 3 description"
      },
      "insights": {
        "title": "Feature 4 title",
        "description": "Feature 4 description"
      }
    }
  },
  "showcase": {
    "badge": "Badge text",
    "title": "Section title",
    "description": "Section description",
    "image_url": "/images/...",
    "image_alt": "Image alt text",
    "benefits": [
      "Benefit 1",
      "Benefit 2",
      "Benefit 3"
    ]
  },
  "cta": {
    "title": "CTA title",
    "description": "CTA description",
    "primary_button": "Primary button text",
    "secondary_button": "Secondary button text",
    "primary_link": "/link1",
    "secondary_link": "/link2"
  },
  "faq": {
    "title": "FAQ title",
    "description": "FAQ description",
    "items": [
      {
        "title": "Question 1",
        "description": "Answer 1"
      }
    ]
  }
}
```

## 优势

1. **模块化**: 每个组件独立，易于维护和更新
2. **可复用**: 所有工具页面共享相同的组件
3. **翻译隔离**: 每个工具有独立的翻译文件，避免单个 JSON 文件过大
4. **类型安全**: 使用 TypeScript 确保正确的 props 传递
5. **一致性**: 所有工具页面保持一致的视觉和交互体验
6. **灵活性**: 可以选择性使用组件（不需要全部使用）

## 注意事项

- 确保在 `src/i18n/request.ts` 中正确配置翻译加载
- 图片路径应放在 `public/images/` 目录下
- **图标使用字符串名称**，不需要从 `lucide-react` 导入组件（避免 Server Component 错误）
- 每个工具的翻译文件应该独立维护
- 翻译键不能包含点号 `.`，使用嵌套对象结构代替

## 常见问题

**Q: 为什么不能直接传递 Lucide 图标组件？**

A: Next.js Server Components 不能将 React 组件（如 Lucide 图标）直接传递给 Client Components。我们使用字符串名称在客户端组件内部映射到对应的图标组件。

**Q: 如何添加新的图标？**

A: 在 `ToolFeatures.tsx` 或 `ToolFeatures2.tsx` 的 `ICON_MAP` 中添加新的图标映射：
```typescript
const ICON_MAP: Record<string, LucideIcon> = {
  // 现有图标...
  newIcon: NewIconComponent,
};
```

**Q: ToolFeatures 和 ToolFeatures2 有什么区别？**

A:

- **ToolFeatures**: 简单的4卡片网格布局，适合快速展示功能要点
- **ToolFeatures2**: 高级交互组件，包含：
  - Before/After 对比滑块
  - 自动轮播和手动切换
  - 复杂的悬停和点击动画
  - 进度指示器
  - 适合展示视觉效果改进或功能对比

选择建议：如果只需要展示功能列表，使用 ToolFeatures；如果需要展示"前后对比"效果，使用 ToolFeatures2。

**Q: 如何准备 ToolFeatures2 的对比图片？**

A:

1. 创建"优化前"和"优化后"的截图或设计图
2. 保持相同的宽高比（推荐 4:3 或 16:9）
3. 建议尺寸：至少 800x600px，高度不低于 500px
4. 保存到 `public/images/` 目录
5. 文件命名建议：`[tool-name]-before-[number].png` 和 `[tool-name]-after-[number].png`
