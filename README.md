# GeeksKai Tools

<div align="center">

[![GeeksKai](public/static/images/og/geekskai-home.png)](https://geekskai.com/)

**Free online tools for developers and creators, plus a local-first audio workspace.**

[Live site](https://geekskai.com/) · [中文文档](README-CN.md) · [GitHub](https://github.com/geekskai/blog)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4.svg)](https://tailwindcss.com/)

</div>

GeeksKai is a multilingual Next.js application combining practical browser tools, an SEO-focused content system, and the Geekskai Audio Toolkit for local-first batch audio preparation.

## Product Areas

- **Online tools**: text, image, document, developer, finance, media, VIN and other focused utilities.
- **SoundCloud workflows**: track download preparation, MP3, WAV, playlist and artwork tools with localized SEO pages.
- **Audio Toolkit**: local-first audio preparation for private batch workflows.
- **Blog and guides**: MDX content with search metadata, structured data and sitemap generation.
- **Multilingual routes**: configured locale routes such as `/en/`, `/fr/`, `/es/`, `/de/`, `/ja/`, `/ko/`, `/no/` and `/zh-cn/`.

## Screenshots

Product screenshots are kept in [`screenshots/`](screenshots/).

| Desktop homepage | Mobile homepage |
| --- | --- |
| ![GeeksKai desktop homepage](screenshots/01-home-desktop.png) | ![GeeksKai mobile homepage](screenshots/02-home-mobile.png) |

The homepage OG image is [`public/static/images/og/geekskai-home.png`](public/static/images/og/geekskai-home.png). The shared site and blog fallback image is [`public/static/images/geekskai-blog.png`](public/static/images/geekskai-blog.png).

## Open Graph and SEO

OG metadata is defined close to each route so title, description, canonical URL and locale stay aligned.

- Site defaults and shared social banner: [`data/siteMetadata.js`](data/siteMetadata.js)
- Localized homepage metadata and OG image: [`app/[locale]/layout.tsx`](app/[locale]/layout.tsx)
- Tool-page metadata and Twitter cards: each `layout.tsx` under [`app/[locale]/tools/`](app/[locale]/tools/)
- SoundCloud metadata and JSON-LD: [`data/soundCloudSeo.ts`](data/soundCloudSeo.ts) and SoundCloud tool layouts
- OG assets: [`public/static/images/og/`](public/static/images/og/)
- Canonical URLs, robots and sitemap: [`app/robots.ts`](app/robots.ts), [`app/sitemap.ts`](app/sitemap.ts) and [`app/sitemap-config.ts`](app/sitemap-config.ts)

When adding a page, provide a stable canonical URL, localized title and description, an OG image with meaningful alt text, and matching Twitter Card metadata.

## Tech Stack

Next.js App Router, TypeScript, React, Tailwind CSS, Contentlayer 2, MDX, next-intl, Pliny and Vitest. Optional integrations include Neon, PayPal and Clerk.

## Local Development

Requirements: Node.js, Yarn and Python 3 for the source archive helper.

```bash
git clone https://github.com/geekskai/blog.git
cd blog
yarn
yarn dev
```

Useful checks:

```bash
yarn typecheck
yarn test
yarn build
```

`yarn build` runs Contentlayer and the production Next.js build. RSS generation is not part of the build pipeline.

## Repository Guide

```text
app/                  Next.js routes, localized tools and metadata
components/           Shared UI and product components
data/                 Site metadata, tool data and MDX content
layouts/              Blog and content layouts
lib/                  Domain logic, SEO helpers and integrations
public/static/        Logos, screenshots and OG image assets
scripts/              Maintenance and indexing utilities
screenshots/          Product screenshots used by documentation
```

Create blog content in `data/blog/` with front matter containing `title`, `date`, `tags`, `draft` and `summary`.

Copy relevant values from `.env.example` into a local `.env` file and never commit credentials. Deploy to Vercel or another Next.js-compatible host after configuring required environment variables, then verify localized metadata, OG images, sitemap and provider-backed workflows.

For a shareable source archive:

```bash
yarn archive:source
```

Keep changes scoped, preserve route and metadata conventions, and run relevant checks before submitting a pull request. The project is released under the [MIT License](LICENSE) © [GeeksKai](https://geekskai.com).
