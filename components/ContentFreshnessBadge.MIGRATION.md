# ContentFreshnessBadge 迁移指南

## 概述

本文档帮助将项目中所有本地实现的 `ContentFreshnessBadge` 组件迁移到统一的 `@/components/ContentFreshnessBadge` 组件。

## 迁移步骤

### 1. 识别需要迁移的文件

使用以下命令查找所有包含 `ContentFreshnessBadge` 或 `lastModified` 的文件：

```bash
# 查找所有本地 ContentFreshnessBadge 实现
grep -r "function ContentFreshnessBadge\|export function ContentFreshnessBadge" app/[locale]/tools

# 查找所有使用 lastModified 的文件
grep -r "lastModified" app/[locale]/tools --include="*.tsx" --include="*.ts"
```

### 2. 迁移模式

#### 模式 A: 本地组件定义在 page.tsx 中

**之前:**
```tsx
// app/[locale]/tools/tool-name/page.tsx
"use client"
import { formatDistanceToNow } from "date-fns"
import { useTranslations } from "next-intl"

function ContentFreshnessBadge({ lastModified }: { lastModified: Date }) {
  const t = useTranslations("ToolName")
  // ... 实现
}

export default function ToolPage() {
  const lastModified = new Date("2026-01-24")
  return (
    <div>
      <ContentFreshnessBadge lastModified={lastModified} />
    </div>
  )
}
```

**之后:**
```tsx
// app/[locale]/tools/tool-name/page.tsx
"use client"
import { ContentFreshnessBadge } from "@/components/ContentFreshnessBadge"

export default function ToolPage() {
  const lastModified = new Date("2026-01-24")
  return (
    <div>
      <ContentFreshnessBadge 
        lastModified={lastModified} 
        namespace="ToolName"
      />
    </div>
  )
}
```

#### 模式 B: 本地组件定义在 SEOContent.tsx 中

**之前:**
```tsx
// app/[locale]/tools/tool-name/components/SEOContent.tsx
"use client"
import { formatDistanceToNow } from "date-fns"
import { useTranslations } from "next-intl"

export function ContentFreshnessBadge({ lastModified }: { lastModified: Date }) {
  const t = useTranslations("ToolName")
  // ... 实现
}

// app/[locale]/tools/tool-name/page.tsx
import { ContentFreshnessBadge } from "./components/SEOContent"
```

**之后:**
```tsx
// app/[locale]/tools/tool-name/components/SEOContent.tsx
// 删除 ContentFreshnessBadge 定义，或重新导出统一组件
export { ContentFreshnessBadge } from "@/components/ContentFreshnessBadge"

// app/[locale]/tools/tool-name/page.tsx
import { ContentFreshnessBadge } from "@/components/ContentFreshnessBadge"
// 或
import { ContentFreshnessBadge } from "./components/SEOContent"

<ContentFreshnessBadge 
  lastModified={new Date("2026-01-24")} 
  namespace="ToolName"
/>
```

## 需要迁移的文件列表

基于代码搜索，以下文件需要迁移：

### ✅ 已完成迁移
- `app/[locale]/tools/print-test-page/page.tsx` - 已迁移 ✅
- `app/[locale]/tools/print-test-page/components/SEOContent.tsx` - 已更新 ✅

### ✅ 已完成迁移
- `app/[locale]/tools/pund-til-nok-kalkulator/page.tsx` - 已迁移 ✅
- `app/[locale]/tools/soundcloud-to-wav/SEOContent.tsx` - 已迁移 ✅
- `app/[locale]/tools/soundcloud-to-wav/page.tsx` - 已更新 ✅
- `app/[locale]/tools/soundcloud-playlist-downloader/SEOContent.tsx` - 已迁移 ✅
- `app/[locale]/tools/soundcloud-playlist-downloader/page.tsx` - 已更新 ✅

### ⚠️ 待迁移

无 - 所有已知的本地实现已完成迁移 ✅

## 迁移检查清单

对每个文件，执行以下步骤：

- [x] 1. 删除本地 `ContentFreshnessBadge` 函数定义 ✅
- [x] 2. 添加统一组件导入：`import { ContentFreshnessBadge } from "@/components/ContentFreshnessBadge"` ✅
- [x] 3. 更新组件使用，添加 `namespace` 参数 ✅
- [ ] 4. 确保翻译文件中包含 `content_freshness_updated` 和 `content_freshness_last_updated` 键（需要验证）
- [ ] 5. 测试组件显示正常（需要手动测试）
- [x] 6. 验证样式一致（emerald-300/orange-300, gap-3）✅

## 翻译键要求

确保每个工具的翻译文件（`messages/*.json`）中包含：

```json
{
  "content_freshness_updated": "Updated",
  "content_freshness_last_updated": "Last updated"
}
```

## 样式验证

迁移后，组件应显示为：
- ✅ 绿色文字（`text-emerald-300`）当内容 < 90 天
- ✅ 橙色文字（`text-orange-300`）当内容 ≥ 90 天
- ✅ 图标：✓ 或 ⚠
- ✅ 间距：`gap-3`
- ✅ 字体：`text-sm font-semibold`

## 常见问题

### Q: 如果工具没有翻译命名空间怎么办？
A: 需要先创建翻译命名空间，或使用默认的英文文本（需要修改组件支持可选 namespace）。

### Q: 样式不一致怎么办？
A: 统一组件使用 `print-test-page` 的标准样式。如果其他工具有不同的样式需求，可以通过 `className` 参数覆盖。

### Q: 如何验证迁移成功？
A: 
1. 检查组件是否正确显示
2. 检查浏览器控制台是否有错误
3. 验证样式是否一致
4. 检查翻译是否正确加载

## 完成后的验证

迁移完成后，运行以下检查：

```bash
# 确保没有本地 ContentFreshnessBadge 定义（.tsx 文件）
grep -r "function ContentFreshnessBadge" app/[locale]/tools --include="*.tsx"
# ✅ 结果：无实际代码文件中的本地定义（只有 .md 文档中的示例）

# 应该只找到统一组件的导入
grep -r "from.*ContentFreshnessBadge" app/[locale]/tools --include="*.tsx"
# ✅ 结果：所有文件都正确导入统一组件
```

### ✅ 迁移完成总结

**已迁移的文件：**
1. ✅ `app/[locale]/tools/print-test-page/page.tsx`
2. ✅ `app/[locale]/tools/print-test-page/components/SEOContent.tsx`
3. ✅ `app/[locale]/tools/pund-til-nok-kalkulator/page.tsx`
4. ✅ `app/[locale]/tools/soundcloud-to-wav/SEOContent.tsx`
5. ✅ `app/[locale]/tools/soundcloud-to-wav/page.tsx`
6. ✅ `app/[locale]/tools/soundcloud-playlist-downloader/SEOContent.tsx`
7. ✅ `app/[locale]/tools/soundcloud-playlist-downloader/page.tsx`

**所有组件使用处都已添加 `namespace` 参数：**
- ✅ `PrintTestPage` - namespace="PrintTestPage"
- ✅ `GbpNokConverter` - namespace="GbpNokConverter"
- ✅ `SoundCloudToWAV` - namespace="SoundCloudToWAV"
- ✅ `SoundCloudPlaylistDownloader` - namespace="SoundCloudPlaylistDownloader"

**代码质量检查：**
- ✅ 无 linter 错误
- ✅ 所有导入路径正确
- ✅ 所有使用处都包含必需的 `namespace` 参数

## 相关文档

- [ContentFreshnessBadge.README.md](./ContentFreshnessBadge.README.md) - 组件使用文档
- [AI-SEO-Complete-Guide.md](../AI-SEO-Complete-Guide.md) - SEO 最佳实践
- [AI-SEO-OPTIMIZATION-REPORT.md](../AI-SEO-OPTIMIZATION-REPORT.md) - 优化报告
