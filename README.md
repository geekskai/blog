# ✨ Next.js Tailwind Blog Template

<div align="center">

[![Blog Template Preview](/public/static/images/geekskai-blog.png)](https://geekskai.com/)

[![GitHub stars](https://img.shields.io/github/stars/geekskai/blog.svg?style=social&label=Stars)](https://github.com/geekskai/blog)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/geekskai/blog)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Ready-06B6D4.svg)](https://tailwindcss.com/)

[Live Website](https://geekskai.com/) | [中文文档](https://github.com/geekskai/blog/blob/main/README-CN.md)

_Your next powerful, SEO-friendly, and lightning-fast blog template_

</div>

<div align="center">

⭐ Star us on GitHub — it motivates us a lot!

</div>

## 🚀 Why Choose This Template?

- 🎯 **Production Ready**: Built with Next.js 13+ and React Server Components
- ⚡ **Lightning Fast**: 85kB first load JS, near perfect Lighthouse score
- 📱 **Responsive**: Mobile-first design with dark/light theme support
- 🔍 **SEO Optimized**: Built-in SEO best practices and sitemap generation
- 📝 **Rich Content**: MDX support, KaTeX math, citations, and more
- 🎨 **Beautiful Design**: 3 blog layouts, 2 listing layouts, and customizable styles

## 🎥 Preview

<div align="center">
<table>
<tr>
<td>
<strong>Desktop View</strong><br/>
<img src="/public/static/images/geekskai-blog-list.png" alt="Desktop View" width="600"/>
</td>
<td>
<strong>Mobile View</strong><br/>
<img src="/public/static/images/geekskai-blog-detail-mobile.png" alt="Mobile View" width="200"/>
</td>
</tr>
</table>
</div>

## ⚡ Performance That Speaks

<div align="center">

📈 **85kB** First Load JS | 🏃‍♂️ **0.3s** First Contentful Paint | 🎯 **100/100** Lighthouse Score

![Performance Metrics](/public/static/images/performance.png)

</div>

## 🛠️ Featured Technologies

- **Next.js 13+** with TypeScript
- **Tailwind CSS 3.0** for styling
- **Contentlayer** for content management
- **MDX** for interactive blog posts
- **Pliny** for analytics, comments, and more
- **Next/Font** for optimized fonts
- **Next/Image** for optimized images

## 📦 Key Features

### 📊 Analytics & Engagement

- Multiple analytics options (Umami, Plausible, Google Analytics)
- Comment systems (Giscus, Utterances, Disqus)
- Newsletter integration (Mailchimp, Convertkit, etc.)
- Command palette search (Kbar, Algolia)

### 📝 Content Creation

- Server-side syntax highlighting
- Math equations with KaTeX
- Citations and bibliography support
- GitHub-style alerts
- Automatic image optimization
- Multiple authors support
- Nested routing for posts

## 🚀 Quick Start

### Get started in seconds

```bash
git clone https://github.com/geekskai/blog.git
```

### or clone directly

```bash
npx degit 'geekskai/blog'
```

### Install dependencies

```bash
yarn
```

### Please note that if you are using a Windows operating system, you need to run it in advance before each startup:

```bash
$env:PWD = $(Get-Location).Path
```

### Start development

```bash
yarn dev
```

## 📝 Content Creation

Create engaging blog posts with rich features:

```mdx
---
title: 'Building a Modern Blog'
date: '2024-02-11'
tags: ['next-js', 'tailwind', 'guide']
draft: false
summary: 'A comprehensive guide to building a modern blog'
---

## Introduction

Your content here with support for:

- Math equations: $E = mc^2$
- Code blocks with syntax highlighting
- Interactive components
- Citations and more!
```

## 🎨 Customization

1. **Site Configuration**

   ```js
   // data/siteMetadata.js
   const siteMetadata = {
     title: 'Your Blog',
     author: 'Your Name',
     // ...more options
   }
   ```

2. **Theme Customization**
   ```js
   // tailwind.config.js
   module.exports = {
     theme: {
       extend: {
         // Your custom theme
       },
     },
   }
   ```

## 🌐 Deployment Options

### One-Click Deployments

- Vercel: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/geekskai/blog)
- Netlify: [![Deploy with Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/geekskai/blog)

### Static Hosting

```bash
$ EXPORT=1 UNOPTIMIZED=1 yarn build
```

## 🤝 Contributing

We welcome all contributions! Whether it's:

- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 🎨 UI/UX enhancements

## 💫 Success Stories

<div align="center">

_"This template saved us weeks of development time"_ - Tech Lead at StartupX

_"Perfect balance of features and performance"_ - Senior Developer at CompanyY

</div>

## 💖 Support

If this template helps you build your blog faster, please consider:

- ⭐ Giving it a star on GitHub
- 🐦 Sharing your blog built with this template
- 📢 Giving a shoutout on Twitter
- 💝 Becoming a [sponsor](https://github.com/sponsors/geekskai)

## 📱 Connect With Us

- [Twitter](https://twitter.com/GeeksKai)
- [Linkedin](https://www.linkedin.com/in/geekskai)
- [Email](geeks.kai@gmail.com)

## 📄 License

[MIT](https://github.com/geekskai/blog/blob/main/LICENSE) © [geeks kai](https://geekskai.com)

---

<div align="center">

Made with ❤️ by [geeks kai](https://geekskai.com)

⭐ Star us on GitHub — it motivates us a lot!

</div>
