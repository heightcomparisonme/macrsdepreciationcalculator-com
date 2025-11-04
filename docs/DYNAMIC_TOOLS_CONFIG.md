# Dynamic Tools Configuration Guide

## 📋 概述

`src/lib/tools-config.ts` 现在会**自动发现**项目中的所有工具，无需手动维护工具列表。

## 🚀 工作原理

### 1. 自动发现
系统会扫描 `src/app/[locale]/(default)/tools/` 目录下的所有子文件夹，每个子文件夹被视为一个工具。

```
src/app/[locale]/(default)/tools/
├── example/              ✅ 自动发现
├── mondkalender-2026/    ✅ 自动发现
├── moon-calculator/      ✅ 自动发现
└── page.tsx              ❌ 跳过（非目录）
```

### 2. 默认配置
所有自动发现的工具都会获得默认配置：

```typescript
{
  slug: "tool-name",           // 从目录名自动获取
  icon: "Sparkles",            // 默认图标
  color: "bg-gradient-to-br from-gray-500 to-gray-600",  // 默认颜色
  category: "Tools",           // 默认分类
  tags: []                     // 默认标签（空）
}
```

### 3. 自定义覆盖
在 `TOOL_OVERRIDES` 对象中添加自定义配置来覆盖默认值：

```typescript
const TOOL_OVERRIDES: Record<string, Partial<Omit<ToolConfig, 'slug'>>> = {
  "example": {
    icon: "Sparkles",
    color: "bg-gradient-to-br from-pink-500 to-pink-600",
    category: "AI Tools",
    tags: ["ai", "advisor", "personalized"],
    translationKey: "example"  // 如果使用嵌套翻译结构
  },
  // 添加更多自定义配置...
};
```

## 📝 添加新工具步骤

### 方法 1: 仅使用默认配置

1. **创建工具目录**
   ```bash
   mkdir src/app/[locale]/(default)/tools/my-new-tool
   ```

2. **添加 page.tsx**
   ```bash
   # 创建工具页面文件
   touch src/app/[locale]/(default)/tools/my-new-tool/page.tsx
   ```

3. **完成！** 🎉
   - 工具会自动出现在工具列表中
   - 使用默认的 Sparkles 图标和灰色渐变

### 方法 2: 使用自定义配置

1. **创建工具目录**（同上）

2. **在 `tools-config.ts` 中添加自定义配置**
   ```typescript
   const TOOL_OVERRIDES = {
     // ... 现有配置
     "my-new-tool": {
       icon: "Calendar",
       color: "bg-gradient-to-br from-teal-500 to-teal-600",
       category: "Moon Calendar",
       tags: ["calendar", "planning", "2026"],
       translationKey: "myNewTool"  // 可选
     }
   };
   ```

3. **添加翻译文件**（如果需要）
   ```bash
   # 创建翻译文件
   src/i18n/pages/tools/my-new-tool/en.json
   src/i18n/pages/tools/my-new-tool/de.json
   src/i18n/pages/tools/my-new-tool/es.json
   ```

## 🎨 自定义选项

### Icon（图标）
可用的图标名称（来自 lucide-react）：
- `Sparkles`, `Moon`, `Calendar`, `Star`, `Scissors`
- `Palette`, `Sunrise`, `ChefHat`, `SunMoon`, `Printer`
- `Globe`, `Sparkle` 等

### Color（颜色渐变）
推荐的 Tailwind 渐变样式：
```typescript
"bg-gradient-to-br from-blue-500 to-blue-600"     // 蓝色
"bg-gradient-to-br from-purple-500 to-purple-600" // 紫色
"bg-gradient-to-br from-pink-500 to-pink-600"     // 粉色
"bg-gradient-to-br from-green-500 to-green-600"   // 绿色
"bg-gradient-to-br from-amber-500 to-amber-600"   // 琥珀色
// ... 更多颜色
```

### Category（分类）
常用分类：
- `"Moon Calendar"` - 月历工具
- `"AI Tools"` - AI 工具
- `"Astrology"` - 占星术工具
- `"Tools"` - 通用工具

### Tags（标签）
用于搜索和过滤的关键词数组：
```typescript
tags: ["calendar", "planning", "2026", "print", "pdf"]
```

### Translation Key（翻译键）
- 不设置：使用扁平翻译结构 `{ "metadata": {...} }`
- 设置：使用嵌套结构 `{ "myTool": { "metadata": {...} } }`

## 🔍 调试工具

### 查看当前发现的工具
```typescript
import { TOOLS_CONFIG } from '@/lib/tools-config';

console.log('Discovered tools:', TOOLS_CONFIG);
```

### 验证工具配置
```bash
node -e "const { TOOLS_CONFIG } = require('./src/lib/tools-config.ts'); console.log(TOOLS_CONFIG);"
```

## 📦 完整示例

### 添加 "Moon Phase Calculator" 工具

1. **创建目录结构**
   ```bash
   mkdir src/app/[locale]/(default)/tools/moon-phase-calculator
   ```

2. **创建页面文件** `src/app/[locale]/(default)/tools/moon-phase-calculator/page.tsx`
   ```tsx
   import { getTranslations } from 'next-intl/server';
   
   export async function generateMetadata({ params: { locale } }) {
     const t = await getTranslations({ 
       locale, 
       namespace: 'pages.tools.moon-phase-calculator' 
     });
     return {
       title: t('metadata.title'),
       description: t('metadata.description')
     };
   }
   
   export default function MoonPhaseCalculatorPage() {
     return (
       <div>
         <h1>Moon Phase Calculator</h1>
         {/* Your tool content */}
       </div>
     );
   }
   ```

3. **添加自定义配置** 到 `tools-config.ts`
   ```typescript
   const TOOL_OVERRIDES = {
     // ... 现有配置
     "moon-phase-calculator": {
       icon: "Moon",
       color: "bg-gradient-to-br from-indigo-500 to-purple-600",
       category: "Moon Calendar",
       tags: ["moon", "phase", "calculator", "lunar", "astronomy"]
     }
   };
   ```

4. **创建翻译文件**
   ```json
   // src/i18n/pages/tools/moon-phase-calculator/en.json
   {
     "metadata": {
       "title": "Moon Phase Calculator",
       "description": "Calculate moon phases for any date"
     },
     "title": "Moon Phase Calculator",
     "description": "Find out the moon phase for any date"
   }
   ```

5. **完成！** 工具会自动显示在 `/tools` 页面

## ⚠️ 注意事项

1. **目录命名**
   - 使用 kebab-case：`moon-phase-calculator` ✅
   - 避免空格和特殊字符
   - 目录名会成为工具的 slug

2. **构建时生成**
   - 工具列表在构建时（或开发服务器启动时）生成
   - 添加新工具后需要重启开发服务器

3. **翻译文件位置**
   - 主工具列表：`src/i18n/pages/tools/*.json`
   - 单个工具：`src/i18n/pages/tools/{tool-slug}/*.json`

4. **仅在 TOOL_OVERRIDES 中的工具**
   - 即使没有对应的文件夹，在 `TOOL_OVERRIDES` 中定义的工具也会出现
   - 用于计划中的工具或外部工具

## 🎯 优势

✅ **自动化** - 创建文件夹即可添加工具，无需修改配置  
✅ **灵活性** - 可选的自定义覆盖，满足特殊需求  
✅ **可维护** - 减少重复代码，集中管理配置  
✅ **可扩展** - 易于添加新工具和新功能  
✅ **类型安全** - TypeScript 支持，编译时检查

## 🔄 迁移指南

如果你有现有的手动配置：

1. **保留现有配置** - 所有现有的配置都已迁移到 `TOOL_OVERRIDES`
2. **创建对应文件夹** - 为每个工具创建对应的目录
3. **测试** - 验证所有工具仍然正常显示
4. **逐步删除** - 移除不再需要的硬编码配置

---

**更新日期**: 2025-11-01  
**维护者**: Development Team
