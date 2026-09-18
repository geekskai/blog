# Geekskai Growth Dashboard Specification

**Version:** v1  
**Last updated:** 2026-09-13  
**Default reporting window:** Rolling 30 days, UTC  
**Purpose:** 建立 Geekskai 从 Acquisition 到 Retention 的统一测量合同，识别当前最大的增长瓶颈，并明确哪些决策因数据缺失而无法作出。

## 1. 使用方式与证据标准

本文件是一份数据源中立的 Dashboard Specification，不是新产品路线图，也不代表已经完成 GA4、数据仓库或可视化工具的配置。

所有结论必须使用以下状态之一：

| 状态 | 定义 |
| --- | --- |
| **已确认** | 当前代码、产品规则、Clarity、Bing Webmaster Tools 或 Neon 数据库直接支持 |
| **部分可获取** | 数据存在，但覆盖范围、身份连接、时间窗口或事件语义不足以支持完整结论 |
| **不可获取 / UNKNOWN** | 当前没有可复现的数据，或不同数据源无法使用相同分母和身份进行连接 |

解释规则：

- Clarity 用于行为诊断、页面路径和录屏，不是注册、付款或收入的事实来源。
- Bing Webmaster Tools 和 GSC 用于搜索表现，不等同于站内独立用户、成功结果或收入。
- Neon 中的 first-party growth events 是 Quota Gate 注册路径的权威来源。
- Clerk 是账号创建事实来源，但当前没有完整连接到所有 acquisition journeys。
- PayPal webhook 驱动的 billing records 是付款、退款和订阅状态的权威来源。
- PayPal approval、Pricing 页面访问、CTA click、Clarity 自动识别的 Download 都不能代替已验证付款或成功产品结果。
- Attribution 是方向性模型，不是因果证明。不同平台报告的 conversion 不得相加。
- 所有漏斗必须注明分母、身份单位、归因窗口和样本量。分母不同的百分比不得直接比较。

## 2. Executive Finding：当前最大增长瓶颈

### 2.1 最大的可量化行为瓶颈

截至 2026-09-13 的滚动 30 天 Neon first-party 数据显示，当前最大且满足可比较条件的行为流失发生在：

`quota_gate_viewed → signup_started`

| 阶段 | Unique journeys | 相邻阶段 Conversion Rate | 相邻阶段 Drop-off Rate | 绝对流失 |
| --- | ---: | ---: | ---: | ---: |
| `quota_gate_viewed` | 1,763 | — | — | — |
| `signup_started` | 328 | 18.60% | **81.40%** | **1,435** |
| `new_account_completed` | 157 | 47.87% | 52.13% | 171 |
| 24 小时内 `successful_download` | 132 | 84.08% | 15.92% | 25 |

端到端 Quota Gate Activation：

```text
132 Activated Registrations / 1,763 Quota Gate journeys = 7.49%
Drop-off = 92.51%
```

因此，目前最大的**可量化行为瓶颈**是用户看到 Quota Gate 后没有开始注册，而不是注册完成后无法继续任务。

这个结论只适用于受 first-party growth journey 覆盖的下载配额路径，不代表 Geekskai 全产品漏斗。

### 2.2 最大的产品决策瓶颈

当前更基础的瓶颈是 **Acquisition → Activation 的全站可观测性缺失**。

Clarity 在滚动 30 天内记录了 36,781 个非机器人 sessions，但绝大多数公共工具没有一致的 `tool_started`、`tool_succeeded` 和 `tool_failed` 事件。搜索入口、公共工具结果、账号、付款和重复使用也没有统一 identity stitching。

因此目前无法回答：

- 哪个 acquisition channel 带来的用户最可能完成工具结果？
- 哪个工具的流量大但 Activation Rate 最低？
- 哪个落地页产生最多 Activated Registrations 或 Verified Revenue？
- 免费公共工具使用是否会提高 Audio Toolkit 注册、付款或留存？
- Geekskai 全产品最大的相邻阶段 Drop-off 究竟发生在哪里？

在这些缺口补齐前，Quota Gate 是“当前最大且可信的已量化瓶颈”，不能表述为“Geekskai 全产品已确认的绝对最大增长瓶颈”。

### 2.3 其他当前诊断信号

| 信号 | 当前值 | 证据边界 |
| --- | ---: | --- |
| Clarity sessions | 36,781 | 滚动 30 天；另排除 3,013 bot sessions |
| Clarity unique users | 30,500 | Clarity browser identity，不等同于账号或跨设备用户 |
| Sessions with new users | 29,462 / 80.10% | Clarity classification |
| Sessions with returning users | 7,319 / 19.90% | 不是 outcome-based retention |
| Pages per session | 1.38 | 行为诊断，不代表任务失败 |
| Average scroll depth | 38.95% | 行为诊断 |
| Dead-click sessions | 7,420 / 20.17% | 自动行为信号，需要按页面和元素复核 |
| Pricing → Audio Toolkit | 85 / 596 = 14.26% | Clarity 当前唯一配置漏斗；Drop-off 85.74% |
| Checkout user → paid user | 2 / 9 = 22.22% | Neon，7 天付款窗口；样本过小，不进入最大瓶颈排名 |
| Verified payment records | 3，Gross Revenue $87 | `billing_payments`；Net Revenue 当前不可用 |
| 注册下载用户 30 天重复使用 | 39 / 223 = 17.49% | 至少两个不同 UTC 日期成功下载；不是标准 D30 cohort |
| Audio completion users | 2 | 服务端 Audio operations；样本过小 |
| Repeat Audio completion users | 0 / 2 | 至少两个不同 UTC 日期；样本过小 |
| Paid workspace opened | 2 | First paid milestone |
| Paid processing completed | 0 | 样本为 2，不能推断稳定付费激活率 |

Clarity 的 Pricing → Audio Toolkit Drop-off 和服务端 Checkout → Payment Drop-off 均值得监控，但它们的身份、分母和事件语义不同，不能与 Quota Gate 漏斗直接排序。

## 3. Product Funnel Overview

### 3.1 Product North Star Metric

建议作为统一产品结果指标的测量口径：

**Weekly Successful Outcome Users（WSOU）**

定义：一个 UTC 周内至少一次完成可验证核心结果的独立用户或 journey。

结果事件按产品表面定义：

| Product surface | Successful Outcome |
| --- | --- |
| 普通公共工具 | `tool_succeeded` |
| 受配额下载工具 | 服务端 `successful_download` |
| Audio Toolkit | 服务端确认的 completed Audio operation；客户端 `audio_processing_completed` 仅用于诊断 |

在全站事件覆盖和 identity stitching 完成前，WSOU 为 **UNKNOWN**，不得用页面访问、按钮点击或 Clarity 自动 Download 代替。

### 3.2 Funnel stages

```text
Acquisition
Qualified Tool Landing User
        ↓
Activation
First Successful Outcome
        ↓
Signup
New Account + Resumed Successful Outcome
        ↓
Revenue
Verified Payment
        ↓
Retention
Successful Outcome in a Later Cohort Window
```

这不是要求每位用户都按线性顺序经过五个阶段。公共工具可以在未注册状态下 Activation；Revenue 主要属于 Audio Toolkit。Dashboard 必须分别呈现公共工具、Quota Gate 和 Audio Toolkit journeys，禁止把不适用的阶段强行合并。

## 4. Acquisition

### 4.1 Stage North Star Metric

**Qualified Tool Landing Users**

定义：在选定窗口内，排除已识别机器人后，从可识别来源首次进入 Geekskai 工具落地页的独立用户。

“Qualified”只表示满足可测量的流量质量条件，不代表用户已经获得结果或具有购买意愿。搜索来源还应分为 brand / non-brand，并区分 policy-eligible 与其他工具页面。

### 4.2 Supporting Metrics

| Metric | Definition | Authority |
| --- | --- | --- |
| Search clicks | 搜索结果点击进入 Geekskai | GSC / Bing |
| Search impressions | Geekskai 页面在搜索结果展示 | GSC / Bing |
| Search CTR | Clicks / Impressions | GSC / Bing |
| Organic landing users | 首次 session source/medium 为 organic search 的独立用户 | GA4，当前 UNKNOWN |
| Landing sessions | 以某页面为 entry page 的非机器人 sessions | GA4；Clarity 可提供诊断近似值 |
| New user share | New users / all observed users | GA4；Clarity 可提供自己的分类 |
| Brand / non-brand mix | 按查询是否含 Geekskai 品牌词分类 | GSC / Bing query data |
| Landing page mix | 按 `tool_id` / route 的 acquisition 分布 | GA4、GSC、Bing |
| Device / locale / country mix | 流量结构 | 各来源独立报告，不合并为唯一用户 |

当前 Bing 三个月证据（2026-06-13 至 2026-09-12）：75K clicks、788.7K impressions、9.51% CTR。该数据只代表 Bing，不代表全部 acquisition。

### 4.3 GA4 Events

| GA4 event | Trigger | Required properties | Current status |
| --- | --- | --- | --- |
| `session_start` | GA4 新 session | GA4 automatic dimensions | **不可获取**：GA4 未启用 |
| `page_view` | 页面成功加载或 SPA route change | `page_location`, `page_referrer`, `page_title` | **不可获取**：GA4 未启用 |
| `tool_landing_viewed` | session 的 landing page 为工具页 | `tool_id`, `product_surface`, `locale`, `user_state` | **缺失** |

不得向 GA4 发送用户输入、媒体 URL、文件名、邮箱、原始 Clerk ID 或其他 PII。

### 4.4 Conversion Rate

```text
Acquisition → Activation Conversion Rate
= Activated Users / Qualified Tool Landing Users
```

身份单位必须一致。不能用 GSC/Bing clicks 直接除以 Neon journeys，也不能用 Clarity sessions 直接除以 Clerk users。

### 4.5 Drop-off Rate

```text
Acquisition → Activation Drop-off Rate
= 1 - Acquisition → Activation Conversion Rate
```

### 4.6 数据可获取性

**部分可获取。**

- 已确认：Bing 搜索表现；Clarity sessions、entry pages、referrers、device 和行为诊断。
- 部分可获取：GSC 后台存在，但本版没有取得与 Bing 同口径的全站 extract。
- UNKNOWN：GA4 organic landing users、brand/non-brand 用户级连接、Acquisition → Activation Conversion。

## 5. Activation

### 5.1 Stage North Star Metric

**Activated Users**

定义：在一次可连接 journey 中首次完成有效 Successful Outcome 的独立用户或匿名 journey。

### 5.2 Supporting Metrics

| Metric | Definition |
| --- | --- |
| Tool Start Rate | Users with `tool_started` / tool landing users |
| Tool Success Rate | Users with `tool_succeeded` / users with `tool_started` |
| Tool Failure Rate | Users with `tool_failed` / users with `tool_started` |
| Download Success | Server-confirmed `successful_download` journeys |
| Audio Selection Rate | Users with `audio_file_selected` / Audio Toolkit users |
| Audio Start Rate | Users with `audio_processing_started` / file selectors |
| Audio Completion Rate | Completed Audio users / Audio processing starters |
| Time to First Outcome | First Successful Outcome time - landing time |
| Result Reuse Signal | `tool_result_copied` or valid result download after success |
| Quota Block Rate | `quota_blocked` or Quota Gate viewers / download starters |

### 5.3 GA4 Events

| GA4 event | Successful meaning | Required properties | Current status |
| --- | --- | --- | --- |
| `tool_started` | 用户提交了可处理的工具任务 | `tool_id`, `action`, `product_surface`, `user_state`, `locale` | **部分可获取**：client dispatcher 存在，工具覆盖不完整，GA4 未启用 |
| `tool_succeeded` | 工具返回可用结果 | 同上；可选 `result_count`、`format` | **部分可获取** |
| `tool_failed` | 工具任务失败 | 同上；受控 `failure_class`，禁止原始错误内容 | **部分可获取** |
| `successful_download` | 服务端确认下载额度 operation 完成 | `tool_id`, `user_state`, `journey_id` | **仅 Neon 可获取**，未进入 GA4 |
| `tool_result_copied` | 用户复制已生成结果 | `tool_id`, `action` | **部分可获取** |
| `audio_file_selected` | 选择一个本地文件 | `product_surface`, `user_state` | **Clarity 可获取**，GA4 不可获取 |
| `audio_files_selected_batch` | 选择多个本地文件 | `product_surface`, `user_state`, `batch_size_bucket` | **Clarity 可获取**，GA4 不可获取 |
| `audio_processing_started` | 单文件处理开始 | `product_surface`, `user_state`, `credit_type` | **Clarity 可获取**，GA4 不可获取 |
| `audio_processing_started_batch` | 批处理开始 | 同上 | **Clarity 可获取**，GA4 不可获取 |
| `audio_processing_completed` | 至少一个单文件结果完成 | `product_surface`, `user_state`, `credit_type` | **Clarity 诊断 + Neon operation 事实可部分获取** |
| `audio_processing_completed_batch` | 至少两个结果完成 | 同上；`batch_size_bucket` | **Clarity 可获取**，GA4 不可获取 |
| `audio_processing_failed` | 处理失败且非用户取消 | 受控 `failure_class` | **Clarity 可获取**，GA4 不可获取 |
| `audio_processing_canceled` | 用户取消处理 | `product_surface`, `user_state` | **Clarity 可获取**，GA4 不可获取 |

### 5.4 Conversion Rate

```text
Activation Rate
= Activated Users / Qualified Tool Landing Users
```

子漏斗：

```text
Tool Success Rate = Successful Tool Users / Tool Start Users
Audio Completion Rate = Completed Audio Users / Audio Processing Start Users
```

### 5.5 Drop-off Rate

```text
Activation Drop-off Rate = 1 - Activation Rate
Tool Failure or Abandonment = 1 - Tool Success Rate
Audio Processing Drop-off = 1 - Audio Completion Rate
```

### 5.6 数据可获取性

**部分可获取；全站 Activation Rate 为 UNKNOWN。**

- 受配额下载工具通过 shared quota controller 记录服务端 `successful_download`。
- Audio Toolkit 有客户端 Clarity events 和少量服务端 credit operations。
- 通用 `trackToolEvent` dispatcher 存在，但没有覆盖约 50 个目录工具的统一成功语义。
- `window.gtag` 仅为可选发送路径；当前布局没有启用 GA4 loader。

## 6. Signup

### 6.1 Stage North Star Metric

**Activated Registrations**

定义：`new_account_completed` 后，在同一 growth journey、原 Quota Gate 后 24 小时内完成 `successful_download` 的新账号。

单纯创建账号不算 Activated Registration，因为它不能证明被中断的任务得到恢复。

### 6.2 Supporting Metrics

| Metric | Definition |
| --- | --- |
| Signup Opportunities | 可以开始注册的独立 journeys；Quota 路径使用 `quota_gate_viewed` |
| Signup Starts | `signup_started` unique journeys |
| New Accounts | Server-classified `new_account_completed` |
| Existing Account Returns | `signin_completed` |
| Signup Completion Rate | New Accounts / Signup Starts |
| Post-signup Activation | Activated Registrations / New Accounts |
| Time to Signup | `new_account_completed` - `signup_started` |
| Signup Source Mix | first-touch source of completed accounts；当前 UNKNOWN |

### 6.3 GA4 Events

| GA4 event | Trigger | Authority | Current status |
| --- | --- | --- | --- |
| `quota_gate_viewed` | 下载额度耗尽并显示 gate | Neon | **可获取于 Neon**，GA4 不可获取 |
| `signup_started` | 用户选择 account action | Neon | **可获取于 Neon**，GA4 不可获取 |
| `sign_up` | Clerk 确认创建新账号 | Clerk / server | **GA4 缺失** |
| `new_account_completed` | 创建时间符合近期 signup journey | Neon server classification | **Quota 路径可获取**，GA4 不可获取 |
| `login` | 已有账号成功认证 | Clerk / server | **GA4 缺失** |
| `signin_completed` | 已有账号返回 Quota journey | Neon | **Quota 路径可获取**，GA4 不可获取 |

### 6.4 Conversion Rate

```text
Signup Start Rate
= Signup Starts / Signup Opportunities

Signup Completion Rate
= New Account Completions / Signup Starts

Post-signup Activation Rate
= Activated Registrations / New Account Completions
```

当前 Quota Gate 路径：

| Conversion | Rate |
| --- | ---: |
| Quota Gate → Signup Started | 328 / 1,763 = **18.60%** |
| Signup Started → New Account Completed | 157 / 328 = **47.87%** |
| New Account Completed → Successful Download | 132 / 157 = **84.08%** |
| Quota Gate → Activated Registration | 132 / 1,763 = **7.49%** |

### 6.5 Drop-off Rate

| Drop-off | Rate | Lost journeys |
| --- | ---: | ---: |
| Quota Gate → Signup Started | **81.40%** | 1,435 |
| Signup Started → New Account Completed | 52.13% | 171 |
| New Account Completed → Successful Download | 15.92% | 25 |
| Quota Gate → Activated Registration | 92.51% | 1,631 |

### 6.6 数据可获取性

**Quota Gate 路径可获取；全站 Signup 为部分可获取。**

- Neon 可以用 `journey_id` 跨越 Quota Gate、Clerk return 和恢复下载。
- Clerk 可以确认账号事实，但当前 Dashboard 没有全量 Clerk signup extract。
- 首页、Pricing、Audio Toolkit 和直接 sign-up 的机会、开始、完成及 first-touch source 不能统一连接。
- Clarity 的 Sign up / Log-in 自动事件不代替 Clerk 或 Neon 事实。

## 7. Revenue

### 7.1 Stage North Star Metric

**Verified Net Revenue**

定义：由已处理并成功关联用户的 PayPal lifecycle records 确认的付款金额，减去退款和手续费。

在 `net_minor` 或 fee 数据不完整时：

- 展示 `Verified Gross Revenue`。
- 将 `Verified Net Revenue` 标记为 **UNKNOWN**。
- 不把缺失净额显示为 `$0`。

### 7.2 Supporting Metrics

| Metric | Definition |
| --- | --- |
| Pricing Users | Pricing 页面独立用户 |
| Checkout Users | 创建 PAYG order 或 subscription checkout 的独立用户 |
| Verified Paying Users | 在归因窗口内出现 verified completed payment 的独立用户 |
| Checkout Conversion | Verified Paying Users / Checkout Users |
| Gross Revenue | Completed payments 的 `amount_minor` 总和 |
| Refunded Revenue | `refunded_minor` 总和 |
| Net Revenue | Gross - refunds - fees；字段完整时才报告 |
| PAYG / Subscription Mix | 按已验证付款类型拆分用户与收入 |
| Active Subscriptions | 权威 subscription status 为 active 的订阅数 |
| Cancellation Rate | Cancellations / eligible active subscriptions |
| Paid Activation | Verified payer 后打开 workspace 或完成 processing 的用户 |

### 7.3 GA4 Events

| GA4 event | Trigger | Authority | Current status |
| --- | --- | --- | --- |
| `pricing_viewed` | Pricing 页面客户端加载 | Clarity | **Clarity 可获取**，GA4 不可获取 |
| `view_item` | 查看明确的 PAYG 或 subscription offer | GA4 measurement contract | **缺失** |
| `begin_checkout` | 服务端成功创建 order/subscription checkout | Billing server | **GA4 缺失**；Neon 有内部 checkout events |
| `purchase` | PayPal webhook 确认完成并成功关联 | Billing server | **GA4 缺失** |
| `refund` | PayPal webhook 确认 full/partial refund | Billing server | **GA4 缺失** |
| `subscription_cancelled` | PayPal lifecycle 确认取消 | Billing server | **Neon 内部事件部分可获取**，GA4 缺失 |
| `subscription_renewed` | 后续 subscription payment 完成 | Billing server | **统一增长事件缺失**；付款记录可部分推导 |
| `paid_workspace_opened` | 有有效付费 Credit 的用户首次打开 workspace | Neon | **可获取于 Neon** |
| `first_paid_processing_completed` | 有有效付费 Credit 的用户首次完成 processing | Neon | **可获取于 Neon** |

`paypal_payg_approved` 和 `paypal_regular_approved` 只能诊断 checkout return，不能映射为 `purchase`。

`purchase` 必需属性：`transaction_id`、`value`、`currency`、`plan_type`、`payment_type`。Dashboard 中只保留去重后的 transaction identity，不展示 provider secret 或 PII。

### 7.4 Conversion Rate

默认付款归因窗口为 checkout 后 7 天：

```text
Checkout → Payment Conversion Rate
= Unique Verified Paying Users within 7 days / Unique Checkout Users
```

当前滚动 30 天：

```text
2 paying users / 9 checkout users = 22.22%
```

该样本低于 100，不参与 Largest Eligible Bottleneck 排名。

### 7.5 Drop-off Rate

```text
Checkout → Payment Drop-off Rate
= 1 - Checkout → Payment Conversion Rate
= 77.78%（当前样本 n=9）
```

### 7.6 数据可获取性

**部分可获取。**

- Billing tables 可确认 order、payment、refund、subscription status 和 credit grant。
- 当前滚动 30 天有 3 条 completed payment records，Gross Revenue 为 `$87`。
- `net_minor` 没有可用净额，因此 Net Revenue 为 **UNKNOWN**。
- first-touch acquisition source 没有连接到 verified payment。
- 当前没有 GA4 Revenue reporting。

## 8. Retention

### 8.1 Stage North Star Metric

**D30 Retained Activated Users**

定义：首次 Activation cohort 中，在首次 Activation 后第 23–30 个 UTC 日至少再次完成一次 Successful Outcome 的用户比例。

只访问页面、登录或打开 workspace 不算 outcome-based retention。

### 8.2 Supporting Metrics

| Metric | Definition |
| --- | --- |
| D1 Retention | 首次 Activation 后第 1 个 UTC 日再次成功的用户 / eligible cohort |
| D7 Retention | 第 6–7 日再次成功的用户 / eligible cohort |
| D30 Retention | 第 23–30 日再次成功的用户 / eligible cohort |
| 30-day Repeat Outcome | 窗口内至少两个不同日期成功的用户 / 窗口内成功用户 |
| WAU / MAU | 最近 7 天 outcome users / 最近 30 天 outcome users |
| Repeat Downloads | 注册用户在多个日期的 `successful_download` |
| Repeat Audio Processing | 多个日期的 completed Audio operations |
| Renewal Rate | 成功续费 subscriptions / eligible renewal subscriptions |
| Subscription Churn | 在期间取消或失效 subscriptions / 期初 active subscriptions |

### 8.3 GA4 Events

Retention 不创建 `user_retained` 或类似点击事件，而是从有时间戳的事实事件计算 cohort：

| Reused event | Retained outcome |
| --- | --- |
| `tool_succeeded` | 普通公共工具再次获得有效结果 |
| `successful_download` | 注册下载用户再次完成下载 |
| `audio_processing_completed` | 再次完成 Audio processing；服务端 operation 为事实来源 |
| `purchase` / `subscription_renewed` | 成功续费收入 |
| `subscription_cancelled` | 订阅取消 |

上述事件当前没有完整进入 GA4，因此 GA4 cohort retention 为 **UNKNOWN**。

### 8.4 Conversion Rate

```text
Dx Retention Rate
= Users with a Successful Outcome in the Dx window
  / Users eligible from the First Activation cohort
```

当前可计算的有限近似值：

```text
30-day Repeat Registered Download Rate
= 39 users active on at least 2 UTC dates / 223 registered download users
= 17.49%
```

这个窗口指标不是 D30 cohort，不得标为 D30 Retention。

### 8.5 Drop-off Rate

```text
Dx Retention Drop-off Rate = 1 - Dx Retention Rate
```

标准 D1/D7/D30 Drop-off 当前均为 **UNKNOWN**。

### 8.6 数据可获取性

**部分可获取；标准 D30 Retention 为 UNKNOWN。**

- First-party growth events 以可连接形式保留 90 天，可支持部分下载用户重复使用分析。
- `audio_credit_operations` 可以确认服务端 Audio processing；当前样本很小。
- `workspace_activations` 只保存首次 milestone，不能重建完整重复使用序列。
- 普通公共工具没有完整 user/journey success history。
- 未登录用户跨设备、清除 cookie 后的 retention 不可识别。

## 9. Funnel Availability Matrix

| Stage | Stage North Star | Current availability | Current reliable source | Current conversion | Current drop-off |
| --- | --- | --- | --- | ---: | ---: |
| Acquisition | Qualified Tool Landing Users | **部分可获取** | Bing、Clarity；GSC 未统一提取 | Acquisition → Activation **UNKNOWN** | **UNKNOWN** |
| Activation | Activated Users | **部分可获取** | Neon quota events、Audio operations、部分 client events | 全站 Activation **UNKNOWN** | **UNKNOWN** |
| Signup | Activated Registrations | **Quota 路径可获取** | Neon + Clerk return classification | Gate → Activated 7.49% | 92.51% |
| Revenue | Verified Net Revenue | **部分可获取** | PayPal lifecycle + Neon billing tables | Checkout → Payment 22.22%, n=9 | 77.78%, n=9 |
| Retention | D30 Retained Activated Users | **UNKNOWN** | 部分 Neon events 可算窗口近似 | 标准 D30 **UNKNOWN** | **UNKNOWN** |

## 10. Attribution Contract

### 10.1 Source of truth hierarchy

| Question | Authority | Role |
| --- | --- | --- |
| 搜索 query、impression、click、CTR | GSC / Bing | Acquisition evidence |
| 站内 source、medium、campaign、landing journey | GA4 | 当前未配置；目标 journey analytics |
| 页面行为、dead clicks、recordings | Clarity | 诊断，不定义 conversion truth |
| 新账号事实 | Clerk | Account authority |
| Quota Gate、注册恢复、成功下载 | Neon growth events | First-party quota funnel authority |
| Audio processing outcome | Neon audio operations | Server-confirmed outcome authority |
| 付款、退款、订阅 | PayPal lifecycle + Neon billing records | Revenue authority |

任何 acquisition 或 ad platform 报告的 purchase 都必须与 billing source-of-truth 去重，不得累加为更多付款。

### 10.2 Attribution models

| Decision | Default model | Reason |
| --- | --- | --- |
| 哪个入口创造了 Activated Registration / Customer | First-touch | 保留最初已知 acquisition source |
| 哪个近期页面或渠道推动了 checkout | Last non-direct | 避免 OAuth、自站跳转和 direct 覆盖最后有效来源 |
| 长期渠道投资判断 | First-touch 与 Last non-direct 并列 | 两者差异本身是 attribution uncertainty |
| 因果判断 | **不由 attribution dashboard 提供** | 需要独立实验或其他增量证据 |

### 10.3 Attribution windows

| Conversion | Window |
| --- | --- |
| Quota Gate → signup / resumed download | Gate 后 24 小时 |
| Checkout → verified payment | Checkout 后 7 天 |
| Raw linkable growth journey | 90 天 retention policy |
| Operational dashboard | Rolling 30 days |
| Retention | D1、D7、D30 cohort windows，UTC |

### 10.4 Required identity graph

目标数据合同需要以下非 PII identity 层级：

```text
GA4 anonymous user / session
        ↕
first-party journey_id
        ↕ after authentication
analytics-safe authenticated user key
        ↕ server only
Clerk user / billing customer
```

当前已确认：

- `growth_journeys` 可以在 Quota flow 内将匿名 `journey_id` 与认证后的 Clerk user 连接。
- Billing events 可以按认证用户连接 checkout、payment 和 workspace milestones。

当前缺失：

- GA4 identity，因为 GA4 未启用。
- 一般 acquisition source 与 `growth_journeys` 的 first-touch 字段。
- 覆盖所有 signup entry points 的 journey connection。
- 覆盖所有公共工具 Successful Outcome 的稳定 identity。

不得向 GA4、Clarity 或 URL 参数暴露邮箱、文件名、媒体 URL、付款标识、原始 Clerk ID 或其他 PII。

### 10.5 Attribution confidence

Dashboard 中的 source breakdown 必须显示 confidence：

| Confidence | Definition |
| --- | --- |
| High | 同一 first-party journey 连接 source、conversion 和 backend fact |
| Medium | GA4 first/last-touch 与 backend conversion 可通过安全用户键连接 |
| Low | 只使用 referrer、短期 campaign window 或单一平台 claimed conversion |
| Unknown | 无 source、direct、跨设备断裂或无法连接的 conversion |

## 11. GA4 Event Contract

### 11.1 Naming

- 使用 lowercase `object_action`。
- 上下文放在 properties，不放在动态 event name 中。
- 例如使用 `tool_succeeded` + `tool_id=soundcloud_to_mp3`，而不是为每个工具创建不同 GA4 event。
- 现有 Clarity 动态事件如 `tool_succeeded_soundcloud_to_mp3` 可以继续作为 Clarity 诊断名称，但不作为 GA4 canonical event schema。

### 11.2 Shared properties

| Property | Allowed values / meaning | Privacy rule |
| --- | --- | --- |
| `tool_id` | 受控工具标识 | 不含用户输入 |
| `product_surface` | `public_tool`, `quota_tool`, `audio_toolkit`, `pricing`, `auth` | 受控枚举 |
| `user_state` | `visitor`, `registered`, `customer`, `subscriber` | 不推断；由当前 entitlement 决定 |
| `journey_id` | first-party opaque UUID | 不使用邮箱或 Clerk ID |
| `locale` | 站点 locale | 受控枚举 |
| `plan_type` | `free`, `payg`, `regular` | 仅账单相关事件 |
| `payment_type` | `one_time`, `subscription` | 仅账单相关事件 |
| `value` | 已验证金额 | 仅 completed/refund lifecycle |
| `currency` | ISO currency code | 与账单事实一致 |
| `credit_type` | `free`, `paid` | 不发送余额或支付标识 |
| `failure_class` | 受控、低基数失败类别 | 禁止原始 error、URL、输入或文件名 |
| `consent_state` | 当前 analytics consent 状态 | 不得绕过 consent |

source、medium、campaign、content、term、page location 和 referrer 优先使用 GA4 自动 campaign/page dimensions，避免重复且不一致的自定义字段。

### 11.3 Conversion events

| Conversion | Canonical event | Counting rule |
| --- | --- | --- |
| Public Tool Activation | `tool_succeeded` | 每个 user + tool + journey 首次一次 |
| Download Activation | `successful_download` | 每个 completed operation 一次；用户漏斗按 unique journey/user 去重 |
| Audio Activation | `audio_processing_completed` | 客户端一次；Dashboard 以服务端 completed operation 去重 |
| Signup | `sign_up` | 每个新账号一次，server confirmed |
| Activated Registration | Derived metric | `new_account_completed` 后 24 小时内 outcome；不是独立点击事件 |
| Purchase | `purchase` | 每个 verified transaction 一次 |
| Refund | `refund` | 每个 verified refund lifecycle 一次；支持 partial value |
| Retention | Derived cohort | 从重复 Successful Outcome 计算，不创建虚假 retained event |

## 12. Geekskai Growth Dashboard Specification

Dashboard 不绑定具体可视化产品。任何实现都必须保留以下四页、指标公式和 authority boundary。

### Page 1 — Executive Funnel

#### Primary cards

1. Qualified Tool Landing Users
2. Activated Users
3. Activated Registrations
4. Verified Paying Users / Gross Revenue / Net Revenue status
5. D30 Retained Activated Users

每张卡显示：

- Current period value
- Previous-period comparison
- Data availability badge
- Source of truth
- Sample size
- Last successful refresh

#### Funnel visualization

显示五个 stage 的人数、相邻 Conversion Rate、Drop-off Rate 和绝对流失。无法使用相同 identity 连接的 transition 显示 `UNKNOWN`，不得用不同来源数字拼接出伪漏斗。

#### Largest Eligible Bottleneck

一个 transition 只有同时满足以下条件才进入排名：

1. 相邻事件来自相同 authority 或有已验证 identity stitching。
2. 分母、去重单位和时间窗口一致。
3. 分母至少 100 个 unique users/journeys。
4. 事件覆盖率和数据新鲜度达到 Dashboard 标准。

排序规则：先按绝对流失人数降序，再用 Drop-off Rate 作为解释指标。小样本单独显示，不参与排名。

按当前数据，Eligible Bottleneck 显示：

```text
Quota Gate → Signup Started
1,435 journeys lost
81.40% drop-off
Source: Neon first-party growth events
Scope: quota-enabled download journeys only
```

同时显示 Measurement Warning：全站 Acquisition → Activation 为 UNKNOWN。

### Page 2 — Acquisition & Attribution

#### Search panels

- Clicks、impressions、CTR 趋势
- Query、landing page、country、device
- Brand / non-brand
- Search engine 分开显示；不合并 GSC 与 Bing clicks
- policy-eligible 与其他工具页面分段

#### On-site acquisition panels

- Users / sessions by source, medium, campaign
- First landing page / `tool_id`
- New / returning classification
- Locale、device、country
- Acquisition → Successful Outcome，当前显示 UNKNOWN 及缺失原因

#### Attribution panels

- First-touch Activated Registrations by channel
- First-touch Verified Revenue by channel
- Last non-direct checkout conversion by channel
- First-touch vs last non-direct comparison
- Unknown / direct / self-referral share
- Attribution confidence distribution

### Page 3 — Activation, Signup & Revenue

#### Activation panels

- Tool Landing → Tool Start → Tool Success
- Audio Toolkit View → File Selected → Processing Started → Processing Completed
- Success、failure、cancel、time-to-outcome
- 按 `tool_id`、product surface、user state、locale、device 分段
- Event coverage by tool

#### Signup panels

- Quota Gate → Signup Started → New Account Completed → Successful Download within 24h
- Direct / Pricing / Audio Toolkit signup paths，缺少连接时显示 UNKNOWN
- New account 与 existing account return 分开

#### Revenue panels

- Pricing → Checkout → Verified Payment → Paid Workspace Opened → First Paid Processing Completed
- PAYG 与 Regular subscription 分开
- Gross、refund、fee、net completeness
- Active、approval pending、cancelled subscriptions
- 所有 payment metrics 显示 backend reconciliation status

Quota Gate、一般公共工具和 Audio Toolkit 使用不同分母，必须在独立 panels 展示。

### Page 4 — Retention & Data Quality

#### Retention panels

- D1 / D7 / D30 outcome-based cohorts
- 30-day repeat Successful Outcome
- WAU / MAU of Successful Outcome users
- Repeat registered downloads
- Repeat Audio processing
- Subscription renewal / cancellation / churn

#### Data quality panels

- GA4 collection status
- Event coverage：tracked tools / total tools
- Journey → authenticated identity linkage rate
- Authenticated user → billing linkage rate
- Unknown source share
- Client vs server completion variance
- Duplicate event rate
- Failed or unreconciled billing events
- Source refresh time and latency
- Raw-event retention coverage

## 13. Global Filters and Reporting Rules

### 13.1 Required filters

- Date range，默认 rolling 30 days
- Comparison period
- Search engine
- First-touch source / medium / campaign
- Last non-direct source / medium / campaign
- Landing page / `tool_id`
- Product surface
- Locale
- Device
- Country
- User state：Visitor / Registered User / Customer / Subscriber
- Payment type：PAYG / subscription
- Plan type

### 13.2 Time and cohort rules

- 所有服务端时间使用 UTC。
- Daily 和 cohort boundary 使用 UTC 00:00。
- 当前期间默认 rolling 30 days；与前一个同长度期间比较。
- Quota Gate Activation 使用 gate 后 24 小时固定窗口。
- Checkout conversion 使用 checkout 后 7 天固定窗口。
- D30 cohort 只报告已完整经过第 30 天观察窗口的 cohort。
- 未成熟 cohort 显示 incomplete，不纳入最终 D30 rate。

### 13.3 Metric formatting

- Rate 同时显示 numerator、denominator、percentage。
- Revenue 同时显示 currency、gross、refund、fee completeness 和 net status。
- 样本小于 100 显示 `Low sample`。
- UNKNOWN 显示缺失原因，不显示为 0。
- 各数据源刷新时间单独显示。

## 14. 当前关键缺失埋点与数据合同

以下缺口直接导致当前无法做完整产品决策。它们是测量缺口，不是产品功能建议。

### P0 — 阻断全漏斗判断

| Gap | Current evidence | Blocked decisions |
| --- | --- | --- |
| GA4 基础 collection 未启用 | `siteMetadata.analytics.googleAnalytics` 被注释；布局虽加载 Pliny Analytics，但没有 GA4 config | 无 GA4 users、sessions、source/medium、funnel、cohort 或 GA4 conversion |
| 全站 Successful Outcome 覆盖缺失 | 通用 tool events 只覆盖少数工具实现；约 50 个目录工具没有统一成功语义 | 不知道哪些工具流量有价值，无法计算 Acquisition → Activation |
| Acquisition first-touch 未写入 growth journey | `growth_journeys` 只保存 user/share connection，没有一般 source、medium、campaign、landing page、referrer | 无法把搜索或渠道连接到 signup、payment、retention |
| 跨系统 identity stitching 缺失 | GA4 不存在；Clarity identity、journey、Clerk 和 billing user 没有统一分析键 | 无法生成可信的 channel → outcome → revenue 路径 |
| 全产品 First Activation timestamp 缺失 | 下载和 Audio 只有部分事实；普通工具无完整用户级历史 | 无法建立 D1/D7/D30 cohort |
| Revenue lifecycle 未进入 GA4 | purchase、refund、renewal 没有统一 analytics event；approval 只是客户端诊断 | 无法在 GA4 中报告可信收入或渠道 ROAS |

### P1 — 阻断分段和原因定位

| Gap | Current evidence | Blocked decisions |
| --- | --- | --- |
| 非 Quota Gate Signup 路径不完整 | Quota return 有 first-party classification；其他 sign-up entry 主要是页面或 Clarity 信号 | 不知道哪种入口产生真实新账号和 post-signup activation |
| Subscription renewal 语义不完整 | Billing payment records 可见，growth event 仍使用 generic subscription payment completion | 无法明确区分首次付款与续费 |
| Cancellation dimensions 不足 | 有 cancellation lifecycle event，但没有统一 plan、period、reason analysis contract | 无法分段解释 churn；真实取消原因仍为 UNKNOWN |
| Event properties 不一致 | client tool events、Clarity events、growth events、billing records 使用不同维度 | 无法稳定按 tool、surface、user state、plan 比较 |
| Client / server outcome reconciliation 缺失 | Clarity Audio completion 与服务端 operations 可能存在覆盖和时序差异 | 不知道客户端漏报、服务端漏报还是处理路径不同 |
| Consent 与 collection status 不在质量报表 | 当前事件规范强调 no PII，但缺少统一 consent-state 可见性 | 无法区分真实零事件与 consent/collection 缺失 |

## 15. 当前可做与不可做的决策

### 当前数据支持

- 确认 Quota Gate → Signup Started 是当前 first-party quota funnel 中最大流失点。
- 比较 Quota Gate 内相邻注册阶段的 Conversion 和 Drop-off。
- 使用 Clarity 诊断 Pricing → Audio Toolkit 页面路径及页面交互问题。
- 使用 billing records 确认真实付款数量与 Gross Revenue。
- 计算注册下载用户的有限 30-day repeat-use 指标。

### 当前数据不支持

- 确认 Geekskai 全产品绝对最大的增长阶段瓶颈。
- 比较所有工具的 Activation Rate。
- 将 Bing/GSC click 直接归因到注册或收入。
- 判断某个渠道产生的 Revenue、CAC、ROAS 或真实增量效果。
- 报告标准 D1/D7/D30 retention。
- 根据 2 个 Audio completion users 或 9 个 checkout users 推断稳定行为。
- 将单个 Clarity recording、dead click 或页面访问解释为客户需求、付费意愿或 churn reason。

## 16. Data Quality Acceptance Criteria

未来只有满足以下条件，Dashboard 指标才能从 UNKNOWN 升级为可决策：

| Area | Acceptance criterion |
| --- | --- |
| Event validity | 每个 canonical event 有唯一 trigger、authority 和去重规则 |
| Coverage | 每个纳入比较的工具都有 landing、start、success、failure 语义 |
| Identity | 匿名 journey 可在认证后连接到 analytics-safe user key；不暴露 PII |
| Revenue | `purchase` 和 `refund` 与 reconciled billing records 一致，按 transaction 去重 |
| Attribution | first-touch source 在 signup/payment 后仍可读取；self-referrals 被排除 |
| Cohorts | First Activation timestamp 存在；只有 mature cohorts 进入 D30 |
| Consistency | Client 和 server event variance 被监控并有明确解释 |
| Freshness | 每个 panel 展示最后刷新时间和数据延迟 |
| Privacy | GA4/Clarity 中无媒体 URL、文件名、邮箱、原始 Clerk ID、付款标识或用户输入 |
| Sample | 最大瓶颈排名分母至少 100，低样本只显示不排序 |

## 17. Evidence and Reproducibility Notes

### Repository evidence

- `.agents/product-marketing.md`：产品表面、用户状态、价值层级和证据边界。
- `data/siteMetadata.js`、`app/[locale]/layout.tsx`：Clarity 和 Pliny Analytics 加载方式；GA4 configuration 当前未启用。
- `lib/analytics/tool-events.ts`：client tool event schema；可选 `gtag`、Umami 和 Clarity dispatch。
- `lib/growth/events.ts`、`lib/db/schema.ts`：first-party journeys、growth events、90 天 raw retention 和 daily aggregates。
- `components/download-quota/useDownloadQuota.ts`：Quota Gate、signup start、successful download 和 registration return 触发路径。
- `lib/billing/repository.ts`、billing API routes：verified payment、subscription lifecycle 和 paid workspace milestones。
- `docs/growth-tracking-plan.md`：现有事件解释、no-PII 规则和历史 Clarity baseline。

### Live evidence snapshot

| Source | Window | Evidence used |
| --- | --- | --- |
| Microsoft Clarity | Rolling 30 days ending 2026-09-13 | Sessions、users、new/returning、pages/session、scroll、dead clicks、Pricing → Audio Toolkit funnel |
| Neon Postgres | Rolling 30 days ending 2026-09-13 | Growth event journeys、Quota signup funnel、checkout users、payments、Audio operations、repeat registered downloads |
| Bing Webmaster Tools | 2026-06-13 to 2026-09-12 | Search clicks、impressions、CTR、page/query/device evidence |

### Reproducibility rules

- Neon funnel按 unique `journey_id`，取窗口内首次 gate，并要求后续事件发生在同一 journey 的 24 小时内。
- Checkout conversion按 unique authenticated users，要求 verified payment 在首次 checkout 后 7 天内。
- Repeat-use近似值按一个用户在滚动 30 天内至少两个不同 UTC 日期完成 outcome。
- Revenue 只汇总 completed billing payment records；approval pending、expired order 和 CTA click 不计收入。
- Clarity metrics 使用 Clarity 自身的 bot exclusion 和 browser identity，不与 Neon users 相加。

## 18. Changelog

- v1 (2026-09-13) — 基于当前代码库、Product Marketing Context、Clarity 滚动 30 天数据、Bing 三个月搜索数据及 Neon first-party growth/billing 汇总建立完整 Geekskai Product Funnel 与 Growth Dashboard Specification。
