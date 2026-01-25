# ContentFreshnessBadge 组件使用指南

## 概述

`ContentFreshnessBadge` 是一个全项目通用的内容新鲜度徽章组件，用于显示内容的最后更新时间，符合 AI SEO 优化最佳实践。

## 特性

- ✅ 统一的样式和实现（基于 `print-test-page` 标准）
- ✅ 支持 i18n 国际化
- ✅ 自动计算内容新鲜度（90 天阈值）
- ✅ 符合 AI SEO 最佳实践
- ✅ TypeScript 类型安全

## 安装/导入

```tsx
import { ContentFreshnessBadge } from "@/components/ContentFreshnessBadge"
```

## 基本使用

```tsx
import { ContentFreshnessBadge } from "@/components/ContentFreshnessBadge"

export default function MyToolPage() {
  return (
    <div>
      <ContentFreshnessBadge 
        lastModified={new Date("2026-01-24")} 
        namespace="YourToolNamespace"
      />
      {/* 其他内容 */}
    </div>
  )
}
```

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `lastModified` | `Date` | ✅ | 内容最后修改日期 |
| `namespace` | `string` | ✅ | i18n 翻译命名空间（如 "PrintTestPage", "SoundCloudToWAV"） |
| `className` | `string` | ❌ | 额外的 CSS 类名 |

## i18n 配置

组件需要以下翻译键（在对应的 namespace 中）：

```json
{
  "content_freshness_updated": "Updated",
  "content_freshness_last_updated": "Last updated"
}
```

## 迁移指南

### 从本地组件迁移

**之前（本地实现）：**
```tsx
// 在 page.tsx 或 SEOContent.tsx 中
function ContentFreshnessBadge({ lastModified }: { lastModified: Date }) {
  const t = useTranslations("ToolName")
  // ... 本地实现
}
```

**之后（使用统一组件）：**
```tsx
import { ContentFreshnessBadge } from "@/components/ContentFreshnessBadge"

<ContentFreshnessBadge 
  lastModified={new Date("2026-01-24")} 
  namespace="ToolName"
/>
```

## 样式说明

组件使用以下样式（匹配 `print-test-page` 标准）：

- **新鲜内容**（< 90 天）：`text-emerald-300`（绿色）
- **需要更新**（≥ 90 天）：`text-orange-300`（橙色）
- 图标：✓（新鲜）或 ⚠（需要更新）
- 间距：`gap-3`
- 字体：`text-sm font-semibold`

## 辅助函数

组件还导出了以下辅助函数：

### `shouldUpdateContent(lastModified: Date): boolean`

检查内容是否需要更新（超过 90 天）。

```tsx
import { shouldUpdateContent } from "@/components/ContentFreshnessBadge"

const needsUpdate = shouldUpdateContent(new Date("2025-01-01"))
```

### `calculateNextReviewDate(lastModified: Date, frequency: string): Date`

计算下次审查日期。

```tsx
import { calculateNextReviewDate } from "@/components/ContentFreshnessBadge"

const nextReview = calculateNextReviewDate(
  new Date("2026-01-24"),
  "monthly"
)
```

## 示例

### 示例 1: 基本使用

```tsx
import { ContentFreshnessBadge } from "@/components/ContentFreshnessBadge"

export default function PrintTestPage() {
  return (
    <div>
      <ContentFreshnessBadge 
        lastModified={new Date("2026-01-24")} 
        namespace="PrintTestPage"
      />
    </div>
  )
}
```

### 示例 2: 带自定义样式

```tsx
<ContentFreshnessBadge 
  lastModified={new Date("2026-01-24")} 
  namespace="PrintTestPage"
  className="mb-4"
/>
```

### 示例 3: 在 layout.tsx 中使用

```tsx
// app/[locale]/tools/[slug]/layout.tsx
import { ContentFreshnessBadge } from "@/components/ContentFreshnessBadge"

export default function Layout({ children, params }) {
  const lastModified = new Date("2026-01-24")
  
  return (
    <div>
      <ContentFreshnessBadge 
        lastModified={lastModified} 
        namespace="ToolNamespace"
      />
      {children}
    </div>
  )
}
```

## 已迁移的工具页面

以下工具页面已使用统一组件（可作为参考）：

- ✅ `print-test-page` - 标准实现
- ✅ `soundcloud-to-wav` - 使用统一组件
- ✅ `soundcloud-playlist-downloader` - 使用统一组件

## 待迁移的工具页面

以下工具页面仍使用本地实现，建议迁移：

- ⚠️ `pund-til-nok-kalkulator` - 使用本地实现
- ⚠️ 其他工具页面 - 检查并迁移

## SEO 最佳实践

根据 AI-SEO-Complete-Guide.md：

1. **内容新鲜度是最强的 AI 排名信号**
   - 30-90 天内更新的内容表现最佳
   - 旧内容会被降级

2. **在 metadata 中标记更新日期**
   ```typescript
   export async function generateMetadata({ params }: Props): Promise<Metadata> {
     const lastModified = new Date("2026-01-24")
     
     return {
       other: {
         "last-modified": lastModified.toISOString(),
         "update-frequency": "monthly",
       },
     }
   }
   ```

3. **定期更新内容**
   - 建议每月更新一次
   - 超过 90 天的内容应优先更新

## 相关资源

- [AI-SEO-Complete-Guide.md](../AI-SEO-Complete-Guide.md)
- [AI-SEO-OPTIMIZATION-REPORT.md](../AI-SEO-OPTIMIZATION-REPORT.md)
- [.cursor/rules/ai-search-seo.mdc](../.cursor/rules/ai-search-seo.mdc)
