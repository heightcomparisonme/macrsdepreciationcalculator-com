# AI工作站图片生成功能指南

## 功能概述

AI工作站集成了Replicate的Flux-Kontext模型，可以：
- 根据文本提示词生成新图片
- 编辑现有图片（增强、修改风格等）
- 支持多种输出格式和参数

## 使用方法

### 1. 纯文本生成图片

如果您没有上传图片，系统会根据提示词生成全新的图片：

```
提示词: "A beautiful sunset over mountains, digital art style"
```

### 2. 图片编辑

如果您上传了图片，系统会根据提示词编辑现有图片：

```
提示词: "Make the image more vibrant and colorful"
输入图片: [您上传的图片]
```

## 技术实现

### API流程

1. **积分检查**: 验证用户是否有足够积分（5积分/次）
2. **参数验证**: 检查输入参数格式是否正确
3. **调用Replicate**: 调用Flux-Kontext模型
4. **处理输出**: 提取生成的图片URL
5. **返回结果**: 将图片信息返回给前端

### 图片URL处理

系统会自动处理Replicate的输出格式：

```typescript
// 支持多种输出格式
if (typeof output.url === 'function') {
  imageUrl = output.url();  // 函数形式
} else if (output.url) {
  imageUrl = output.url;    // 直接字符串
} else if (Array.isArray(output)) {
  imageUrl = extractImageUrl(output[0]);  // 数组形式
}
```

### 错误处理

- **API调用失败**: 自动退还积分
- **图片URL无效**: 使用备用图片
- **参数错误**: 返回友好的错误信息

## 测试功能

### 1. 基础集成测试

```bash
pnpm test:replicate
```

### 2. 图片生成测试

```bash
pnpm test:image-gen
```

### 3. 前端功能测试

1. 启动开发服务器: `pnpm dev`
2. 访问AI工作站页面
3. 上传图片或输入提示词
4. 点击生成按钮

## 配置要求

### 环境变量

```bash
REPLICATE_API_TOKEN=r8_your_actual_token_here
```

### 依赖包

```bash
pnpm add replicate
```

## 常见问题

### Q: 生成的图片在哪里？
A: 图片会显示在AI工作站的右侧结果区域，可以下载保存。

### Q: 支持哪些图片格式？
A: 支持常见的图片格式：JPG、PNG等。

### Q: 生成需要多长时间？
A: 通常需要几秒到几分钟，取决于图片复杂度和服务器负载。

### Q: 可以批量生成多张图片吗？
A: 目前每次生成1张图片，消耗5积分。

## 高级功能

### 自定义参数

- **模型选择**: Pro/Standard
- **宽高比**: 1:1, 16:9, 4:3等
- **水印**: 开启/关闭
- **图片数量**: 1张（可扩展）

### 扩展可能性

- 支持更多AI模型
- 批量生成功能
- 图片风格预设
- 历史记录保存

## 技术支持

如果遇到问题：

1. 查看控制台日志
2. 运行测试脚本
3. 检查环境变量配置
4. 参考故障排除文档

## 更新日志

- **v1.0**: 基础图片生成功能
- **v1.1**: 添加图片编辑功能
- **v1.2**: 优化错误处理和积分退还
- **v1.3**: 添加工具函数和测试脚本
