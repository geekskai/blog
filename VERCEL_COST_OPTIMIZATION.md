# Vercel 成本优化方案

## 📊 当前费用分析

根据 Vercel Usage 面板显示的费用分布：

1. **Fast Origin Transfer**: $6.41 (69.6%) - 最大费用项
2. **Edge Middleware Invocations**: $0.65 (7.1%)
3. **Function Invocations**: $0.60 (6.5%)
4. **Function Duration**: $0.54 (5.9%)
5. **Fluid Active CPU**: $0.52 (5.6%)
6. **其他费用**: $0.49 (5.3%)

**总费用**: $9.21 / $20 (21 天剩余)

## ✅ 已实施的优化措施

### 1. 图片优化配置 ⭐ 最大影响

**问题**: `images.unoptimized` 设置为 true，导致所有图片未优化传输

**解决方案**:
- 移除了 `unoptimized` 配置（仅在静态导出时启用）
- 启用 Next.js 图片优化（AVIF/WebP 格式）
- 配置了图片尺寸和设备尺寸优化
- 设置了 60 秒最小缓存时间

**预期节省**: 可减少 40-60% 的图片传输费用

```javascript
images: {
  unoptimized: output === "export" ? true : false,
  formats: ["image/avif", "image/webp"],
  minimumCacheTTL: 60,
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

### 2. 静态资源缓存头

**解决方案**: 在 `next.config.js` 中添加了静态资源缓存头

- `/static/*`: 1 年缓存（immutable）
- `/fonts/*`: 1 年缓存（immutable）
- `/_next/image`: 1 年缓存（immutable）
- `/_next/static/*`: 1 年缓存（immutable）

**预期节省**: 减少重复的静态资源传输

### 3. API 路由缓存优化

为以下 API 路由添加了适当的缓存头：

| API 路由 | 缓存策略 | 说明 |
|---------|---------|------|
| `/api/soundcloud-playlist-downloader` | 1 小时 | 播放列表信息相对稳定 |
| `/api/soundcloud-info` | 30 分钟 | 音轨信息相对稳定 |
| `/api/exchange-rate` | 1-24 小时 | 已有缓存机制，优化了缓存头 |
| `/api/weather` | 10 分钟 | 天气数据变化较慢 |
| `/api/perm-data` | 1 小时 | PERM 数据更新频率低 |
| `/api/vin-decode` | 24 小时 | VIN 解码结果不变 |

**预期节省**: 减少 30-50% 的重复 API 请求传输

### 4. Edge Middleware 优化

**问题**: 中间件匹配器过于宽泛，导致不必要的调用

**解决方案**: 优化了匹配器，排除更多静态资源路径

```typescript
matcher: [
  "/((?!api|blog|privacy|tags|_next/static|_next/image|_vercel|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
]
```

**预期节省**: 减少 20-30% 的 Edge Middleware 调用

## 📈 预期成本节省

基于以上优化措施，预期可以节省：

- **Fast Origin Transfer**: 减少 50-70% ($3.20 - $4.50)
- **Edge Middleware**: 减少 20-30% ($0.13 - $0.20)
- **Function Invocations**: 通过缓存减少 30-40% ($0.18 - $0.24)

**总预期节省**: $3.51 - $4.94 (约 38-54%)

**优化后预期费用**: $4.27 - $5.70 / 周期

## 🎯 进一步优化建议

### 短期优化（1-2 周内）

1. **监控优化效果**
   - 部署后观察 Vercel Usage 面板
   - 对比优化前后的费用变化
   - 识别是否有异常流量

2. **SoundCloud 下载优化**
   - 考虑使用 CDN 或直接链接（如果可能）
   - 添加下载限流机制
   - 优化流式传输的缓冲区大小

3. **ISR (Incremental Static Regeneration) 优化**
   - 检查 ISR 的使用情况
   - 优化重新验证时间
   - 减少不必要的 ISR writes

### 中期优化（1 个月内）

1. **图片 CDN**
   - 考虑使用外部图片 CDN（如 Cloudinary、ImageKit）
   - 进一步减少 Fast Origin Transfer

2. **API 响应压缩**
   - 确保所有 API 响应都启用了 gzip/brotli 压缩
   - 优化 JSON 响应大小

3. **函数执行时间优化**
   - 分析 Function Duration 费用
   - 优化慢查询和外部 API 调用
   - 添加请求超时和重试机制

### 长期优化（3 个月+）

1. **架构优化**
   - 考虑将大文件下载移到专门的存储服务（如 S3 + CloudFront）
   - 使用 Edge Functions 替代部分 Serverless Functions
   - 实施更细粒度的缓存策略

2. **监控和告警**
   - 设置费用告警阈值
   - 实施成本监控仪表板
   - 定期审查和优化

## 📝 注意事项

1. **图片优化**: 确保所有图片都使用 Next.js Image 组件
2. **缓存策略**: 根据数据更新频率调整缓存时间
3. **监控**: 定期检查 Vercel Usage 面板，及时发现问题
4. **测试**: 部署前在 staging 环境测试优化效果

## 🔍 监控指标

部署后需要关注的关键指标：

- Fast Origin Transfer 的日/周趋势
- Edge Middleware Invocations 数量
- Function Invocations 和 Duration
- 缓存命中率（通过 API 响应头 `X-Cache-Status`）

---

**最后更新**: 2026-01-28
**优化版本**: v1.0
