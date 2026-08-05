# Geekskai SEO Full Audit

Audit target: https://geekskai.com/  
Audit date: 2026-08-02  
Scope: Full-site sample audit covering technical SEO, content quality, on-page SEO, structured data, performance, images, international SEO, and GEO/AI-search readiness.

## A. Audit summary

**Directional SEO health score: 46/100 — Poor. Score confidence: Low.**

The site has a solid baseline—HTTPS, one H1 on sampled templates, index/follow controls, mostly self-canonicals, descriptive image alt text, hreflang on localized landing pages, and valid JSON-LD syntax. The score is pulled down by two confirmed crawl/indexing defects, inconsistent page metadata and schema inheritance, weak evidence/citability in a sampled commercial article, and a failed mobile Core Web Vitals assessment caused by INP.

Top confirmed issues:

1. `/zh-cn/` links to six `/zh-cn/blog/...` URLs that all render the `noindex` 404 page.
2. Indexable `/about/` canonicals to `/`, risking consolidation or exclusion of the site's primary trust page.
3. Mobile field CWV fails: LCP 1.7 s, INP 259 ms, CLS 0.03. INP is the failing metric.

Top opportunities:

1. Fix localized article href generation and add automated link tests.
2. Correct page-specific canonical, metadata and JSON-LD inheritance for About, Blog and tool detail pages.
3. Make comparison content verifiable and citable with methodology, primary sources, semantic headings and concise answer blocks.

### Category scores

Scores are directional, use only observed evidence, and follow the skill rubric's positive/deficit signal and severity-penalty approach.

| Category | Score | Weight | Main positive signals | Main penalties |
|---|---:|---:|---|---|
| Technical SEO | 37 | 25% | HTTPS; one H1; index/follow; mostly self-canonical; hreflang | Six localized 404 links; About canonical points home |
| Content quality | 40 | 20% | Long-form article; date/author; About/editorial content | No primary-source citations; unsupported ranking claims; very difficult readability; mixed-language cards |
| On-page SEO | 34 | 15% | Unique H1s; internal links; OG images | Generic Blog/About metadata; malformed homepage description; long VIN metadata; missing semantic article headings |
| Schema | 34 | 15% | Valid JSON-LD; BlogPosting; WebApplication; BreadcrumbList | Homepage/Collection schema inherited on inner pages; duplicate graphs; author URL points to image; boilerplate descriptions |
| Performance | 75 | 10% | Good LCP, CLS, FCP and TTFB | INP 259 ms fails mobile CWV |
| Images | 90 | 10% | No missing alt in sampled templates; Next Image delivery; OG images | Full byte-size and format audit unavailable |
| GEO / AI readiness | 35 | 5% | Source config allows major AI crawlers; `llms.txt` exists in repo; JSON-LD present | Weak citations and passage structure; likely stale/misaligned `llms.txt`; templated schema copy |

Weighted result: approximately 46/100.

## Evidence base

### Live evidence collected

- DOM and metadata sampled on `/`, `/blog/`, one 1,697-word article, `/tools/`, `/tools/vin-decoder/`, `/about/`, `/zh-cn/`, and localized sign-in/404 states.
- Six localized article targets followed from `/zh-cn/` and checked individually.
- Desktop and 390×844 mobile screenshots captured and inspected.
- PageSpeed Insights field data for the latest 28-day period read on 2026-08-02.
- JSON-LD blocks parsed from live pages.
- Bundled readability analysis run against browser-captured article HTML.

### Repository evidence collected

- `app/robots.ts`, `app/sitemap.ts`, `public/llms.txt`, root metadata and blog metadata inspected.
- Repository evidence is not treated as proof that the same response is deployed live.

## B. Findings table

| Area | Severity | Status / confidence | Finding | Evidence | Fix |
|---|---|---|---|---|---|
| Technical SEO | Critical | 已确认 / Confirmed | zh-CN homepage sends crawlers to six localized 404 articles | Every `/zh-cn/blog/...` target showed `Page Not Found`, `noindex` | Link to canonical English articles or publish actual translations; add route/link tests |
| Technical SEO | Critical | 已确认 / Confirmed | `/about/` canonical points to homepage | Live page: `index, follow`; canonical `https://geekskai.com/` | Self-canonicalize `/about/`; make WebPage `url`/`@id` page-specific |
| Performance | Warning | 已确认 / Confirmed | Mobile CWV fails on INP | Field data: LCP 1.7 s, INP 259 ms, CLS 0.03, FCP 1.8 s, TTFB 0.5 s | Profile long tasks and interaction handlers; reduce client JS; verify by interaction in CrUX/GSC |
| On-page | Warning | 已确认 / Confirmed | `/blog/` reuses homepage title/description and has no JSON-LD | Title `GeeksKai – Free Online Tools and Useful Utilities`; 178-char homepage description; zero JSON-LD | Add Blog-specific metadata and CollectionPage/ItemList/Breadcrumb JSON-LD |
| On-page | Warning | 已确认 / Confirmed | Homepage description is long and incomplete | 178 chars; ends with `Tools that your workflow`; reused in OG/Twitter | Rewrite as one complete, specific 140–160-character proposition |
| On-page | Warning | 已确认 / Confirmed | About metadata is generic | Title `About`; generic 178-char tools description | Name the author, expertise, editorial approach and site purpose |
| On-page | Warning | 已确认 / Confirmed | VIN metadata is likely to truncate | Title 66 chars; description 187 chars | Shorten while retaining VIN decoder and vehicle lookup intent |
| Schema | Warning | 已确认 / Confirmed | Inner pages inherit unrelated or duplicate schema | VIN page includes homepage WebPage, tools CollectionPage, two BreadcrumbLists and two Organizations; About includes homepage WebPage graph | Centralize one Organization/WebSite graph; render one current-page graph and one breadcrumb |
| Schema | Warning | 已确认 / Confirmed | Article author URL points to avatar image | `author.url=https://geekskai.com/static/images/avatar.jpg` | Link to an author/About profile and connect Person/ProfilePage by `@id` |
| Schema / content | Warning | 已确认 / Confirmed | Tool ItemList descriptions repeat low-information phrases | Several descriptions repeat the same phrase three times | Write unique input/output/constraint descriptions for each tool |
| Content | Warning | 已确认 / Confirmed | Sampled EHS ranking has no primary-source citations | Ten vendors ranked; only external links are author X, discussion and GitHub source; no vendor/evidence links or comparison table | Publish methodology, criteria, first-party sources, disclosures and a sourced comparison table |
| Content / GEO | Warning | 已确认 / Confirmed | Article is hard to read and lacks semantic section headings | Flesch 5.2, grade 17.7, 33.1% complex words; no content H2/H3 for product sections, conclusion or FAQ | Use H2/H3 hierarchy, shorter sentences and answer-first summaries |
| International SEO | Warning | 已确认 / Confirmed | zh-CN homepage mixes Chinese chrome with English cards | `lang=zh-cn`; Chinese H1/description; six English article titles | Translate cards or clearly label them English and link to English canonical pages |
| GEO | Warning | 可能问题 / Likely | Repository `llms.txt` appears stale and product-misaligned | Calls the site a Next.js template and says 30+ tools; live ItemList declares 50; live endpoint could not be read | Rewrite around live user tasks, canonical URLs, authorship and short citable descriptions; add freshness test |
| Images | Pass | 已确认 / Confirmed | Sampled images have alt attributes and responsive delivery | Zero missing/empty alt across sampled templates; Next Image and OG images present | Preserve with CI; measure bytes and dimensions separately |
| Technical baseline | Pass | 已确认 / Confirmed | Most sampled indexable pages have sound baseline tags | HTTPS, one H1, index/follow and expected canonical on all sampled pages except About | Add template-level regression tests |

## C. Detailed findings

### Technical SEO and international routing

The highest-impact defect is deterministic: `/zh-cn/` renders six localized article hrefs, but the localized blog routes do not exist. All six tested targets are the site's `noindex` 404 template. This is not a hypothetical crawl issue; it is a live internal-link failure. The repository's robots configuration also treats localized blog paths as English-only disallowed sections, reinforcing that these hrefs should never be generated.

The About canonical is also directly wrong. Because `/about/` is indexable, a homepage canonical can cause its author/editorial-trust content to be consolidated away from the URL where it belongs.

Positive baseline: sampled indexable pages use HTTPS, one H1, explicit `index, follow`, and self-canonicals except About. The localized homepage has a self-canonical and 11 hreflang entries.

### Content quality and E-E-A-T

The sampled EHS article is substantial at about 1,697 words and exposes an author and dates, but the commercial ranking is not auditable. It ranks ten vendors and states that BIS is best without linking to vendor documentation, defining a reproducible scoring method, showing first-hand testing, or disclosing commercial relationships. This is a trust and GEO weakness, not a word-count problem.

The page is also extremely difficult to read by the bundled test (Flesch 5.2; grade 17.7), and its visible product-section labels are not semantic headings. Answer engines can quote well-structured passages more reliably than a flat sequence of paragraphs.

### On-page SEO

The Blog index is positioned as a tools homepage in title and description. About has a one-word title and the same generic tools description. The homepage description is both overlong and grammatically incomplete, and the VIN tool's title/description are likely to truncate. These are low-cost template fixes with direct snippet and intent benefits.

### Schema

The site emits valid JSON syntax and useful types, but schema ownership is unclear. Tool details inherit the tools CollectionPage and homepage WebPage graph, while also adding their own WebApplication and breadcrumb. About similarly inherits a homepage WebPage/Breadcrumb graph. Use stable site-level entities once, and make every page-level entity describe the current canonical URL only.

The sampled BlogPosting's `author.url` is an image asset. It should resolve to a profile page that carries Person/ProfilePage and expertise evidence.

### Performance

Real-user mobile data is stronger evidence than a one-off lab run. The latest 28-day PageSpeed report fails CWV only on INP: LCP 1.7 s and CLS 0.03 are good, while INP is 259 ms. The lab Lighthouse result failed to retrieve, so no lab performance score or opportunity byte estimates are claimed.

### Images

Image hygiene is a relative strength in the sample: no missing/empty alt attributes were found, Next Image URLs were used, and OG images were set. A full image byte audit was not possible, so oversized source assets, modern-format coverage and rendered-vs-intrinsic dimensions remain unknown.

### GEO / AI-search readiness

The source repository explicitly allows GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot and Google-Extended. That is a positive implementation signal, but the live robots response could not be read in this environment.

The repository `llms.txt` is likely misaligned with the production product: it frames GeeksKai as a Next.js template, emphasizes GitHub PRDs and APIs, and claims 30+ tools while the live ItemList declares 50. More importantly, the site's comparison content lacks cited, compact, semantically headed answer passages—the content signals that matter more than merely having an `llms.txt` file.

## Visual audit steps

1. **Desktop homepage — generally healthy.** Clear hero, strong contrast, visible navigation and trust links. The page's product identity is split between personal portfolio, tools and editorial content, which weakens the primary topic signal.
2. **Mobile homepage at 390×844 — generally healthy.** Navigation collapses correctly; the hero, code card, social icons and CTAs fit without horizontal document overflow. The full-page capture showed repeated/blank regions, but the normal viewport capture was correct, so this was not promoted to a confirmed site issue.

Screenshots:

- `screenshots/01-home-desktop.png`
- `screenshots/03-home-mobile-viewport.png`

## D. Unknowns and follow-ups

The following are **未知项 / Unknown**, not site failures:

- Live `robots.txt`, `sitemap.xml` and `llms.txt` responses: direct script fetch was blocked by the environment's reserved-IP safety layer; the in-app browser blocked text/XML endpoints.
- Whole-site crawl totals, redirect chains and broken links outside the six localized article targets.
- Live HTTP security/cache headers and compression behavior.
- Live sitemap URL count, status-code cleanliness, hreflang reciprocity and lastmod accuracy.
- Lighthouse lab score/opportunities: PageSpeed returned field data but reported `failed to retrieve the LHR`.
- Google Search Console indexing, crawl stats, queries, CTR, manual actions and enhancement reports.
- Server logs, backlinks, rankings, conversions and competitor benchmarks.
- Full image transfer sizes, modern-format coverage and image-CDN cache performance.
- Full translation quality and duplicate-content assessment across every locale/tool combination.

## Environment limitations

Bundled network scripts were attempted once normally and once with approved external network access. They could not fetch the site because the environment resolved the host to a reserved/internal IP and blocked the request. Those failures are environment limitations and were not counted as site issues. Browser-rendered evidence and PageSpeed field data were used where available.
