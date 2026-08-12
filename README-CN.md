# ✨ Next.js Tailwind 博客模板 | 如果该项目对您有帮助，请给个 ⭐️谢谢！

<div align="center">

![geekskai-blog](/public/static/images/geekskai-blog.png)

[![GitHub stars](https://img.shields.io/github/stars/geekskai/blog.svg?style=social&label=Stars)](https://github.com/geekskai/blog)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/geekskai/blog)

[在线演示](https://geekskai.com/) | [English Docs](https://github.com/geekskai/blog/blob/main/README.md)

_下一代高性能、SEO友好的博客解决方案_

</div>

<div align="center">

⭐ 如果这个项目对你有帮助，请给我们一个星星，这是对我们最大的鼓励！

</div>

## 🎯 为什么选择这个模板？

- 🚀 **技术栈强大**：基于 Next.js 13+ 和 React Server Components 构建
- ⚡ **极致性能**：首次加载仅 85kB，Lighthouse 跑分接近满分
- 📱 **响应式设计**：完美适配移动端，支持亮色/暗色主题
- 🔍 **SEO 优化**：内置 SEO 最佳实践，自动生成站点地图
- 📝 **丰富内容**：支持 MDX、数学公式、引用系统等
- 🎨 **精美设计**：3种文章布局，2种列表样式，可自定义主题

## 💫 效果预览

<div align="center">
<table>
<tr>
<td>
<strong>桌面端展示</strong><br/>
<img src="/public/static/images/geekskai-blog-list.png" alt="Desktop View" width="600"/>
</td>
<td>
<strong>移动端展示</strong><br/>
<img src="/public/static/images/geekskai-blog-detail-mobile.png" alt="Mobile View" width="200"/>
</td>
</tr>
</table>
</div>

## 🚀 性能表现

<div align="center">

![Performance](/public/static/images/performance.png)

_Lighthouse 性能评分 - 展现卓越的性能指标_

</div>

## 🛠️ 技术特点

- **Next.js 13+** 配合 TypeScript，享受最新特性
- **Tailwind CSS 3.0** 轻松实现自定义样式
- **Contentlayer** 强大的内容管理系统
- **MDX** 让你的博客文章更具互动性
- **Pliny** 整合分析、评论等功能
- **Next/Font** 字体加载优化
- **Next/Image** 图片自动优化

## 📦 核心特性

### 📊 数据分析与互动

- 多种数据分析方案（支持 Umami、Plausible、百度统计等）
- 评论系统集成（支持 Giscus、Utterances、Disqus）
- 订阅集成（支持主流邮件订阅服务）
- 搜索功能（支持 Kbar、Algolia）

### 📝 内容创作增强

- 服务端代码高亮
- KaTeX 数学公式渲染
- 文献引用与参考书目
- GitHub 风格提示框
- 图片自动优化
- 多作者支持
- 文章嵌套路由

## ⚡ 快速开始

# 克隆项目

```bash
npx degit 'geekskai/blog'
```

# 安装依赖

```bash
yarn
```

请注意，如果您使用的是 Windows 操作系统，每次启动之前，需要提前运行：

```bash
$env:PWD = $(Get-Location).Path
```

# 启动开发服务器

```bash
yarn dev
```

## 🎨 个性化配置

1. 修改 `siteMetadata.js` 配置网站信息
2. 调整 `next.config.js` 配置安全策略
3. 修改 `authors/default.md` 设置作者信息
4. 编辑 `projectsData.ts` 更新项目展示
5. 自定义 `headerNavLinks.ts` 配置导航菜单

## 📝 创建文章

在 `data/blog` 目录下创建 `.md` 或 `.mdx` 文件：

```md
---
title: "文章标题"
date: "2024-02-11"
tags: ["next-js", "tailwind", "教程"]
draft: false
summary: "文章摘要"
---

文章内容...
```

## 🚀 部署指南

### Vercel 部署

部署到 Vercel需要在 Vercel [environment variables](https://vercel.com/geekskais-projects/blog/settings/environment-variables)中配置 `.env` 的环境变量：

```bash
# visit https://giscus.app to get your Giscus ids
NEXT_PUBLIC_GISCUS_REPO=
NEXT_PUBLIC_GISCUS_REPOSITORY_ID=
NEXT_PUBLIC_GISCUS_CATEGORY=
NEXT_PUBLIC_GISCUS_CATEGORY_ID=
NEXT_PUBLIC_UTTERANCES_REPO=
NEXT_PUBLIC_DISQUS_SHORTNAME=

MAILCHIMP_API_KEY=
MAILCHIMP_API_SERVER=
MAILCHIMP_AUDIENCE_ID=

BUTTONDOWN_API_KEY=

CONVERTKIT_API_KEY=
# curl https://api.convertkit.com/v3/forms?api_key=<your_public_api_key> to get your form ID
CONVERTKIT_FORM_ID=

KLAVIYO_API_KEY=
KLAVIYO_LIST_ID=

REVUE_API_KEY=

# Create EmailOctopus API key at https://emailoctopus.com/api-documentation
EMAILOCTOPUS_API_KEY=
# List ID can be found in the URL as a UUID after clicking a list on https://emailoctopus.com/lists
# or the settings page of your list https://emailoctopus.com/lists/{UUID}/settings
EMAILOCTOPUS_LIST_ID=

# Create Beehive API key at https://developers.beehiiv.com/docs/v2/bktd9a7mxo67n-create-an-api-key
BEEHIVE_API_KEY=
BEEHIVE_PUBLICATION_ID=# visit https://giscus.app to get your Giscus ids
NEXT_PUBLIC_GISCUS_REPO=
NEXT_PUBLIC_GISCUS_REPOSITORY_ID=
NEXT_PUBLIC_GISCUS_CATEGORY=
NEXT_PUBLIC_GISCUS_CATEGORY_ID=
NEXT_PUBLIC_UTTERANCES_REPO=
NEXT_PUBLIC_DISQUS_SHORTNAME=


MAILCHIMP_API_KEY=
MAILCHIMP_API_SERVER=
MAILCHIMP_AUDIENCE_ID=

BUTTONDOWN_API_KEY=

CONVERTKIT_API_KEY=
# curl https://api.convertkit.com/v3/forms?api_key=<your_public_api_key> to get your form ID
CONVERTKIT_FORM_ID=

KLAVIYO_API_KEY=
KLAVIYO_LIST_ID=

REVUE_API_KEY=

# Create EmailOctopus API key at https://emailoctopus.com/api-documentation
EMAILOCTOPUS_API_KEY=
# List ID can be found in the URL as a UUID after clicking a list on https://emailoctopus.com/lists
# or the settings page of your list https://emailoctopus.com/lists/{UUID}/settings
EMAILOCTOPUS_LIST_ID=

# Create Beehive API key at https://developers.beehiiv.com/docs/v2/bktd9a7mxo67n-create-an-api-key
BEEHIVE_API_KEY=
BEEHIVE_PUBLICATION_ID=
```

- Netlify: [![Deploy with Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/geekskai/blog)

### 静态部署

```bash
$ EXPORT=1 UNOPTIMIZED=1 yarn build
```

## 🤝 参与贡献

欢迎所有形式的贡献：

- 🐛 问题修复
- ✨ 新功能提案
- 📚 文档改进
- 🎨 界面优化

## 💖 支持项目

如果这个项目对你有帮助：

- ⭐ 给项目一个 Star
- 🐦 在社交媒体分享你的使用经验
- 💝 考虑[赞助](https://github.com/sponsors/geekskai)项目

## 📱 联系我们

- [博客](https://geekskai.com/)
- [邮箱](support@geekskai.com)

## 📄 开源协议

[MIT](https://github.com/geekskai/blog/blob/main/LICENSE) © [geeks kai](https://geekskai.com)

---

<div align="center">

由 [geeks kai](https://geekskai.com) 用 ❤️ 打造

⭐ 如果这个项目对你有帮助，请给我们一个星星，这是对我们最大的鼓励！

</div>
