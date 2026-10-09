# Geekskai 搜索流量恢复：AI 执行方案

编写日期：2026-10-09。将本文件直接交给执行 AI；从第一步开始执行，不需要重新制定一份泛化 SEO 计划。

## 1. 任务与边界

你负责调查 geekskai.com 的 Google 流量下滑，修复有证据支持的当前缺陷，并交付可复核结果。执行顺序：**WAV 核心页 → 历史发布与内容对照 → 有历史流量的未收录页面 → 其余 SEO 问题**。

- 工作目录：`/Users/channelwill/Downloads/geekskai`。本文代码路径均相对此目录。
- 本方案允许本地调查、最小代码修复、测试和文档更新。先读取适用的 `AGENTS.md`，保护用户已有改动，不升级依赖、不做无关重构。
- 不自动提交 Git、部署、修改生产配置/密钥、修改额度或账单、提交 IndexNow/GSC 重新索引、批量删除内容或更改全站索引策略。完成本地可审查结果后，列出需要用户授权的具体发布动作。
- 复用用户指定的内置浏览器 GSC/Bing 登录会话；只读检查，结束后恢复临时筛选。无法访问时使用现有导出，注明截止日期，不虚构新数据。
- 历史调查受阻时，继续独立的当前缺陷修复；不得把未验证的原因变成大范围改动。
- 技术验收通过与搜索流量恢复分别报告。不得承诺排名恢复时间或把平均排名改善当作恢复证明。

## 2. 必须先读取的证据

| 文件 | 用途 |
| --- | --- |
| `reports/seo/2026-10-09-traffic-diagnosis.md` | 本次 GSC/Bing 诊断、口径和限制 |
| `reports/seo/2026-10-09-traffic-evidence/gsc-14d-comparison/Pages.csv`、`Queries.csv` | 最近一次断崖的页面与查询损失 |
| `reports/seo/2026-10-09-traffic-evidence/gsc-90d/Chart.csv` | 日级拐点 |
| `reports/seo/2026-10-09-traffic-evidence/gsc-index/Chart.csv` | 收录数量变化 |
| `reports/seo/2026-10-09-traffic-evidence/gsc-crawled-not-indexed/Table.csv` | 未收录 URL 清单 |
| `reports/seo/soundcloud-to-wav-monitoring.md` | 9 月 13 日源格式文案调整的历史线索，**不是当前能力规范** |
| `docs/incidents/2026-10-06-soundcloud-service-auth-502.md` | 已记录的 10 月 6 日生产故障及验收范围 |
| `reports/seo/2026-10-09-seo-fix-tasks.md`、`reports/seo/2026-10-09-tools-url-matrix.csv` | 技术 SEO 待办与交叉核验；不要默认全部执行 |

固定基线，复算后保留：

| 范围 | 前期 → 后期 | 已确认事实 |
| --- | --- | --- |
| Google 全站，8/12–9/8 → 9/9–10/6 | 点击 7,898 → 1,573；曝光 90,722 → 6,707 | 月点击下降约 80.1% |
| Google 全站，9/9–9/22 → 9/23–10/6 | 点击 1,340 → 233 | 两个等长 14 天窗口 |
| 英文 WAV 页，同上 | 点击 1,212 → 122；曝光 4,750 → 550 | 损失约占全站净点击损失的 98.5% |
| 两个核心词，同上 | `soundcloud to wav converter` 点击 662 → 2；`soundcloud to wav` 点击 396 → 33 | 合计损失约占全站净损失的 92.4%，与页面贡献重叠，不能相加 |
| Google 已收录数量，9/8 → 10/4 | 479 → 376 | 覆盖收缩，但英文 WAV/MP3 在 10/9 检查时仍收录，canonical 正确 |

页面表与属性图表聚合口径不同，上述贡献率为近似值；查询导出不含全部匿名查询。Bing 原比较窗口与 Google 错开一天，且总卡片为 Web and Chat、页面表为 Web，不能直接合并或据此计算跨引擎损失率。

## 3. 按顺序执行

### P0-A：核对拐点、发布和真实搜索损失

1. 确认当前目录、源码版本和既有改动。若有 Git，记录 `git status --short`、`git rev-parse HEAD`；本次编写时未发现 `.git`，无 Git 时记录文件快照/哈希，并将历史代码追溯标为 BLOCKED。不要初始化仓库或编造提交历史。
2. 只读核对可访问的 Git、Vercel 发布记录、生产日志及历史页面快照，建立下表。**提交时间、文档日期、页面 dateModified 不等于生产上线时间。**保留日志原时区，并与 GSC 日级统计口径对齐。

| 时间范围 | 必查变化 |
| --- | --- |
| 8/17–8/21 | 第一次全站曝光断崖；模板、索引策略、内容和发布变化 |
| 9/13–9/23 | 9/13 文档所述“仅检查 MP3/M4A 源格式”文案是否真正上线；9/19、9/23 下滑前后的标题、正文、WAV 能力、登录与额度变化 |
| 10/6 至今 | 当前 WAV 转换版本何时上线；鉴权 502 的已知影响范围；当前版本与 9 月版本的区别 |

3. 对每个事件记录：发生时间、版本/部署标识、变化内容、证据位置、是否早于下滑、支持/反对该假设的证据。缺历史证据写“无法确认”，不把 10/6 故障倒推为 9 月断崖原因。
4. GSC 使用域资源 `sc-domain:geekskai.com`、Web、精确页面 `https://geekskai.com/tools/soundcloud-to-wav/`。比较 9/9–9/22 与 9/23–10/6，分别查看上述两个精确查询，并按损失最大的前三个国家及设备拆分。保存筛选条件、数据截止日和导出。不要用“URL 包含”把多语言页面混在一起。
5. 使用英文歌单页作为对照；Google 两周点击 78 → 76。Bing 如能设置相同日期及 Web 口径，再比较 WAV 与歌单；否则只保留方向性证据。
6. 将结果分成“已证实缺陷”“有支持证据的原因假设”“无法确认”。Google 更新的时间重合只能支持假设，不能证明处罚或具体违规。9/19、9/23 早于 9/24 更新开始，不能解释为该更新开始当天造成。

**完成条件：**可以说明损失发生在哪些页面/查询/市场，历史变更是否有证据；无法判定因果也可以完成本步骤，但必须保留不确定性。

### P0-B：验证 WAV 真实能力，修复当前描述冲突

优先读取：

| 层次 | 代码位置 |
| --- | --- |
| 页面、metadata、JSON-LD | `app/[locale]/tools/soundcloud-to-wav/page.tsx`、`layout.tsx`；`data/soundCloudSeo.ts`；`components/SoundCloudEvidenceContent.tsx` |
| 导航与翻译 | `components/SoundCloudToolSwitcher.tsx`；`data/soundCloudGrowth.ts`；`messages/en.json`、`fr.json`、`es.json`、`de.json` |
| 下载 UI 与浏览器下载 | `app/[locale]/tools/soundcloud-downloader/hooks/useSoundCloudTrackDownloadForm.ts`；`app/[locale]/tools/soundcloud-downloader/lib/download.ts` |
| 任务代理与接口契约 | `app/api/download-soundcloud/route.ts`；`app/api/soundcloud-download-job/route.ts`；`lib/soundcloud/contracts.ts`、`jobs.ts`、`service.ts`；`docs/integrations/soundcloud-service.md` |
| 额度与事件 | `components/download-quota/useDownloadQuota.ts`；`lib/download-quota/server.ts`；`lib/analytics/tool-events.ts` |

**已发现的当前冲突：**`data/soundCloudSeo.ts` 宣称将可用源音频转换为真实 PCM WAV，而 `SoundCloudToolSwitcher.tsx` 的 en/fr/es/de 卡片仍描述为只检查 MP3/M4A 源格式。先核实当前服务契约和可运行版本，再统一相关文案；这是当前缺陷，尚未证明它导致历史流量下降。

执行动作：

1. 本地/隔离测试先验证 WAV 请求格式、任务轮询、文件票据、错误处理和额度行为。外部转换服务与本仓库分属不同边界，不因本仓库支持 `wav` 枚举就断言服务已实现转换。
2. 若有已授权测试环境及测试音频，使用真实 UI 走完 WAV 下载，核验响应格式、文件名、实际 RIFF/WAVE 容器及 PCM 音频编码。可用 `ffprobe` 检查；缺工具时读取容器与格式块。仅扩展名 `.wav`、HTTP 200、任务 ready 或进度 100% 都不构成完整验收。
3. 优先使用自有/授权音频和隔离额度；真实生产下载若会消耗额度或生成业务记录，列出具体测试请求等待授权。缺少环境只阻塞真实下载验收，不伪造成功，也不阻塞其他只读调查。
4. 若 WAV 能力验证成立：将四种现有 SoundCloud 支持语言的导航、CTA、主体及 metadata 中冲突的描述改成一致事实；例如“将可访问的音轨转换为 WAV；转换不会恢复源文件已丢失的音质”。只修改实际冲突的位置。
5. 若能力无法确认：不要扩大能力承诺；记录冲突与所缺证据。若确认功能故障，先复现并补针对性测试，再修具体故障，不重构下载架构、不绕过鉴权/额度、不恢复“无损、无限、任意歌曲、固定高码率”等未经证明的承诺。
6. 保持当前正确的英文 WAV URL、自引用 canonical 和索引资格。支持语言从 `data/soundCloudGrowth.ts` 与 `app/sitemap-config.ts` 读取；不要根据 `messages/` 存在十种语言就重新开放所有 SoundCloud 语言版本。
7. 保留 9/13 监控文档为历史基线，在新的执行报告写当前能力与事件口径，不覆盖历史事实。当前 `tool_succeeded` 在触发原生下载链接后发出，**不能证明文件已完整保存到用户磁盘**。统计时区分“任务就绪/下载已发起”“已验证完整文件”“额度失败”；不可观测的浏览器取消标记不可观测，不强行实现虚假的完成率。

**完成条件：**文案与已验证能力一致；四语言 DOM、metadata、导航描述无冲突；下载相关改动有正向与对应异常路径测试；真实服务未验证时明确 BLOCKED。

### P1：找出值得恢复的未收录页面，逐个修复

1. 将 634 条未收录记录与月比较页面 CSV、此前 URL 矩阵求交集。保留原始 URL，另设解析字段；不得直接删除语言前缀、查询参数或尾斜杠后合并证据。
2. 先按真实路由分类：工具页、博客、标签、静态资源、其他；正确识别 `/blog/.../tools/...`，不要仅因包含 `/tools/` 就归为工具。再记录当前 HTTP 状态、重定向目标、canonical、robots/noindex、语言、sitemap 和当前 GSC 状态。
3. 分开列出正常重定向、主动 noindex、不应收录的资源和真正待诊断页面。**不把 634 当作应全部收录的目标。**旧抓取记录必须复核当前状态。
4. 优先核对历史点击损失最大的 10 个“当前仍应独立收录”的页面；不足 10 个就全部核对。排序依据为历史损失，不能只按页面数量或笼统的 SEO 分数。
5. 每个候选页先写复现证据与最小修复，再实施：错误 canonical 修 canonical；意外 noindex 修来源；内链指向跳转/404 修实际链接；翻译缺失补实际缺失内容。仅有“已抓取未索引”不能直接证明正文低质，也不能通过批量加 FAQ/schema 解决。
6. 若需要动公共规则，先检查 `app/i18n/urls.ts`、`app/sitemap-config.ts`、`app/sitemap.ts`、`app/robots.ts`、`proxy.ts`、`lib/seo.ts`；复用已有实现，不创建第二套 URL 规则。调整 hreflang 时核对所有目标、回链与当前索引策略。
7. 无法证明收益的批量删除、合并、重定向或扩大 noindex，作为后续决策列出候选 URL、损失与回滚影响，不自动执行。Bing 短描述等通用问题排在本轮核心修复之后。

输出 `reports/seo/2026-10-09-traffic-recovery-url-triage.csv`，至少包含：`url`、`route_type`、`locale`、`clicks_before`、`clicks_after`、`click_loss`、`current_status`、`canonical`、`indexability`、`gsc_status`、`evidence`、`action`、`priority`。没有数据的字段留空并解释，不填假零值。

**完成条件：**能区分应该保留排除的地址与真正有价值的修复对象；每个代码改动对应具体 URL 和当前失败证据。

## 4. 验证与命令

先确认 `package.json`、锁文件及测试隔离方式没有变化。使用项目现有 Yarn 版本；不要运行带自动修复的 `yarn lint`，不要在连接生产数据库的环境直接跑全量集成测试。

根据修改范围选择测试组，未改动的功能不为凑覆盖率新增测试：

```sh
cd /Users/channelwill/Downloads/geekskai

# 修改文案来源、metadata 或索引规则时
yarn test data/soundCloudSeo.test.ts lib/seo.test.ts app/sitemap.test.ts app/sitemap-config.test.ts

# 修改下载链路时；先确认这些测试使用 mock/隔离存储
yarn test 'app/[locale]/tools/soundcloud-downloader/lib/download.test.ts' lib/soundcloud/jobs.test.ts lib/soundcloud/service.test.ts

# 修改额度或事件逻辑时
yarn test components/download-quota/useDownloadQuota.test.ts lib/download-quota/domain.test.ts lib/download-quota/server.test.ts lib/analytics/tool-events.test.ts

# 代码变更后的静态检查和构建
yarn typecheck
yarn build

# 只检查实际修改的代码文件，以下为文案冲突修复示例；不要加 --fix
yarn eslint components/SoundCloudToolSwitcher.tsx data/soundCloudSeo.ts

# 构建成功后用生产模式本地验收；本项目 yarn start 实际是开发模式
yarn serve --port 3100
```

`yarn serve` 是常驻服务，应在独立终端运行。构建若产生文件变化，区分原有文件与本次生成物，不覆盖用户改动。需要完整测试时先核实所有 integration/live 测试的环境门禁；不得为通过测试临时填入生产凭证。

验收清单：

- WAV 页面四种支持语言：HTTP 状态、最终 URL、服务端与浏览器最终 DOM 的 title/description、canonical、robots、hreflang、正文和 JSON-LD 一致；非支持语言保持现有预期跳转策略。
- 下载链路有改动时：成功 WAV、无效/不可访问输入、上游 429 与重试等待、服务鉴权失败、额度拒绝、任务失败/过期；核对失败可见、状态可恢复、无重复扣额度。只添加覆盖所修缺陷的必要测试。
- 只做文案修复时：检查渲染结果与四语言内容即可，不新增“断言整段文案”的机械测试。
- sitemap/内链有改动时：检查受影响 URL 及 hreflang 目标；区分本地生成结果与生产站现状，发布前线上仍旧版本不代表本地修复失败。
- 每项记录 `PASS / FAIL / BLOCKED`、预期、实际、证据和未验证边界。基线已有错误与新增错误分开，不把测试未运行写成通过。
- 最后复查实际 diff；无 Git 则用本次编辑前后的文件快照比对。确认每处改动都对应本方案中的已证实问题。

## 5. 发布准备与回滚

先完成全部可独立执行的本地任务，交付具体文件清单、验证结果、预期生产变化及待授权操作。不要因缺历史记录就停下所有工作，也不要用此次方案授权替代生产发布授权。

若后续获得发布授权：

1. 记录实际生产部署标识与时间为 T0；未发布不能启动“发布后观察”。
2. 发布后只验证改动目标：页面状态与 SEO 标签、核心下载链路、错误率、额度行为；保留与发布版本匹配的证据。
3. 若发生新增 5xx、WAV 无法使用、额度异常、意外 noindex/canonical 改变或有效 URL 大面积跳转，回滚本次相关改动/部署并复验。保留上一生产部署标识与本次逐文件补丁，不使用 `git reset --hard` 或覆盖用户原有改动。
4. 单凭短期排名波动不回滚真实能力说明，不恢复不实承诺。索引提交仅针对已修复且应收录的规范 URL，并单独取得授权；它不是恢复排名的保证。

## 6. 恢复观察与交付

在 T0、T0+7、T0+14、T0+28 记录完整日期的数据；排除未完成日，按等长窗口、同一筛选口径比较。此处只是执行后的观察安排，不自动创建定时任务。

- 搜索：英文 WAV 精确页面的点击、曝光、CTR；两个核心词及主要国家/设备表现；歌单对照页；本次修复 URL 的实际索引状态。
- 产品：可观测的下载发起/失败、任务失败和额度初始化失败；真实文件成功仅以实际取得并验证的文件为证据。没有既有历史埋点数据时写“无可比基线”。
- 判断：技术结果与流量趋势分开。连续完整窗口的点击和曝光回升才支持恢复趋势；少量曝光下排名或 CTR 上升、单日反弹、索引提交成功均不足以判定恢复。

最终只需交付以下成果，不另建大型审计系统：

1. 本轮有证据支持的最小代码改动，保持未提交状态。
2. `reports/seo/2026-10-09-traffic-recovery-execution.md`：基线与证据、发布/内容时间线、假设支持与反证、修改文件及原因、测试结果、未解决问题、发布与回滚步骤、观察口径。
3. `reports/seo/2026-10-09-traffic-recovery-url-triage.csv`：候选 URL 与处理结论。新增原始导出放在独立日期目录，不覆盖 10/9 的历史证据。

重复执行时先读取已有成果与当前代码：已修复且验证通过的项目直接引用证据，不重复改写、重复提交或扩大范围。最终回复明确写出“已修复什么、依据是什么、哪些已通过、哪些受阻、下一步具体需要什么”。如果只有调查完成，应明确写“调查完成，尚未实施/发布修复”，不要宣称流量已经恢复。
