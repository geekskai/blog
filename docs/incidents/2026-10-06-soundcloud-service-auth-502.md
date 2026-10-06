# Geekskai SoundCloud 服务鉴权失败事故复盘

日期：2026-10-06  
状态：原始歌曲信息请求已恢复并验证；未进行全部下载流程回归  
时间口径：全文使用 UTC+8（北京时间 / 新加坡时间）  
涉及系统：Geekskai / Vercel、独立 SoundCloud 服务 / UpCloud、Cloudflare

## 1. 结论

本次生产故障的直接原因是：**Geekskai 在 Vercel 中实际使用的服务凭证，未通过 UpCloud 下载服务的鉴权。**

UpCloud 返回 `401 unauthorized`；Geekskai 将服务间的 401 映射为 502；用户最终看到了 Cloudflare 展示的 502 错误页。

将 UpCloud 当前运行容器中已经验证有效的 `SOUNDCLOUD_SERVICE_KEY` 同步到 Vercel Production，并重新部署相同业务代码后，原始请求恢复为 `200`、`success: true`。本次修复没有修改 SDK、业务代码或 Cloudflare DNS，也没有轮换 UpCloud 密钥。

**可以确认凭证配置存在问题，但不能确定旧值具体错在哪里。**Vercel 中原来的值为 Secret，无法读回进行逐字符比较。因此，不能把“复制了错误密钥”“多填了 Bearer”“填成了 Client ID”等可能性写成已确认事实。

## 2. 业务背景：三个配置各自负责什么

```text
浏览器
  → Cloudflare
  → Geekskai / Vercel
      使用 SOUNDCLOUD_SERVICE_URL 找到下载服务
      使用 SOUNDCLOUD_SERVICE_KEY 证明调用身份
  → SoundCloud 服务 / UpCloud
      管理 SoundCloud Client ID，调用上游接口
  → SoundCloud
```

| 配置 | 使用位置 | 含义 |
| --- | --- | --- |
| `SOUNDCLOUD_SERVICE_URL` | Vercel 服务端 | 独立下载服务的地址，本次应为 `https://soundcloud.geekskai.com` |
| `SOUNDCLOUD_SERVICE_KEY` | Vercel 与 UpCloud | 两端约定的服务调用密钥，必须匹配 |
| `SOUNDCLOUD_CLIENT_ID` | UpCloud 服务端 | 访问 SoundCloud 时使用的凭证，与服务密钥是两回事 |

Vercel 中的 `127.0.0.1` 指向其自身运行环境，不能用于连接 UpCloud。不过，本次实际读取到的服务地址是正确的公网域名，没有证据表明地址配置是最终故障原因。

## 3. 用户表现与影响范围

用户在 SoundCloud 工具页面获取歌曲信息、获取歌单或开始下载时遇到失败。生产日志中明确出现鉴权错误的接口包括：

- `POST /api/soundcloud-info/`
- `POST /api/soundcloud-playlist-downloader/`
- `POST /api/download-soundcloud/`

原始验收曲目为《夜曲 / Dạ Khúc - 周杰伦 / Châu Kiệt Luân (Jay Chou)》，曲目 ID 为 `152935585`。

本次取得的日志中，最早相关错误为 19:32:25；20:07:34 对原始请求确认恢复。从已观察到的首次错误到确认恢复约 35 分钟。**这不是精确的全量故障时长**：未查询完整请求历史，实际开始时间、期间成功率与最早恢复时刻没有确定。

受影响用户数量、失败请求总量及额度记录影响未做统计。不能据此声称所有用户均受影响，也不能声称已经完成额度或数据完整性审计。

## 4. 关键证据

### 4.1 Vercel 接口明确记录鉴权失败

用户提供的 Cloudflare HTML 错误页时间为 `2026-10-06 11:50:49 UTC`，即本地时间 19:50:49。同一时间的 Vercel 生产日志为：

```text
POST /api/soundcloud-info/
SoundCloud request rejected { code: 'unauthorized', status: 502 }
```

Cloudflare 错误页是用户看到的表现。单独看到该页面不能判断根因；结合 Vercel 日志和服务端状态码映射，才能定位到服务鉴权。

### 4.2 代码解释了为什么 401 最终变成 502

[`lib/soundcloud/service.ts`](../../lib/soundcloud/service.ts) 中，Geekskai 请求独立服务时自行添加：

```ts
Authorization: `Bearer ${key}`
```

独立服务返回错误后，状态码处理为：

```ts
const status = response.status === 401 ? 502 : response.status
```

这是为了区分“Geekskai 无法通过后端服务鉴权”和“浏览器用户未登录”。此处 502 不代表用户应该重新登录，也不代表 Cloudflare 自身发生故障。

### 4.3 UpCloud 服务与当前有效密钥正常

只读检查得到以下结果，检查过程中没有输出密钥值：

| 检查 | 结果 |
| --- | --- |
| 公网 `/health` | `200 {"status":"ok"}` |
| API 容器状态 | `running` |
| API 镜像 | `soundcloud-api:20261006-01` |
| 部署配置与运行容器的服务密钥 | 一致 |
| 容器密钥是否包含首尾空白或 `Bearer ` 前缀 | 均没有 |
| 使用容器中的密钥访问公网 `/v1/soundcloud/info` 查询原曲目 | `200`，返回正确曲目信息 |

因此，本次没有证据支持“UpCloud 没启动”“容器尚未加载当前服务器配置”或“该曲目无法被服务解析”作为根因。

### 4.4 同步凭证后，相同代码恢复

修复前后使用同一提交：`c4687d52ef1e4a9c6c76450707e352e835baeb70`。

修复后，通过 `https://geekskai.com/api/soundcloud-info/` 重放原始歌曲 URL，包括原有查询参数，结果为：

```json
{
  "success": true,
  "info": {
    "id": 152935585,
    "title": "夜曲 / Dạ Khúc - 周杰伦 / Châu Kiệt Luân (Jay Chou)",
    "duration": 228718
  }
}
```

上面仅摘录相关字段。实测 HTTP 状态为 `200`，响应类型为 JSON，请求耗时约 0.995 秒。

## 5. 处理时间线

| 时间 | 事件及含义 |
| --- | --- |
| 19:12 | 预览环境额度初始化报 Neon 数据库密码认证失败。这是另一个配置问题，见下一节 |
| 19:31:39 | 初次生产部署就绪，部署 ID 为 `dpl_7F8qVgkj1hzxKEk3QHdfo9bNtLiJ` |
| 19:32 起 | 取得的生产日志开始出现 SoundCloud `unauthorized / 502` |
| 19:42:03 | Vercel Production 的服务密钥配置更新 |
| 19:44:46 | Vercel Production 的服务地址配置更新 |
| 19:44:55 | 一次重新部署开始，部署 ID 为 `dpl_GCoqC64UrtuPAYgQ7CAoR65sWBee` |
| 19:49–19:50 | 首次复测时，域名查询仍返回旧部署；随后新部署完成切换 |
| 19:50:13 | 上述新部署就绪 |
| 19:50:49 | 新部署仍记录 `unauthorized / 502`，与用户提供的 Cloudflare 错误页时间对应 |
| 后续排查 | 确认服务地址正确；UpCloud 配置与运行容器密钥一致；用容器密钥调用公网曲目信息接口成功 |
| 20:01:31 | 将已验证有效的 UpCloud 密钥同步至 Vercel Production 的既有 Secret |
| 20:02:14 | 基于相同线上提交再次部署，部署 ID 为 `dpl_FSAbXop5zNYQjhzjrUzCoHS9Euzr` |
| 20:05:12 | 构建日志记录部署完成；随后确认 `geekskai.com` 已指向该部署 |
| 20:07:34 | 原始歌曲信息请求返回 `200 / success: true`，确认本次 502 修复 |

## 6. 与之前 Neon 额度故障的区别

这次排查过程中先后出现了两个独立问题：

| 问题 | 环境 | 直接错误 | 所属环节 |
| --- | --- | --- | --- |
| 下载额度初始化失败 | Vercel Preview | `password authentication failed for user 'neondb_owner'` | Geekskai → Neon 数据库 |
| SoundCloud 请求返回 502 | Vercel Production | `unauthorized` | Geekskai → UpCloud 下载服务 |

前者涉及 `DATABASE_URL`；后者涉及 `SOUNDCLOUD_SERVICE_KEY`。本报告的修复与验收针对后者，不能用歌曲信息接口恢复来证明预览数据库问题也已解决。

## 7. 原因分析与排查反思

### 已确认的技术原因

1. Vercel 调用独立服务时使用的凭证未被接受。
2. 在同步有效密钥之前，即使重新部署，鉴权仍然失败。
3. 同步有效密钥并部署后，相同代码、相同歌曲请求恢复。

由此可以判定服务凭证配置是本次修复点；不需要修改解析算法、轮换 SoundCloud Client ID 或调整 DNS 来解决这次故障。

### 配置生效带来的排查干扰

修改 Vercel 环境变量和让新生产部署接管域名是两个步骤。曾有一段时间变量已经更新，但新部署仍在构建，当前域名仍使用旧部署。这解释了当时的检查结果，却不能解释之后新部署仍然失败。

首次反馈中，将“当前域名仍指向旧部署”直接归纳为需要重新部署，说明不够完整：用户当时已经启动重新部署，只是尚未切换。更准确的做法是同时检查当前域名指向和正在构建的部署，避免让用户重复发起部署。

### 发布验证的不足

本次生产发布没有被“Vercel 到 UpCloud 的真实鉴权失败”有效拦住。构建成功、单元测试通过、UpCloud `/health` 正常，都不足以证明生产环境中的服务密钥匹配。

本次未全面审计 CI 配置，因此这里描述的是实际暴露出的验证缺口，不声称项目完全没有发布检查。

### 未查明的信息

- Vercel 旧 Secret 的具体内容及其与正确值的差异。
- 是录入错误、使用了其他环境的密钥，还是其他配置操作导致差异。
- 精确故障起止时间、用户数量和所有下载任务的结果。

复盘依据为本次实际请求、Vercel 部署元数据与日志、UpCloud 只读检查和当前接口代码。没有记录密钥、Cookie 或数据库连接串。

## 8. 已完成的修复与验证边界

| 项目 | 结果 |
| --- | --- |
| 核对 UpCloud 当前配置及容器密钥 | PASS |
| 用有效密钥从公网查询原曲目 | PASS |
| 核对 Vercel 服务地址 | PASS |
| 同步 Vercel Production 服务密钥，保留 Secret 类型 | 已完成 |
| 使用相同代码重新部署并确认生产域名切换 | PASS |
| Geekskai 原始歌曲信息请求 | PASS，HTTP 200，约 1 秒 |
| 修复后完整歌曲文件下载、歌单批量下载、额度结算 | 本次未重新验收 |
| 修复前失败请求是否影响额度记录 | 本次未审计 |

本次仅变更 Vercel 生产环境变量并重新部署，没有修改业务代码或创建 Git 提交。UpCloud 服务未重启，原有运行密钥保持不变。

## 9. 后续预防措施（建议，尚未实施）

| 优先级 | 措施 | 验收标准 |
| --- | --- | --- |
| P0 | 在生产推广前验证服务鉴权 | 使用部署环境的实际密钥查询一首有权访问的固定曲目；只有返回 200 且响应结构有效才继续推广 |
| P0 | 发布后通过正式域名做冒烟测试 | 从 `geekskai.com` 调用信息接口，确认 200、部署 ID 与预期一致；不能只检查 `/health` |
| P0 | 明确配置来源、环境与负责人 | 将 URL、Service Key、Client ID 分开说明；Preview 与 Production 各自登记用途，密钥仅存放在授权的秘密存储中 |
| P1 | 为服务鉴权失败设置告警 | 监控 `unauthorized / 502`，日志能关联请求与部署，但不输出 Authorization 或密钥 |
| P1 | 记录环境变量更新与部署的关联 | 确认新部署在配置更新后创建，Ready 后正式域名已切换；旧部署回滚时重新核对其凭证快照 |
| P1 | 补齐真实下载验收 | 单曲下载、歌单逐曲下载、失败后的额度释放分别记录结果 |

日常代码发布不需要重新生成服务密钥。只有主动轮换时才同步更新调用方和服务方，并安排验证与回退；不能把“随机生成一份新的 Vercel 密钥”当成连接已有 UpCloud 服务的方法。

相关集成说明：[`docs/integrations/soundcloud-service.md`](../integrations/soundcloud-service.md)。
