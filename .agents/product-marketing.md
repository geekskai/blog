# Geekskai Product Marketing Context

**Document version:** v1
**Last updated:** 2026-09-13

## 使用说明与证据标准

本文件是 Geekskai 后续营销、定位、文案和研究任务的共享上下文。它描述当前仓库、当前页面文案和已读取的一方搜索数据所能支持的产品事实，不是未来路线图。

- **已确认**：可由当前代码、页面文案、产品规则文档或注明口径的一方搜索数据直接支持。
- **UNKNOWN**：当前证据不足，无法确认。不得用行业常识、产品设计意图或搜索曝光替代客户证据。
- 搜索查询可以说明访问任务，但不能证明访问者职业、满意度、留存、购买原因或付费意愿。
- 仓库中的价格、配额和功能开关说明产品合同或实现能力；若没有生产运行时证据，不代表该能力当前已对公众开放。
- 不得引用未经核实的客户数、满意度、testimonial、收入、转化率、市场领先地位或生产付款状态。

## 十个核心定位问题

### 1. Geekskai 是什么产品？

**已确认：** Geekskai 是一个需求驱动的浏览器工具组合（demand-led browser tool portfolio），公共工具帮助访问者以较少设置完成具体任务；Geekskai Audio Toolkit 是其中的旗舰登录工作区，用于在设备本地规范化、转换和批量准备用户拥有或获授权使用的音频。

公共工具组合承担搜索获客和即时任务完成；Audio Toolkit 使用独立的 Audio Credits、批量权限和本地工作区。公共下载额度、Audio Credits 与付费能力是彼此独立的产品合同。

### 2. 当前主要用户是谁？

**已确认：** 当前可证实的主要用户是带着明确搜索查询进入单一工具页的任务型搜索访客。Bing Webmaster Tools 的三个月数据表明，当前 Bing 点击高度集中在 SoundCloud 下载和格式相关页面，并以桌面访问为主。

**已确认的产品目标群体：** 当前产品文档将注册创作者、DJ 和音乐库整理者列为 Audio Toolkit 的次级目标群体；他们需要重复处理自己拥有的音频，并重视浏览器本地批量工作流。

**UNKNOWN：** 实际访问者的职业、创作者类型、DJ 占比、公司类型、年龄、技能水平，以及 Audio Toolkit 目标群体在真实用户中的占比。

### 3. 用户为什么来到 Geekskai？

**已确认：** 搜索数据支持的主要到访原因是完成一个命名明确的即时任务，例如下载或检查 SoundCloud 音频、打开打印测试页、进行 VIN 查询或完成计算/生成任务。当前主要搜索查询包括 `soundcloud downloader`、`soundcloud to mp3`、`soundcloud to wav` 和 `soundcloud playlist downloader`。

**UNKNOWN：** 用户选择 Geekskai 而不是其他结果的真实原因；是否因为速度、隐私、无需安装、准确性、品牌信任或其他因素；直接访问、推荐访问和回访的具体动机。

### 4. 用户的 Core Jobs To Be Done 是什么？

**已确认的功能性 Jobs：**

1. 从一个明确链接或输入获得该工具承诺的可用下载、检查、转换、计算或生成结果。
2. 无需安装复杂软件，在浏览器内完成一次性任务，并能取得或使用结果。
3. 对于已登录的 Audio Toolkit 使用者，在设备本地将拥有或获授权使用的音频规范化并转换为目标 WAV 或 MP3；保存和复用处理设置；付费 Credit 余额可支持多文件批处理和 ZIP 导出。

**UNKNOWN：** 上述第三项在真实用户中的采用率和重要程度；用户的情绪性 Job、社交性 Job、触发事件、成功标准及替代方案。

### 5. 免费用户获得什么价值？

此处的“免费用户”优先指未登录的 **Visitor**。

**已确认：**

- 普通公共工具的核心结果无需注册。
- 当前目录数据包含 50 个唯一工具，覆盖 Communication、Creative、Development、Education、Entertainment、Finance、Productivity 和 Utility 八个类别。
- 仓库中的公共下载配额合同为 Visitor 每个 UTC 日 3 次成功下载；一次符合条件的 X Share Unlock 可增加 5 次。
- 普通公共工具并不自动继承下载器配额规则。

**UNKNOWN：** 生产环境当前对哪些下载工具启用了服务端配额；每个公共工具的真实成功率、使用量和回访价值。

### 6. 注册用户获得什么价值？

**已确认：**

- 仓库中的公共下载配额合同为 Registered User 每个 UTC 日 10 次成功下载；一次符合条件的 X Share Unlock 可增加 5 次。
- 登录后可进入 Audio Toolkit；仓库定价合同提供每日 30 个 Free Audio Credits。1 Credit 对应 1 分钟合并输入音频，整批总时长向上取整。
- Free Audio Credits 支持每批 1 个本地文件，不包含 ZIP 导出。
- 登录用户可在当前设备保存 Projects、Presets 和 Recent Activity；仅保存设置和活动信息，不保存或上传音频文件。更换设备或清除浏览器数据会丢失这些本地工作区数据。
- 公共下载额度和 Audio Credits 相互独立；注册或付费 Audio Toolkit 不会增加公共下载额度。

**UNKNOWN：** 生产环境当前是否对所有注册用户启用了 Audio Credits；注册用户实际使用最多的权益；注册是否提高任务完成率、回访或留存。

### 7. $29 付费用户为什么值得付钱？

**已确认的产品价值主张：** Regular 订阅为 $29/月，包含 2,800 Audio Credits，即每月最多 46 小时 40 分钟输入音频；Credits 在每次成功月度付款后刷新且不 rollover。可用的付费 Credit 余额支持每批最多 50 个文件和 ZIP 导出，并可随时取消订阅。

按全部 Credits 被使用计算，Regular 的单位成本约为 $0.62/输入音频小时；$14 Pay As You Go 包含 480 Credits（8 小时），单位成本为 $1.75/输入音频小时。当前 Pricing 将 Regular 定位给每月处理超过 16 小时音频的 frequent projects。

因此，$29 Regular 相对 PAYG 的可确认购买理由是：更高的月度处理容量、更低的满额单位成本、自动月度刷新，以及相对免费单文件工作流的批处理和 ZIP 效率。50 文件批处理和 ZIP 并非 Regular 独占；PAYG 的有效付费 Credit 余额也可获得相同能力。

**UNKNOWN：** 用户是否认为这些价值值得 $29；真实购买原因、愿付价格、活跃订阅数、续费率、流失原因、付费用户处理量，以及生产 public checkout 当前是否开放。

### 8. Geekskai 相比单独的小工具网站有什么优势？

**已确认的产品结构优势：**

- 一个统一目录集中展示多个类别的浏览器工具。
- SoundCloud Hub 和工具切换器把 track download、source-format check、playlist 与 artwork 等相邻任务连接起来，减少重新搜索。
- 首页同时提供公共工具入口和 Audio Toolkit 入口，使一次性公共任务与重复音频准备工作流处于同一品牌体系。
- 共享账号承接公共下载配额恢复、Audio Toolkit Credits 和本地工作区入口。
- 产品规则统一强调 outcome-first、较少设置、开放核心访问和可行时的本地处理。

**UNKNOWN：** 用户是否感知或重视这些结构优势；跨工具发现率、同一用户使用多个工具的比例、品牌回访率，以及这些优势是否优于具体独立工具网站。

### 9. 当前产品定位有哪些不清晰的地方？

**已确认：**

1. `data/toolsData.ts` 实际包含 50 个唯一工具，但首页使用的 `TOOL_COUNT` 和 `PRODUCT.md` 写为 51。
2. 首页将 Audio Toolkit 放在旗舰位置，但 Bing 当前搜索点击主要集中在 SoundCloud 下载任务；旗舰叙事与已观察获客重心不是同一件事。
3. 根 `README.md` 仍将项目描述为 Next.js blog template，与当前工具产品定位冲突。
4. Tools 页面保留未验证的 `25K+ happy users` 和站级 `100% free forever` 表达；前者没有可复现证据，后者容易与付费 Audio Toolkit 混淆。
5. `developers and creators` 是宽泛品牌文案，当前搜索数据不能证明访问者角色。
6. `/tools/soundcloud-to-wav/` 的 URL 和导航名称暗示 WAV 转换，但当前工具能力被描述为 source-format checker，明确避免伪 WAV upconversion。
7. 公共工具、受配额控制的下载器、注册用户下载额度、Audio Credits 与付费批量权益虽然在代码和内部文档中分开定义，但站级文案尚未始终用同一套解释表达它们的关系。
8. 博客、作者品牌、广泛公共工具组合、SoundCloud 获客集群和 Audio Toolkit 旗舰之间的总品牌关系仍有多种同时存在的表述。

### 10. 目前缺少哪些信息，无法仅通过代码库判断？

**UNKNOWN：**

- Audio Toolkit 的访问、文件选择、处理开始、成功、失败、复用和留存数据。
- Visitor、Registered User、Customer 和 Subscriber 的真实数量及转化关系。
- 实际购买、续费、退款、取消和流失数据。
- 用户为什么注册、为什么购买、为什么不购买或为什么离开。
- 用户职业、具体创作场景、技术水平、地域与语言偏好之间的可靠分布。
- 客户原话、情绪张力、社交性 JTBD、触发事件和成功标准。
- 用户尝试过的替代方案、直接竞品和选择 Geekskai 的决定因素。
- 支持工单、访谈、调查、NPS、win/loss 或 churn research。
- 跨搜索引擎一致性；本版只读取了 Bing 三个月报表，未取得可用于同口径验证的 GSC 全站数据。
- 当前生产环境的 feature flags、public checkout 状态及真实端到端付款可用性。

## Product Overview

**One-liner：** Geekskai 是一个需求驱动的浏览器工具组合，以开放的单任务工具满足即时需求，并以本地优先的 Audio Toolkit 承接重复音频准备工作。

**What it does：** 公共工具覆盖下载、文本处理、开发、计算、转换、查询、打印测试和创意生成等任务。Audio Toolkit 让登录用户在浏览器本地对自己拥有或获授权使用的音频进行双遍 LUFS 规范化、WAV/MP3 转换、设置复用和批量导出。

**Product category：** Free online tools / browser utilities；Audio Toolkit 属于 browser-based local audio preparation utility。

**Product type：** Web product；公共工具组合 + authenticated workspace。

**Business model：** 公共工具免费开放；Audio Toolkit 提供每日免费 Credits、$14/480 Credits 的一次性 PAYG，以及 $29/月、2,800 Credits 的 Regular 订阅。内部产品文档另将合规页面上的广告描述为未来可能的收入来源，但当前处于 Ad-Free Growth Stage。生产支付是否已公开开放为 `UNKNOWN`。

## Target Audience

**Target companies：** `UNKNOWN`。当前证据不支持按公司行业、规模或阶段定义 B2B ICP。

**Decision-makers：** `UNKNOWN`。当前产品更接近个人自助工具，没有证据证明存在独立的 champion、financial buyer 或 technical buyer。

**Primary audience：** 带着明确搜索任务进入具体工具页、希望直接取得可用结果的搜索访客。

**Secondary product audience：** 注册创作者、DJ 和音乐库整理者；这是代码库记录的目标群体，不是经客户样本验证的人群占比。

**Primary use case：** 在浏览器内以较少设置完成一个明确任务并取得结果。

**Jobs to be done：**

- 完成一个由搜索词直接命名的下载、检查、转换、计算或生成任务。
- 避免为一次性任务安装或学习复杂软件。
- 对拥有或获授权使用的音频进行本地规范化、转换和重复设置复用。

**Use cases：**

- SoundCloud track/playlist 下载、MP3 偏好、源格式检查和 artwork 获取。
- 打印测试、VIN 查询、单位/时间/数据转换、文本和创意生成。
- DJ/Club 或 Streaming/portable 音频准备，输出 WAV 或 MP3，并选择 LUFS 与 WAV bit depth。

## Personas

不建立 persona。当前没有每个稳定细分至少 5–10 个独立客户数据点，也没有访谈、调查、评论或支持记录可用于验证 persona。

**Persona details：** `UNKNOWN`

## Problems & Pain Points

**Core problem：** 已确认的是用户带着具体任务进入具体页面；他们真实感受到的核心痛点为 `UNKNOWN`。

**Product copy currently addresses：** 复杂设置、软件安装、上传音频、格式和响度选择、单次与批量处理。这些是当前产品试图解决的问题，不能当作已验证的客户痛点。

**Why alternatives fall short：** `UNKNOWN`

**What it costs users：** `UNKNOWN`

**Emotional tension：** `UNKNOWN`

## Competitive Landscape

**Direct competitors：** `UNKNOWN`。未进行具名竞争产品研究。

**Secondary alternatives：** `UNKNOWN`。代码库没有证明用户实际使用桌面音频软件、其他下载站、搜索结果中的其他工具或手工流程作为替代方案。

**Indirect alternatives：** `UNKNOWN`

**Confirmed structural comparison with a standalone tool site：** Geekskai 将多个相邻任务、一个统一目录、账号入口和 Audio Toolkit 放在同一品牌体系；但这是否形成真实竞争优势仍为 `UNKNOWN`。

## Differentiation

**Key differentiators supported by the product：**

- 广泛但按明确任务组织的公共浏览器工具组合。
- 普通公共工具保持开放核心结果，不以注册作为通用结果门槛。
- SoundCloud 相邻任务之间存在 Hub 和工具切换路径。
- Audio Toolkit 的音频和文件名保留在设备本地；服务器只处理身份、Credit 预留/结算和账单所需状态。
- Audio Toolkit 将一次性免费处理、PAYG 和 recurring Credits 放在同一 Credit 规则中，并在处理前显示预计成本。

**How we do it differently：** 通过搜索入口满足一次性任务，再用同一品牌下的相邻工具和本地 Audio Toolkit 支持更连续的工作流。

**Why that is better：** 从产品结构看，可减少重新搜索和复杂安装，并为本地音频处理提供一致的权限与计费规则。

**Why customers choose us：** `UNKNOWN`。没有客户访谈、win/loss 或选择原因数据。

## Objections & Anti-Personas

| 项目 | 当前结论 |
| --- | --- |
| 已观察的前三大购买异议 | `UNKNOWN` |
| 对本地处理能力的信任问题 | `UNKNOWN`；当前页面提供隐私与浏览器兼容性说明，但没有客户异议证据 |
| 对 Credits 或 $29 价格的异议 | `UNKNOWN` |

**Anti-persona：** `UNKNOWN`。可以确认产品不授予获取或商业使用第三方内容的权利，但这是一项使用边界，不是经研究形成的 anti-persona。

## Switching Dynamics

**Push：** `UNKNOWN`

**Pull：** 产品提供无需安装的公共工具、本地音频处理、免费每日 Credits、批处理和 ZIP；这些是产品吸引力主张，是否实际推动切换为 `UNKNOWN`。

**Habit：** `UNKNOWN`

**Anxiety：** `UNKNOWN`

## Customer Language

**Verbatim search language（Bing，非访谈原话）：**

- `soundcloud downloader`
- `soundcloud to mp3`
- `soundcloud mp3`
- `soundcloud to mp3 converter`
- `soundcloud to wav`
- `soundcloud playlist downloader`
- `print test page`
- `bandcamp to mp3`

**How customers describe the problem：** `UNKNOWN`

**How customers describe Geekskai：** `UNKNOWN`

**Words and phrases to use：** focused browser tools、the result you need、no signup for public tools、on-device/local processing、Audio Credits、input audio minutes、files you own or are authorized to use。

**Words and phrases to avoid：** unlimited（用于受配额工具时）、lossless/true WAV（没有源文件证据时）、customer（泛指注册用户时）、member、paid downloader、cloud projects、25K+ happy users、market-leading、100% free forever（作为整个 Geekskai 的站级承诺时）。

**Glossary：**

| Term | Meaning |
| --- | --- |
| Visitor | 未登录使用公共工具的人 |
| Registered User | 已通过 Geekskai 身份系统认证的人；不等同于 Customer 或 Subscriber |
| Customer | 已通过批准的 Payment Processor 建立可验证账单关系的 Registered User |
| Subscriber | 拥有 PayPal Regular recurring agreement 的 Customer；实际处理权限仍来自未过期的 Audio Credits |
| Daily Download Allowance | 受支持公共下载工具共享的 UTC 日成功下载额度；与 Audio Credits 无关 |
| Share Unlock | 在 Quota Gate 打开符合条件的预设 X composer 后获得的当日额外 5 次下载额度；不证明帖子已发布 |
| Audio Credit | Audio Toolkit 的使用单位；1 Credit 覆盖 1 分钟合并输入音频，整批向上取整 |
| Free Audio Credits | 每日 30 Credits，仓库合同为单文件、无 ZIP |
| Paid Credit balance | 任一未过期的付费 Credit 余额；允许最多 50 文件批处理与 ZIP，不等同于订阅状态 |
| Local DJ Workspace | 设备绑定的 Projects、Presets 和 Recent Activity；不上传音频且不提供跨设备同步 |

## Brand Voice

**Tone：** 直接、技术可信、克制、结果导向。

**Style：** 先说明用户将得到什么，再解释输入、限制、本地处理和权限边界；使用具体数字和可验证事实，不使用夸大或模糊的价值判断。

**Personality：** practical、transparent、focused、privacy-conscious、evidence-led。

## Proof Points

### 可使用的当前证据

- `data/toolsData.ts`：50 个唯一工具，分布于 8 个目录类别。
- Bing Webmaster Tools，站点 `geekskai.com`，时间范围 2026-06-13 至 2026-09-12，Web Search Performance：75K clicks、788.7K impressions、9.51% CTR。
- 同一 Bing 报表：Desktop 70.9K clicks / 743.4K impressions；Mobile 4.1K clicks / 45.3K impressions。
- 同一 Bing Pages 报表：`/tools/soundcloud-downloader/` 40.2K clicks、`/tools/soundcloud-to-mp3/` 8.1K、`/tools/soundcloud-to-wav/` 8.3K，三页合计约 56.6K clicks。
- 代码支持 Audio Toolkit 在浏览器本地进行双遍 LUFS 处理、WAV/MP3 输出、设置复用，以及符合余额规则的批处理和 ZIP 导出。

### 不可使用的 claims

- Tools 页面中的 `25K+ happy users` 带有待替换注释，没有已核实测量口径，不得作为 proof point。
- 客户、知名用户或品牌 Logo：`UNKNOWN`
- Testimonials / customer quotes：`UNKNOWN`
- 收入、付费转化、留存、成功率或性能 benchmark：`UNKNOWN`
- 生产支付可用性：`UNKNOWN`

### Value themes

| Theme | 当前证据 |
| --- | --- |
| Immediate task completion | 查询词与具体工具落地页高度对应；产品按单任务页面组织 |
| Open public access | 首页与产品规则明确普通公共工具无需注册完成核心结果 |
| Local audio privacy | Audio Toolkit 页面和处理代码明确音频与文件名保留在设备上 |
| Predictable audio usage | Pricing 和处理界面以输入时长计算并在开始前显示 Credits |
| Batch efficiency | 有效付费 Credit 余额支持最多 50 文件与 ZIP；Free 为单文件无 ZIP |

## Goals

**Business goal：** 当前内部上下文定义为 Acquisition-First、Ad-Free Growth Stage：优先通过有证据的公共工具获得高质量非品牌自然搜索访问并完成工具结果；Audio Toolkit 商业化仍受独立 payment launch gate 约束。

**Primary conversion action：** 对公共工具是完成 Successful Tool Outcome；对 Audio Toolkit 是登录后完成本地音频处理。真实的商业 primary conversion 是否已转向购买为 `UNKNOWN`。

**Acquisition north star：** 非品牌自然搜索点击进入 policy-eligible tool pages，并以 Successful Tool Outcome rate 和流量质量作为 guardrails。

**Current funnel metrics：** `UNKNOWN`。仓库包含事件定义和测量计划，但未提供足以确认当前全漏斗表现的数据。

## Evidence Notes

### Repository sources

- `PRODUCT.md`：产品、用户、开放核心、本地处理、证据要求与 payment launch gate。
- `CONTEXT.md`：Visitor / Registered User / Customer / Subscriber、下载配额、Audio Credits、增长阶段和品牌规则。
- `components/Hero.tsx`、`messages/en.json`：当前首页价值主张与 Audio Toolkit 入口。
- `data/toolsData.ts`、`data/toolNavigation.ts`、`app/[locale]/tools/page.tsx`：工具目录、工具计数和现有 Tools 文案。
- `lib/billing/catalog.ts`、`app/[locale]/pricing/page.tsx`、`app/[locale]/pricing/PricingActions.tsx`：价格、Credits、有效期、批量权限与 Pricing 文案。
- `lib/download-quota/domain.ts`、`lib/download-quota/config.ts`：Visitor / Registered User 下载额度和适用工具。
- `app/[locale]/workspace/DjWorkspace.tsx`、`app/[locale]/workspace/AudioProcessorPanel.tsx`：Audio Toolkit 本地处理、Projects、Presets、批次与 ZIP 行为。
- `README.md`、`data/siteMetadata.js`：仍存在的博客模板与宽泛受众表述。

### Search evidence

- Bing Webmaster Tools：`geekskai.com`，Search Performance，3 M，2026-06-13 至 2026-09-12；读取 Keywords、Pages、Device 和 Country 报表。
- 该数据只代表 Bing 报表中的搜索表现，不代表全部网站流量、唯一用户数或客户数量。
- GSC 当前未取得同口径的全站数据，因此跨引擎验证为 `UNKNOWN`。

## Changelog

*Newest first. One line per revision: what changed and why.*

- v1 (2026-09-13) — 基于当前代码库、页面文案、Pricing、工具目录与 Bing 三个月搜索数据建立初始产品营销上下文。
