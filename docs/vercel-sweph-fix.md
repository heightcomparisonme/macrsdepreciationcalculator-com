# Vercel 部署修复说明

## 问题描述
在 Vercel 部署过程中出现 `sweph` 原生模块错误：
```
Error: Cannot find module './build/Release/sweph.node'
```

## 解决方案

### 1. 创建备用天文计算服务
- **文件**: `src/services/ephemeris/fallback.ts`
- **功能**: 提供不依赖原生模块的基础天文计算
- **精度**: 近似计算，适合大多数应用场景

### 2. 智能服务选择器
- **文件**: `src/services/ephemeris/index.ts`
- **功能**: 自动检测环境并选择合适的天文计算服务
- **逻辑**: 
  - 开发环境：优先使用 Swiss Ephemeris（高精度）
  - 生产环境/Vercel：自动切换到备用服务（近似计算）

### 3. 更新 API 路由
更新了以下 API 路由以使用新的服务选择器：
- `src/app/api/moon/calendar/route.ts`
- `src/app/api/moon/today/route.ts`
- `src/lib/lunar-accurate.ts`

### 4. Next.js 配置优化
- **文件**: `next.config.mjs`
- **修改**: 添加 webpack 配置排除 `sweph` 模块
- **目的**: 防止原生模块在 Vercel 构建时出错

## 技术细节

### 服务选择逻辑
```typescript
// 检测环境
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

if (!isProduction && !isVercel) {
  // 使用 Swiss Ephemeris（高精度）
} else {
  // 使用备用服务（近似计算）
}
```

### 备用计算精度
- **月相计算**: 基于简化的天文公式
- **太阳位置**: 使用基本的黄道坐标计算
- **月亮位置**: 包含主要摄动项的简化计算
- **精度**: 对于一般应用足够准确

## 部署验证

### 1. 本地测试
```bash
# 运行测试脚本
node scripts/test-ephemeris-fallback.js
```

### 2. Vercel 部署
1. 推送代码到 GitHub
2. Vercel 自动构建和部署
3. 检查构建日志确认无 `sweph` 错误
4. 测试 API 端点功能

### 3. API 测试端点
- `GET /api/moon/today` - 今日月相
- `GET /api/moon/calendar` - 月相日历
- `GET /api/moon/day-info` - 详细日信息
- `GET /api/moon/month` - 月度数据

## 注意事项

1. **精度权衡**: 备用服务精度略低于 Swiss Ephemeris，但对大多数应用足够
2. **环境检测**: 服务选择器会自动检测运行环境
3. **向后兼容**: 现有 API 接口保持不变
4. **性能**: 备用服务计算速度更快，无原生模块依赖

## 故障排除

如果仍然遇到问题：

1. **检查环境变量**: 确认 `NODE_ENV` 和 `VERCEL` 设置正确
2. **清理缓存**: 删除 `.next` 目录重新构建
3. **检查日志**: 查看服务选择器的日志输出
4. **手动测试**: 使用测试脚本验证服务可用性

## 未来改进

1. **精度提升**: 可以进一步优化备用计算算法
2. **缓存优化**: 添加计算结果缓存提高性能
3. **配置选项**: 允许用户选择计算精度级别
4. **监控**: 添加服务使用情况监控
