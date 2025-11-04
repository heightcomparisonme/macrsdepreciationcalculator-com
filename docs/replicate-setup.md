## 故障排除

### 常见错误

1. **401 Unauthorized**
   - 检查 `REPLICATE_API_TOKEN` 是否正确设置
   - 确认token是否有效

2. **404 Not Found**
   - 检查模型ID是否正确
   - 确认模型是否可用

3. **422 Unprocessable Entity**
   - **最常见错误**: `input.input_image: Does not match format 'uri'`
   - **原因**: 图像URL格式不正确
   - **解决方案**: 
     - 确保图像URL是完整的HTTP/HTTPS链接
     - 图像URL必须是公开可访问的
     - 避免使用相对路径或本地文件路径

4. **积分扣除失败**
   - 检查数据库连接
   - 确认用户积分是否充足

### 图像URL格式要求

Replicate API对图像URL有严格的要求：

✅ **有效的URL格式**:
```
https://example.com/image.jpg
http://example.com/image.png
https://replicate.delivery/abc123/image.jpg
```

❌ **无效的URL格式**:
```
image.jpg                    // 相对路径
file:///path/to/image.jpg   // 本地文件
data:image/jpeg;base64,...  // Base64编码
blob:http://...            // Blob URL
```

### 调试步骤

1. 运行测试脚本：`pnpm test:replicate`
2. 检查环境变量是否正确设置
3. 查看API响应日志
4. 确认网络连接正常
5. **特别检查**: 图像URL是否可公开访问
