# Geekskai 接入独立 SoundCloud 服务

## 配置

仅在 Next.js 服务端配置，不能使用 NEXT*PUBLIC* 前缀：

```dotenv
SOUNDCLOUD_SERVICE_URL=https://soundcloud.geekskai.com
SOUNDCLOUD_SERVICE_KEY=<服务器 /opt/soundcloud-api/.env 中的同名值>
```

本地使用被 Git 忽略的 `.env.local`。Vercel Preview/Production 需分别配置相同变量并重新部署；本次未修改 Vercel。Geekskai 不再需要 SOUNDCLOUD_CLIENT_ID，也不再使用 soundcloud-downloader 包。

## 请求路径

浏览器 → Geekskai API（身份、额度、任务所属会话校验）→ 独立服务（SDK、FFmpeg、文件准备）。浏览器获得短期下载链接后，直接从 UpCloud 原生下载；Vercel 不转发音频、分片或封面字节。

- `/api/soundcloud-info` 保留 `{success,info}`。
- `/api/soundcloud-playlist-downloader` 将新服务 entries 转换为现有 tracks 结构，保留顺序与不可用数量。
- `/api/download-soundcloud/` 和 `/api/download-soundcloud-artwork` 创建任务，返回 202 和签名 token；旧的 directUrl/文件流响应已移除，需与前端同时发布。
- `/api/soundcloud-download-job` 接收 `{token,action}`，action 为 status/ticket/cancel。token 绑定 Clerk 用户或 HttpOnly 访客会话，14 分钟失效；不接受裸任务 ID。
- 单次上游调用最多 25 秒；浏览器准备流程最多 13 分钟，失败尝试取消。服务仍可能短暂保留未成功取消的任务，按自身过期规则回收。

## 额度和成功语义

任务创建仍走现有 reservation → processing；创建失败由现有封装释放额度。服务端观察到任务失败、取消或过期时释放额度；浏览器其他失败也尝试释放，断网时按现有 TTL 自动过期。

查询和领票会验证 processing 预约属于该身份和工具且未过期。链接已交给浏览器后调用现有 complete；不把 complete 的网络失败当作文件准备失败来释放额度。成功表示“下载链接已启动”，不表示用户设备已经完整保存文件。

进度为当前准备阶段的百分比；阶段可从零重新开始。原生下载的最终进度请看浏览器下载管理器。歌单逐曲准备和启动，多文件下载可能需要浏览器授权。

## 验证与发布

```bash
yarn test lib/soundcloud app/\[locale\]/tools/soundcloud-downloader/lib/download.test.ts lib/download-quota/server.test.ts
yarn typecheck
yarn build
```

可选真实测试（会创建并取消一个真实下载任务）：

```bash
SOUNDCLOUD_LIVE_TEST=true node --env-file=.env.local node_modules/vitest/vitest.mjs run lib/soundcloud/live.integration.test.ts
```

真实测试调用 Geekskai 路由处理函数及公网服务，模拟 Clerk 身份，关闭测试进程内服务端额度，不修改生产数据库。不能替代已登录浏览器与真实额度数据库的验收。

发布前用 Preview 验证注册用户/访客、额度不足、不同用户无法查别人的任务、单曲 MP3/M4A/WAV、封面、歌单逐曲，以及上游不可用时的提示与额度释放。回退应整体回退前后端代码，避免混用旧浏览器与新接口契约。

## 本次验证记录（2026-09-30）

- 接入、任务隔离、访客会话、歌单映射、额度与页面说明的相关测试：30 项通过。
- 独立真实联调：Geekskai 路由 → 公网服务 → 完整 MP3 下载和撤销，1 项通过。身份模拟边界见上文。
- TypeScript 检查与生产构建通过。
- 全套测试：174 项通过、5 项跳过、1 项失败；失败为未修改的 PostDownloadShareCard 文案断言（期望旧分享说明，组件实际文案不同），另新增的 2 项隔离/歌单测试已单独通过。
- 浏览器验收受阻：内置浏览器拒绝打开 localhost:3100（ERR_BLOCKED_BY_CLIENT），未绕过限制。当前本地未配置 Clerk/额度数据库凭证，完整身份与额度 UI 验收仍需 Preview 环境。
- 本次只配置本地 .env.local，未发布 Vercel、未修改生产环境变量或生产额度数据、未创建 Git 提交。
- 移除旧 SoundCloud 包时发现 YouTube 工具隐式依赖它带入的 Axios，因此显式保留原版本 Axios 0.21.4，避免改变其他工具行为。本次未升级该依赖。

## 2026-10-06：新版服务的限流适配

服务端转发保留 `service_rate_limited`（429）、`upstream_rate_limited`（503）和 `Retry-After`。上游 HTTP 日期转换为等待秒数；限流缺少或返回无效等待时间时按 60 秒处理。其他 503 不自动视为限流。

浏览器保留错误码、状态及等待秒数。同一页面会话的 SoundCloud 入口共享冷却时间，显示本地化倒计时并禁用下载/查询按钮；到期后可手动重试，不自动循环发请求。状态查询、领票和取消不因浏览器冷却而被阻止。异步任务的 `error.code` 也被保留；该契约没有 Retry-After 时使用 60 秒默认冷却，不假装这是上游给出的准确恢复时间。

歌单遇到限流时暂停当前批次，释放当前曲目预约，保留当前位置。冷却结束后点击“继续下载剩余曲目”，为当前曲目重新预约并继续，已完成曲目不重复下载。普通单曲失败仍跳过并继续后续曲目。恢复位置仅保存在页面内存，刷新或离开页面不会持久恢复；当前歌单或输出格式与暂停时不一致时，不沿用旧批次位置。

新增测试覆盖响应头转发、注册用户/访客的额度释放、异步错误码、冷却倒计时、禁止提前重试、歌单暂停及从当前曲目恢复。本次改动仍需独立发布到 Vercel 才会影响网站线上版本，不需要给浏览器增加 clientId 或更换服务密钥。

本轮验收：32 项针对性测试通过；真实线上 MP3 联调通过（模拟 Clerk 身份、关闭生产额度写入）；类型检查、定向 ESLint 和 Next.js 生产构建通过。构建仍有原有 Bandcamp 依赖与浏览器数据警告。按用户确认，以 PostDownloadShareCard 当前界面文案为准更新旧测试断言，未修改卡片界面。最终全量测试 196 项通过、5 项按条件跳过。没有发布 Vercel、提交 Git 或改动 UpCloud 配置。
