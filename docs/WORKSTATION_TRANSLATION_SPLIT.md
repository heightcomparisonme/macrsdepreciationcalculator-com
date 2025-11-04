# Workstation Translation Split - 翻译文件拆分记录

## 📋 概述

本文档记录了将 `ai_workstation` 相关翻译从主翻译文件 (`src/i18n/messages/*.json`) 拆分到独立页面翻译文件 (`src/i18n/pages/workstation/*.json`) 的完整过程。

## 🎯 目标

- 减少主翻译文件的大小，提高可维护性
- 遵循项目的翻译文件组织规范
- 将页面相关的翻译放在对应的页面目录下

## 📁 文件结构变更

### 之前 (Before)
```
src/i18n/messages/
├── en.json          # 包含 ai_workstation 内容
├── de.json          # 未包含 workstation 内容
└── es.json          # 包含 ai_workstation 内容
```

### 之后 (After)
```
src/i18n/
├── messages/
│   ├── en.json      # 已移除 ai_workstation
│   ├── de.json      # 已移除 ai_workstation
│   └── es.json      # 已移除 ai_workstation
└── pages/
    └── workstation/
        ├── en.json  # 包含 workstation 翻译
        ├── de.json  # 包含 workstation 翻译
        └── es.json  # 包含 workstation 翻译
```

## 🔧 实施步骤

### 1. 创建页面翻译文件

创建了 3 个新的翻译文件：
- `src/i18n/pages/workstation/en.json`
- `src/i18n/pages/workstation/de.json`
- `src/i18n/pages/workstation/es.json`

每个文件包含完整的 workstation 命名空间，结构为：
```json
{
  "workstation": {
    "title": "...",
    "description": "...",
    "image_upload": { ... },
    "prompt": { ... },
    "dimensions": { ... },
    "model": { ... },
    "count": { ... },
    "watermark": { ... },
    "generate": { ... },
    "results": { ... },
    "errors": { ... },
    "credits": { ... }
  }
}
```

### 2. 更新翻译加载配置

修改 `src/i18n/request.ts`，在 `pageMapping` 数组中添加：
```typescript
const pageMapping = [
  // ... 其他页面
  { path: "workstation", key: "workstation" },
];
```

### 3. 更新组件代码

修改 `src/components/ui/ai-workstation.tsx` 中的所有翻译命名空间引用：

| 之前 (Before) | 之后 (After) |
|--------------|-------------|
| `useTranslations("ai_workstation")` | `useTranslations("pages.workstation")` |
| `useTranslations("ai_workstation.results")` | `useTranslations("pages.workstation.results")` |
| `useTranslations("ai_workstation.image_upload")` | `useTranslations("pages.workstation.image_upload")` |
| `useTranslations("ai_workstation.prompt")` | `useTranslations("pages.workstation.prompt")` |

### 4. 清理主翻译文件

从以下文件中移除了 `ai_workstation` 命名空间：
- ✅ `src/i18n/messages/en.json` (已完成)
- ✅ `src/i18n/messages/de.json` (已完成)
- ✅ `src/i18n/messages/es.json` (已完成)

### 5. 修复 JSON 格式错误

初始创建的翻译文件缺少外层 JSON 对象包装，导致解析错误：
```json
// ❌ 错误格式
"workstation": {
  // ...
},

// ✅ 正确格式
{
  "workstation": {
    // ...
  }
}
```

已修复所有 3 个文件的格式问题。

## ✅ 验证结果

运行验证脚本 `scripts/verify-workstation-translations.js`：

```
✅ src/i18n/pages/workstation/en.json
   Root keys: workstation
   Workstation keys (12): title, description, image_upload, prompt, dimensions...
   Size: 3.79 KB

✅ src/i18n/pages/workstation/de.json
   Root keys: workstation
   Workstation keys (12): title, description, image_upload, prompt, dimensions...
   Size: 3.79 KB

✅ src/i18n/pages/workstation/es.json
   Root keys: workstation
   Workstation keys (12): title, description, image_upload, prompt, dimensions...
   Size: 3.79 KB
```

## 📝 命名空间使用说明

### 在组件中使用

```typescript
// 整个 workstation 命名空间
const t = useTranslations("pages.workstation");
t("title");  // 访问 workstation.title

// 子命名空间
const t = useTranslations("pages.workstation.image_upload");
t("title");  // 访问 workstation.image_upload.title

// 嵌套访问
const t = useTranslations("pages.workstation");
t("errors.insufficient_credits");  // 访问 workstation.errors.insufficient_credits
```

### 翻译结构

完整的翻译结构包含 12 个主要部分：

1. **title** - 页面标题
2. **description** - 页面描述
3. **image_upload** - 图片上传相关 (9个键)
4. **prompt** - 提示词控制 (4个键)
5. **dimensions** - 图片尺寸 (2个键)
6. **model** - 模型选择 (2个键)
7. **count** - 生成数量 (2个键)
8. **watermark** - 水印设置 (1个键)
9. **generate** - 生成按钮和状态 (9个键)
10. **results** - 结果显示 (11个键)
11. **errors** - 错误信息 (6个键)
12. **credits** - 积分相关 (7个键)

## 🔄 对比其他页面

遵循相同的模式拆分其他页面翻译：

| 页面 | 主文件键名 | 页面文件位置 | 状态 |
|------|-----------|-------------|------|
| Discord | `discord` | `pages/discord/*.json` | ✅ 已完成 |
| Coming Soon | `comingsoon` | `pages/comingsoon/*.json` | ✅ 已完成 |
| Glossary | `glossary` | `pages/glossary/*.json` | ✅ 已完成 |
| Featured Creations | `featuredCreations` | `pages/featured-creations/*.json` | ✅ 已完成 |
| Onboarding | `onboarding` | `pages/onboarding/*.json` | ✅ 已完成 |
| Hero | `hero` | `pages/hero/*.json` | ✅ 已完成 |
| Landing | `landing` | `pages/landing/*.json` | ✅ 已完成 |
| Pricing | `pricing` | `pages/pricing/*.json` | ✅ 已完成 |
| Showcase | `showcase` | `pages/showcase/*.json` | ✅ 已完成 |
| **Workstation** | `workstation` | `pages/workstation/*.json` | ✅ **刚完成** |

## 🚀 后续步骤

1. **测试应用** - 在开发服务器上验证所有语言的 workstation 页面
2. **翻译内容** - 将 `de.json` 和 `es.json` 的内容翻译成对应语言
3. **继续拆分** - 如果主翻译文件中还有其他大型页面翻译，继续拆分

## 📚 参考资料

- 项目翻译规范: `AGENTS.md` - 8步功能开发流程
- 翻译加载配置: `src/i18n/request.ts`
- 西班牙语添加记录: `SPANISH_LANGUAGE_SETUP.md`

## ⚠️ 注意事项

1. **命名空间前缀**: 页面翻译需要使用 `pages.` 前缀访问
2. **JSON 格式**: 确保每个翻译文件都是有效的 JSON 对象 (外层包含 `{}`)
3. **同步更新**: 修改翻译结构时，需要同步更新所有 3 个语言文件
4. **组件引用**: 修改翻译文件位置后，必须更新所有组件中的命名空间引用

---

**完成时间**: 2025-01-XX  
**相关 PR**: #XXX  
**负责人**: AI Assistant
