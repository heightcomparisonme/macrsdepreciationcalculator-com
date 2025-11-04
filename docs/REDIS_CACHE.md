# Redis 缓存集成指南

本项目已集成 Upstash Redis 作为缓存层，用于优化 API 调用性能，减少对外部 API 的请求次数。

## 功能概述

缓存系统采用"先查缓存，再查 API"的策略，支持以下数据类型：

### 1. 天气数据缓存

#### 当前天气 (`/api/weather/current`)
- **缓存键格式**: `wetter_data:{日期}_{小时}_{纬度}_{经度}`
- **缓存时间 (TTL)**: 30 分钟 (1800 秒)
- **示例**: `wetter_data:2025-10-18_10_52.52_13.41`
- **说明**: 天气数据按小时级缓存，同一小时内的多次请求将返回缓存数据

#### 天气预报 (`/api/weather/forecast`)
- **缓存键格式**: `forecast_wetter_data:{日期}_{小时}_{纬度}_{经度}`
- **缓存时间 (TTL)**: 1 小时 (3600 秒)
- **示例**: `forecast_wetter_data:2025-10-18_10_52.52_13.41`
- **说明**: 预报数据变化较慢，缓存时间更长

### 2. 月相数据缓存

#### 日月数据 (`/api/moon/day-info`)
- **缓存键格式**: `moon_data:{日期}_{纬度}_{经度}`
- **缓存时间 (TTL)**: 24 小时 (86400 秒)
- **示例**: `moon_data:2025-10-18_52.52_13.41`
- **说明**: 月相数据按日期缓存，特定日期的数据不会改变

## 配置步骤

### 1. 注册 Upstash 账户

1. 访问 [Upstash Console](https://console.upstash.com/)
2. 注册免费账户（每天 10,000 次命令）
3. 创建新的 Redis 数据库

### 2. 获取连接信息

在 Upstash 控制台中，找到以下信息：
- **UPSTASH_REDIS_REST_URL**: Redis REST API 地址
- **UPSTASH_REDIS_REST_TOKEN**: REST API 令牌

### 3. 配置环境变量

在 `.env.local` 文件中添加：

```bash
# Upstash Redis Configuration
UPSTASH_REDIS_REST_URL="https://your-redis-instance.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token-here"
```

### 4. 验证配置

启动开发服务器后，检查控制台日志：

```bash
pnpm dev
```

**配置成功的日志**:
```
Cache MISS for key: wetter_data:2025-10-18_10_52.52_13.41
Cached data for key: wetter_data:2025-10-18_10_52.52_13.41 (TTL: 1800s)
Cache HIT for key: wetter_data:2025-10-18_10_52.52_13.41
```

**未配置 Redis 的日志**:
```
Redis not configured, fetching directly for key: wetter_data:2025-10-18_10_52.52_13.41
```

## 缓存行为

### 缓存命中流程

```
用户请求 → API 路由 → 检查缓存
                        ↓
                    缓存存在？
                    ↙      ↘
                 是         否
                 ↓          ↓
            返回缓存    调用外部 API
                            ↓
                        存入缓存
                            ↓
                        返回数据
```

### 自动降级

如果 Redis 未配置或连接失败，系统会自动降级为直接调用 API，不会影响功能。

## 缓存策略

### 天气数据 (30 分钟)

**场景**: 用户在 10:30 查询柏林天气
- **首次请求**: 调用 OpenWeather API，缓存到 11:00
- **10:45 再次请求**: 返回缓存数据（节省 API 调用）
- **11:01 请求**: 缓存过期，重新调用 API

**优势**:
- 减少 OpenWeather API 调用次数（免费版每天 1,000 次）
- 提高响应速度（从 ~500ms 降至 ~50ms）
- 降低成本（付费计划按调用次数计费）

### 月相数据 (24 小时)

**场景**: 多个用户查询同一日期的月相
- 特定日期的月相数据不会改变
- 缓存 24 小时后自动过期
- 大幅减少计算密集型的天文计算

## 技术实现

### 核心文件

1. **`src/lib/redis.ts`**: Redis 客户端配置
   - 单例模式
   - 自动检测配置
   - 错误处理

2. **`src/lib/cache.ts`**: 缓存助手函数
   - `generateWeatherCacheKey()`: 生成天气缓存键
   - `generateMoonCacheKey()`: 生成月相缓存键
   - `getCachedData()`: 通用缓存获取函数
   - `invalidateCache()`: 缓存失效

3. **API 路由更新**:
   - `src/app/api/weather/current/route.ts`
   - `src/app/api/weather/forecast/route.ts`
   - `src/app/api/moon/day-info/route.ts`

### 代码示例

```typescript
// 使用缓存的 API 调用
const cacheKey = generateWeatherCacheKey(now, latitude, longitude);

const weatherData = await getCachedData(
  cacheKey,
  () => getCurrentWeatherByCoords(latitude, longitude, "metric"),
  1800 // TTL: 30 分钟
);
```

## 监控与调试

### 查看缓存日志

开发模式下，所有缓存操作都会记录日志：

```typescript
// 缓存未命中
console.log(`Cache MISS for key: ${key}`);

// 缓存命中
console.log(`Cache HIT for key: ${key}`);

// 数据已缓存
console.log(`Cached data for key: ${key} (TTL: ${ttlSeconds}s)`);
```

### Upstash 控制台

在 Upstash 控制台可以：
- 查看实时命令统计
- 监控内存使用
- 查看缓存键列表
- 手动删除缓存

## 性能指标

### 预期改进

| 指标 | 无缓存 | 有缓存 | 改进 |
|------|--------|--------|------|
| 响应时间 | ~500ms | ~50ms | **90%** |
| API 调用次数 | 每次请求 | 30分钟1次 | **~95%** |
| 服务器负载 | 高 | 低 | **显著降低** |

### 缓存命中率目标

- 天气数据: **80-90%** (同一地区频繁查询)
- 月相数据: **95%+** (数据不变，多用户共享)

## 故障排除

### 问题: 缓存未生效

**检查步骤**:
1. 确认环境变量已设置
2. 检查控制台是否有 "Redis not configured" 日志
3. 验证 Upstash REST URL 和 Token 正确

### 问题: 缓存数据过期

**原因**: 这是正常行为，TTL 到期后会自动刷新

### 问题: 内存使用过高

**解决方案**:
- Upstash 免费版: 256 MB 内存
- 升级到付费计划
- 调整 TTL 时间（减少缓存时长）

## 最佳实践

1. **开发环境**: 可选配置 Redis（方便调试）
2. **生产环境**: 必须配置 Redis（性能优化）
3. **监控**: 定期检查 Upstash 使用量
4. **测试**: 验证缓存失效和刷新逻辑

## 未来扩展

可以进一步缓存的 API：
- `/api/moon/today` - 今日月相
- `/api/moon/calendar` - 月历数据
- `/api/moon/month` - 月份数据

## 总结

Redis 缓存的集成大幅提升了 API 性能，减少了外部服务调用，降低了成本。系统设计具有良好的降级能力，即使 Redis 不可用也不会影响功能。
