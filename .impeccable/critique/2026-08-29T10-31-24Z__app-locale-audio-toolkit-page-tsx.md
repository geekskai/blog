---
target: /audio-toolkit/
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-08-29T10-31-24Z
slug: app-locale-audio-toolkit-page-tsx
---
Method: dual-agent (A: /root/critique_design_a · B: /root/critique_detector_b)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---:|---|
| 1 | Visibility of System Status | 3 | Credits、时长估算、逐文件进度与取消状态清楚；缺少批次级完成摘要。 |
| 2 | Match System / Real World | 2 | 核心动作直白，但 LUFS、bit depth、Credits 与“Project”语义缺少首次用户解释。 |
| 3 | User Control and Freedom | 2 | 可取消处理并确认清空本地数据；不能移除单个文件、重试单项或撤销项目删除。 |
| 4 | Consistency and Standards | 3 | 视觉系统一致；Preset 的“可复用”文案与实际行为不一致。 |
| 5 | Error Prevention | 2 | 有格式、批量、余额与时长限制；未登录者先选文件再跳转登录，必然丢失选择。 |
| 6 | Recognition Rather Than Recall | 2 | 主要设置可见；Preset 不能应用，用户仍需记住并手动复刻参数。 |
| 7 | Flexibility and Efficiency | 2 | 有批量、默认值和 ZIP；缺少 preset 应用、队列编辑、逐项重试等高频路径。 |
| 8 | Aesthetic and Minimalist Design | 3 | 主工具层级清楚；首次成功前已同时展示付费、项目、预设和历史，页面任务过多。 |
| 9 | Error Recovery | 3 | 错误与支付延迟提示具体；失败项无就地重试，批次结果不够明确。 |
| 10 | Help and Documentation | 2 | 有隐私、兼容性和 ZIP 说明；缺少 LUFS、bit depth、Credit 计费与推荐设置的上下文帮助。 |
| **Total** | | **24/40** | **Acceptable — 基础可靠，但关键工作流仍需显著改进。** |

## Design Specificity Verdict

**LLM assessment：视觉特异性中等偏高，交互特异性偏低。** 深色音频工作台、波形与文件语义、LUFS、逐文件队列、设备本地说明，让界面明显属于音频准备场景，而不是可直接换标的通用 SaaS。问题在于结构仍像“主工具 + 两张对称表单卡 + Projects + Activity”的通用 dashboard；Preset、Project 与处理器并未连成一套真实的音频工作流。

**Deterministic scan：入口 0 项；核心 UI 2 项，均为假阳性。** 固定入口扫描 `app/[locale]/audio-toolkit/page.tsx` 返回 `[]`。补充扫描 `AudioProcessorPanel.tsx` 也返回 `[]`；`DjWorkspace.tsx:350` 与 `:373` 报出 2 个 `gray-on-color` warning，但规则把默认 `text-slate-500` 与 `hover:bg-rose-500/10` 跨状态拼接，实际 hover 同时使用 `hover:text-rose-300`，因此不存在灰字落在玫红背景上的真实状态。扫描没有能衡量 authoredness 的规则，因此 specificity 结果为 inconclusive，不能据此宣称页面没有其他问题。

**Visual overlays：没有可靠的用户可见 overlay。** 两个评审均在独立 Chrome 标签页访问生产页面；桌面首屏截图确认 midnight 工作台、上传区、WAV/LUFS/bit-depth 设置、Credits 与处理 CTA 已渲染。B 的可变注入预检超时并重置，后续 `markerPersistedB:false`，且当前 Chrome Playwright surface 为只读，因此没有注入 `detect.js`、没有 overlay console findings，也不声称浏览器中存在可见标注。视觉判断采用生产截图与源码交叉验证。

## Overall Impression

这是一个视觉完成度不错、处理状态也扎实的音频工具，但它目前更像一个强处理器旁边摆了几个尚未接通的 workspace 模块。最大的机会不是再加视觉装饰，而是兑现“登录后继续、Preset 可应用、Project 可恢复工作”的闭环，让页面的专业外观与真实能力一致。

认知负荷为**中等**：8 项检查中失败 3 项——一次呈现多个任务模块、Preset 迫使用户记忆参数、首次结果前缺乏渐进披露。情绪路径从“本地处理很可信”快速滑向“参数和 Credits 有点复杂”，在登录跳转丢文件时达到低谷；处理进度能恢复掌控感，但薄弱的完成摘要和脱节的 Project/Preset 又削弱结尾。

## What’s Working

1. **结果与隐私边界清楚。** “Normalize and convert your tracks”“files stay on device”与本地存储提醒准确支撑 local-first 承诺。
2. **处理状态设计扎实。** 时长读取、Credit 估算、waiting/processing/done/failed、逐项百分比、Cancel 与支付确认超时都给用户及时反馈。
3. **视觉系统执行一致。** Sky 表示主动处理、violet 表示 Credits/付费能力；表面、边框、圆角和克制的高光符合 Midnight Utility Bench。

## Priority Issues

### [P1] 登录流程会丢失用户刚选择的本地文件

**Why it matters：** 未登录时，处理按钮只有在用户先选择文件并读出时长后才启用；点击后却用 `window.location.assign` 离开页面。浏览器文件句柄不能跨导航恢复，用户投入动作后立刻被迫重做，任务型搜索访客很可能直接离开。

**Fix：** 在上传前提供可点击的登录主动作，登录后再开放文件选择；或改成不离开页面且明确保留选择状态的认证方式。不要让用户先选文件，再通知必须离开页面登录。

**Suggested command：** `$impeccable onboard`

### [P1] Projects 与 Presets 是未兑现的工作流承诺

**Why it matters：** `DjWorkspace.tsx:302` 声称 preset 可在上方处理器复用，但 `AudioProcessorPanel` 内部独立维护 format、loudness 与 bit depth，没有 props、Apply 或 Open 路径。Project 也只保存名称和 presetId，不能打开或恢复处理上下文。这会让用户把“记录卡片”误认为能驱动工作。

**Fix：** 先定义最小真实语义：Preset 必须能一键应用并显示当前状态；若 Project 只保存设置，就明确改名并说明不保存文件；若保留 Project，则至少能打开并恢复 preset/输出设置。功能接通前删除“可复用”承诺。

**Suggested command：** `$impeccable shape`

### [P2] 队列控制和批次完成态不足

**Why it matters：** 批量用户不能移除单个误选文件、清空选择或重试单个失败项。处理结束主要依赖自动下载与行内 `done`，没有汇总成功数、失败数、输出规格和 Credits 消耗。

**Fix：** 增加单项 Remove、Clear 与 Retry；结束时展示“8/10 completed · 2 failed · 14 Credits used”一类摘要，并提供 Retry failed 和 Process another batch。

**Suggested command：** `$impeccable harden`

### [P2] 首次用户缺少推荐结果路径，付费信息出现过早

**Why it matters：** 搜索型访客同时面对 LUFS、bit depth、Credits 和购买计划，却没有先得到“为我的用途该选什么”的答案。参数和商业信息争夺首次任务注意力。

**Fix：** 用结果命名的推荐选项起步，例如 “Club/DJ · WAV · −9 LUFS”与“Streaming/portable · MP3 · −14 LUFS”；把裸参数放入 Advanced settings。购买卡在余额不足或首次成功后再强化。

**Suggested command：** `$impeccable distill`

### [P2] 关键帮助文字与部分移动操作目标偏弱

**Why it matters：** 兼容性、上传帮助和字段提示大量使用 11–12px 的低对比文字；项目删除和 Delete local data 为约 36px 高，低于 DESIGN 规定的 44px 移动触控基线。

**Fix：** 提升任务相关帮助文字的对比与最小字号；移动端把所有删除操作目标提升到至少 44×44px，同时保留清晰焦点态。

**Suggested command：** `$impeccable audit`

## Persona Red Flags

**Jordan / 英语搜索型首次访客：** 首屏先遇到 LUFS、bit depth 与 Credits，却没有按结果组织的推荐路径；选完本地文件才跳转登录，返回后必须重选；“Sign in required”也没有解释为什么处理留在设备上仍需要账户。

**Alex / 本地批量音频用户：** 不能应用 preset、打开 project、移除单个文件或只重试失败项；生产截图显示“1 files · batch”的语法错误，并与旗舰 batch workspace 的心智预期冲突；页面承诺付费 50-file batches，却没有展示大队列所需的管理能力。

**Sam / 键盘与低视力用户：** 主要字段 label、`aria-live`、`progressbar` 和 focus ring 是优点；但帮助文字偏小偏暗，图标式项目删除触控区偏小，完成和失败状态散落在各队列行而缺少批次级 live-region 摘要。

## Minor Observations

- “1 files · batch”应按单复数输出。
- 上传区视觉像 drop zone，但文案与实现只承诺点击/触摸选择；不要暗示未实现的拖放。
- Project 删除没有确认或撤销，而清空全部本地数据有确认，两种破坏性动作不一致。
- “Create your first project to test whether this workspace is useful…”像内部验证文案，不像帮助用户完成真实任务。
- `DESIGN.md` 与 sidecar 的同步状态被上下文检查标为过期；应另行运行 `$impeccable document` 复核，本次 critique 不自动修复。

## Questions to Consider

- 如果 Audio Toolkit 的核心承诺是“重复批量准备”，为什么用户第一次成功前就要理解 Project，而 Project 又不能恢复一次工作？
- 如果登录只用于 Credits 授权，能否把认证放到文件选择前，或放在不丢失本地选择的同页流程中？
- 什么才是这个版本的真实持久化单位：输出设置、一次批次，还是 Project？名称应与实际可恢复内容严格一致。
