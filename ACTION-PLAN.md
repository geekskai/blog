# Geekskai SEO Action Plan

Audit target: https://geekskai.com/  
Audit date: 2026-08-02

## Prioritized execution order

| Priority | Status | Action | Impact | Cost | Dependency / verification |
|---:|---|---|---|---|---|
| P0 | 已确认 | Fix localized homepage article hrefs so they no longer point to `/[locale]/blog/...` 404s | Very high | Low | Re-crawl every locale homepage; assert all visible internal links return a real indexable page |
| P0 | 已确认 | Self-canonicalize `/about/` and render page-specific WebPage schema | Very high | Low | Inspect live canonical and JSON-LD after deploy; request validation/indexing in GSC |
| P1 | 已确认 | Stop inheriting homepage/CollectionPage JSON-LD onto detail pages; dedupe Organization and breadcrumbs | High | Medium | Validate homepage, About, Blog, tools index and three tool templates in Rich Results/Schema validator |
| P1 | 已确认 | Rewrite Blog, About, homepage and VIN metadata | High | Low | Check rendered title, description, canonical, OG and Twitter tags on live pages |
| P1 | 已确认 | Fix BlogPosting author entity | High | Low | `author.url` resolves to author/About page; Person/ProfilePage uses a stable `@id` |
| P1 | 已确认 | Improve the EHS comparison article's evidence and structure | High | Medium | Publish methodology, sources, disclosures, comparison table and semantic H2/H3; re-run readability |
| P1 | 已确认 | Reduce mobile INP from 259 ms to ≤200 ms | High | Medium–High | Use CrUX/GSC interaction breakdown, profile long tasks, then wait for 28-day field validation |
| P2 | 已确认 | Replace repeated tool schema descriptions with unique task-focused copy | Medium | Medium | Check schema text matches visible page claims and has no repeated placeholders |
| P2 | 已确认 | Resolve mixed-language article cards on localized homepages | Medium | Medium | Translate cards/targets or label/link them as English; validate hreflang and user journey |
| P2 | 可能问题 | Rewrite and automate freshness checks for `llms.txt` | Medium | Low | Verify live endpoint; align entity, tool count, canonical URLs and author signals |
| P3 | 未知项 | Run a full external crawl and header/image audit | Medium | Medium | Requires live robots/sitemap access, response headers, transfer sizes and all URLs |
| P3 | 未知项 | Use GSC and server logs to prioritize remaining work | High potential | Medium | Export indexing, query, CTR, CWV, crawl-stat and log evidence before expanding content |

## Phase 1 — Immediate blockers

### 1. Localized article links

Success criteria:

- No locale homepage emits a localized blog URL unless that localized article exists.
- Every featured article link returns a normal article page, not the `noindex` 404 template.
- Automated tests cover all supported locales and visible homepage cards.

### 2. About canonical and entity schema

Success criteria:

- `/about/` canonical is exactly `https://geekskai.com/about/`.
- Its WebPage `url` and `@id` describe `/about/`, not `/`.
- The author Person/ProfilePage entity links to the About URL.

## Phase 2 — High-impact template fixes

### 3. Metadata ownership

- Blog title describes articles/guides, not free tools.
- Blog description is unique and concise.
- About title and description identify Geeks Kai, expertise and editorial method.
- Homepage description is complete and approximately 140–160 characters.
- VIN title is approximately 50–60 characters and description approximately 140–160.

### 4. Schema ownership

- One Organization and one WebSite graph per document.
- One current-page WebPage subtype per page.
- One BreadcrumbList that matches the visible/current URL.
- CollectionPage stays on collections; WebApplication stays on tool details.
- BlogPosting author resolves to a profile, not an image.

### 5. Evidence-first editorial quality

- State how products were selected and ranked.
- Link to primary vendor documentation for factual claims.
- Disclose sponsorship, affiliate or editorial relationships.
- Add a sourced comparison table.
- Use H2 for major sections and H3 for products/questions.
- Add concise direct-answer paragraphs before detail.

## Phase 3 — Performance and GEO

### 6. INP

Start with the interactions actually contributing to the 259 ms field value. Profile search, navigation/locale controls, authentication UI, animation and hydration. Remove or defer nonessential client work and split long tasks. Do not claim success from a single lab run; verify the 28-day field metric.

### 7. GEO

- Make `llms.txt` describe the live product, not the repository template.
- Link canonical user-facing pages rather than internal PRDs as the primary navigation.
- Keep tool counts and claims generated from the same source as the live directory.
- Prioritize cited, answer-first, semantically structured content over adding more schema types.

## Phase 4 — Close unknowns

After P0/P1 deploys:

1. Fetch and archive live robots, sitemap and llms responses.
2. Run a full crawl respecting robots and check status, canonical, hreflang, indexability and internal link depth.
3. Validate live response headers, compression and caching.
4. Run page-level image transfer-size and dimension checks.
5. Export GSC indexing, queries, CTR, CWV and crawl stats.
6. Re-score only after these unknowns become evidence.
