# Geekskai SEO 修复任务单

请直接按本任务单修复、验证并汇报结果。先核对当前代码；已修复的问题只验证，不重复改动。按 P1 → P2 → P3 执行，单项受阻不阻塞其他独立任务。

## 执行约束

- 项目：`/Users/channelwill/Downloads/geekskai`。遵循项目 AGENTS.md，保留已有改动，只修改与任务直接相关的文件；不提交 Git、不部署。
- URL 规则：英语无 `/en`，其他语言带前缀，HTML 页面保留尾斜杠。复用 [现有 URL helpers](/Users/channelwill/Downloads/geekskai/app/i18n/urls.ts)，不调整全站 `localePrefix`。
- 保留语言政策：PDF/Morse 仅英语；SoundCloud 为 `en/fr/es/de`；VIN 对比页的 9 个非英语版本继续 noindex。不得批量删除页面或改变其他索引政策。
- 本文数量来自 2026-10-09 快照，执行时重新核对，不能将历史数量写死在业务逻辑中。
- **SEO-10 仅保留建议，本次执行跳过其索引策略变更。SEO-11 先复现定位，再修复，不猜测根因。**

需要完整影响清单时，按问题编号读取 [证据 JSON](/Users/channelwill/Downloads/geekskai/reports/seo/2026-10-09-seo-evidence.json) 的 `findings[].affected_urls`；逐 URL 基线见 [审查 CSV](/Users/channelwill/Downloads/geekskai/reports/seo/2026-10-09-tools-url-matrix.csv)。这两个文件是历史证据，不覆盖写入。

## P1：优先修复

### SEO-01｜修正 7 篇博客的 canonical

**修改：** 将以下文章对应 MDX 的 `canonicalUrl` 改为 `https://geekskai.com/blog/{文章路径}/`。MDX 位于项目 `data/blog` 下，路径同文章路径，扩展名为 `.mdx`。

```text
3-beginner-friendly-ways-to-extract-audio-files-from-videos
ai/deepseek-api-integration
ai/how-predictive-ai-tools-can-identify-invisible-risks-for-businesses
js/cms-system-next-js
js/how-to-check-if-character-is-double-quote-in-js
react/react-swr-vite-guide
css/how-to-change-css-of-primevue
```

保留 PrimeVue 旧路径 `/blog/primevue/how-to-change-css-of-primevue/` 到新路径的既有 308；不批量重写其他文章。metadata 入口：[博客页](/Users/channelwill/Downloads/geekskai/app/blog/[...slug]/page.tsx)。

**验收：** 7 篇文章 canonical 和 `og:url` 指向自身，目标首跳 200；PrimeVue 新地址不再指回旧地址。

### SEO-02｜移除 hreflang 中错误的英语 `/en` 前缀

**修改：** [Unicode 共享 metadata](/Users/channelwill/Downloads/geekskai/app/[locale]/tools/upside-down-text-generator/lib/seo.ts) 和 [VIN 品牌 metadata](/Users/channelwill/Downloads/geekskai/app/[locale]/tools/vin-decoder/[brand]/page.tsx) 改用 `buildLanguageAlternates`。`en`、`x-default` 指向无 `/en` 的英语 canonical，其余语言指向各自最终地址。

**验收：** 19 路由、190 个页面的英语 hreflang 目标首跳 200；各语言互相引用；已存在的 HTML/HTTP/sitemap 声明目标一致。保留 `/en` 地址原有重定向行为。

### SEO-03｜清理指向重定向或 noindex 页的语言声明

**修改：**

1. 在 [proxy.ts](/Users/channelwill/Downloads/geekskai/proxy.ts) 中，仅为 PDF、Morse、6 个 SoundCloud 路由清除自动生成的 HTTP `Link`；语言关系保留在正确的 HTML/sitemap 中。依据 [现有语言策略](/Users/channelwill/Downloads/geekskai/app/sitemap-config.ts) 精确匹配路径，避免前缀误匹配。
2. 在 [VIN 对比 SEO 模块](/Users/channelwill/Downloads/geekskai/app/[locale]/tools/vin-decoder/vin-decoder-vs-vin-check/compare-seo.ts) 中，英语对比页只声明 `en`、`x-default`；非英语对比页移除 hreflang，保留 noindex。Proxy 同步清除该对比路由的自动 Link。
3. 不全局关闭 Tools 的 HTTP hreflang：PERM Tracker、Snow Day 当前依赖 HTTP/sitemap 提供语言关系。

**验收：** 26 个受限语言工具页面和 10 个 VIN 对比页面不再声明 308/noindex 语言目标；54 个既有语言回退仍为 308，9 个既有 noindex 不变。

### SEO-04｜修复博客分页 metadata 与页码校验

**修改：** 在 [分页路由](/Users/channelwill/Downloads/geekskai/app/blog/page/[page]/page.tsx) 中严格验证正整数页码，使用过滤后的公开文章计算页数；无效/越界页码调用 `notFound()`，页 1 以 308 跳到 `/blog/`。页 N≥2 设置自身 canonical、`og:url`、带页码的 title 和指向自身的 x-default，覆盖 [父 layout](/Users/channelwill/Downloads/geekskai/app/blog/layout.tsx) 的首页声明。

保留每页 9 篇；不修改 [共享列表组件](/Users/channelwill/Downloads/geekskai/layouts/ListLayoutWithTags.tsx) 的通用回退语义。

**验收：** 页 2、最后一页自引用且切片正确；页 1 为 308；`0/-1/abc/2abc/1.5/超出总页数` 返回真实 404；前后页链接有效。

### SEO-05｜修复多语言 Blog 导航死链

**修改：** [Header](/Users/channelwill/Downloads/geekskai/components/Header.tsx) 和 [MobileDock](/Users/channelwill/Downloads/geekskai/components/chrome/MobileDock.tsx) 中，仅 Blog 链接改用 `next/link` 并固定 `/blog/`。保留样式、当前项状态、标签翻译，以及其他导航的多语言行为；不使用 `locale="en"` 生成中间地址。

**验收：** 10 语言的桌面/移动 DOM 中 Blog 均直接指向 `/blog/`、访问 200；Tools 导航仍保留当前语言。原 567 个工具页面中的 `/{locale}/blog/` 死链消失。

## P2：补齐基础质量

### SEO-06｜修复 OG/Twitter 图片 404

**修改：** 根据证据 JSON 的 `broken_share_image_urls`，反查并仅替换 32 个失效图片引用。先统一使用 [现有品牌图片](/Users/channelwill/Downloads/geekskai/public/static/images/og/geekskai-home.png)，核对尺寸与类型；保留原本有效的图片。检查继承的 Twitter 图片，尤其是 SoundCloud hub，不只检查显式 OG 字段。

**验收：** 原 236 个受影响页面的最终 OG/Twitter URL 首跳 200、Content-Type 为 `image/*`；不返回 HTML 404。无需先设计新图片。

### SEO-07｜补充 sitemap 中遗漏的现有页面

**修改：** 在 [sitemap.ts](/Users/channelwill/Downloads/geekskai/app/sitemap.ts) 中加入 Pixels to Inches 的 10 语言、VIN 品牌 100 个、VIN 车型 40 个及英语 VIN 对比页 1 个地址。复用现有品牌/车型枚举与 URL helpers；避免导入客户端组件或执行页面渲染。Pixels 作为 sitemap 补充项，不调整工具目录展示。

**验收：** 当前快照新增 151 个去重 URL，Tools 合计 617；全部首跳 200、自引用、允许抓取且非 noindex。分享页、9 个非英语对比页及回退地址继续排除；若路由已变化，以重新枚举结果为准。

### SEO-08｜统一随机四位数字工具的 hreflang

**修改：** [该工具 layout](/Users/channelwill/Downloads/geekskai/app/[locale]/tools/random-4-digit-number-generator/layout.tsx) 的手工语言表改用 `buildLanguageAlternates`，路径为 `/tools/random-4-digit-number-generator/`。

**验收：** 10 个页面的 HTML 均包含 10 语言＋x-default，与 canonical、HTTP、sitemap 目标一致；语言代码大小写不单独判错。

### SEO-09｜补全三个明确遗漏的本地化样本

| 文件与命名空间 | 修改内容 |
| --- | --- |
| [ja.json](/Users/channelwill/Downloads/geekskai/messages/ja.json) → `CursedTextGenerator` | 将实际展示的英语标题、介绍、用途和限制补为日语 |
| [es.json](/Users/channelwill/Downloads/geekskai/messages/es.json) → `SoundCloudDownloader` | 补全西语 metadata/说明；按当前 MP3/M4A 源流能力描述，不承诺不存在的 WAV 源或转换能力 |
| [ar.json](/Users/channelwill/Downloads/geekskai/messages/ar.json) → `VinDecoder.vehicleTypePage.types.rv` | 补全阿拉伯语页面标题、H1 及仍未翻译的专属说明 |

**验收：** 浏览器中的 title、description、H1、说明与目标语言一致，功能含义不变。保留专有名词及现有索引策略，不将其他“与英语相同”的词条批量视为缺陷。

### SEO-10｜分享页索引政策：本次跳过

现状：10 个 Job Worth 分享路径继承父计算器 canonical/hreflang，且为 `index,follow`。是否应独立参与搜索尚未确认。

**仅在用户另行确认后执行：** 为 [share 入口](/Users/channelwill/Downloads/geekskai/app/[locale]/tools/job-worth-calculator/share/page.tsx) 增加服务端 layout，设为 `noindex,follow`，清除继承的 hreflang 和该路径的 HTTP Link；如保留 canonical，指向同语言无参数的 share 地址。继续排除 sitemap，允许抓取以读取 noindex。

**届时验收：** 10 语言及参数变体策略一致；父计算器仍 index、自引用；分享和下载功能正常。本轮将此项标记 BLOCKED，继续其他任务。

### SEO-11｜定位无效 VIN 参数的 500

**先诊断：** 复现 `/tools/vin-decoder/not-a-real-brand/` 和 `/tools/vin-decoder/vehicle-types/not-a-real-type/`，读取服务端异常。检查 [品牌页](/Users/channelwill/Downloads/geekskai/app/[locale]/tools/vin-decoder/[brand]/page.tsx)、[车型页](/Users/channelwill/Downloads/geekskai/app/[locale]/tools/vin-decoder/vehicle-types/[type]/page.tsx) 与 [本地化 NotFound](/Users/channelwill/Downloads/geekskai/app/[locale]/not-found.tsx)。源码已有 `notFound()`，不能直接假设缺少参数判断。

**修复/验收：** 修复真实抛错点，使两类参数 × 10 语言返回真实 404；140 个合法品牌/车型地址保持 200。不得吞掉异常返回 200。无法复现或取得必要日志时记录 BLOCKED 与缺失证据，不猜修复。

## P3：一致性与防回归

### SEO-12｜补齐 WebSite 语言映射

**修改：** [根 layout](/Users/channelwill/Downloads/geekskai/app/[locale]/layout.tsx) 的 `inLanguage` 映射补充 `ar/de/fr/es`，保留其余映射，不擅自添加地域、不改 URL 语言代码。

**验收：** 10 语言的 JSON-LD 字段与页面语言语义一致、可解析；Organization/WebSite 实体 ID 不变。

### SEO-13｜完善可重复审查脚本

**修改：** 扩展 [sitemap-quality.mjs](/Users/channelwill/Downloads/geekskai/scripts/sitemap-quality.mjs)，保留现有输出兼容性，增加路由清单入口、首跳/重定向链、HTML/HTTP/sitemap 三渠道、robots.txt 和 `PASS/FAIL/BLOCKED`。保留原始 URL，再建立比较键；按首级工具路由分类，避免把 `/blog/tools/...` 算作工具。为分享页、noindex、语言回退设置独立预期。

**验收：** 离线样本覆盖 HTML/HTTP 不一致、308 后 200、hreflang 到 noindex、合理参数归并、sitemap 外页面、路径分类和网络受限。403/超时不得直接判为 SEO 缺陷；正文同文率只生成复核线索。

## 完成标准与交付

1. 为实际改动补充针对性行为测试，优先扩展 [语言策略测试](/Users/channelwill/Downloads/geekskai/app/sitemap-config.test.ts) 与 [sitemap 测试](/Users/channelwill/Downloads/geekskai/app/sitemap.test.ts)。
2. 运行相关测试、`yarn typecheck`、`yarn build`，对修改文件运行不带 `--fix` 的 ESLint。`yarn lint` 自带修复，不用于只读验证；缺依赖或环境限制如实记录。
3. 在本地或已有预览环境核对最终 HTML、HTTP、sitemap 与 DOM；逐项复查本次影响地址及上述边界场景。未部署时只报告本地/预览结果，不声称线上已修复。
4. 检查最终 diff；若仍无 Git 元数据，用执行前后文件指纹核对改动范围。检查通过后停止扩大修改。
5. 输出修复记录：`编号｜PASS/FAIL/BLOCKED｜修改文件｜验证结果｜剩余问题`。列出未运行的检查与既有失败，不推断 Google 已收录或排名已改善。
