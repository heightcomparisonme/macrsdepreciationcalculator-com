# 快速修复: Replicate API 422 错误

## 问题描述

您遇到了以下错误：
```
input.input_image: Does not match format 'uri'
```

这是一个常见的Replicate API输入验证错误。

## 立即解决方案

### 1. 检查图像URL格式

确保您的图像URL是完整的HTTP/HTTPS链接：

✅ **正确格式**:
```
https://example.com/image.jpg
http://example.com/image.png
https://replicate.delivery/abc123/image.jpg
```

❌ **错误格式**:
```
image.jpg
file:///path/to/image.jpg
data:image/jpeg;base64,...
blob:http://...
```

### 2. 测试图像URL可访问性

在浏览器中直接访问图像URL，确保：
- 图像可以正常显示
- 不需要认证
- 不是私有链接

### 3. 使用测试图像

如果您的图像URL有问题，可以使用这个测试图像：
```
https://replicate.delivery/xezq/XfwWjHJ7HfrmXE6ukuLVEpXWfeQ3PQeRI5mApuLXRxST7XMmC/tmpc91tlq20.png
```

## 代码修复

API已经添加了URL验证，但您也可以手动检查：

```typescript
// 验证URL格式
function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

// 使用示例
if (images.length > 0 && isValidImageUrl(images[0].src)) {
  input.input_image = images[0].src;
} else {
  console.warn("Invalid image URL:", images[0]?.src);
}
```

## 常见问题

### Q: 为什么我的本地图片不能使用？
A: Replicate API需要公开可访问的URL，本地文件无法访问。

### Q: 如何上传图片到可访问的URL？
A: 可以使用以下服务：
- Imgur
- Cloudinary
- AWS S3
- 任何图片托管服务

### Q: 没有图片可以生成吗？
A: 可以！Flux-Kontext模型支持纯文本提示词生成图像。

## 测试步骤

1. 运行测试脚本：
```bash
pnpm test:replicate
```

2. 检查环境变量：
```bash
echo $REPLICATE_API_TOKEN
```

3. 验证图像URL：
```bash
curl -I "your_image_url_here"
```

## 如果问题仍然存在

1. 检查Replicate API状态：https://status.replicate.com
2. 查看完整错误日志
3. 尝试使用不同的图像URL
4. 联系技术支持

## 预防措施

- 始终使用完整的HTTP/HTTPS URL
- 确保图像URL公开可访问
- 测试图像URL在浏览器中的可访问性
- 使用可靠的图片托管服务
