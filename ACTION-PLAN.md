# Geekskai PayPal SEO Action Plan

Updated: 2026-08-23

Local verification: 53/53 tests passed; TypeScript passed; 9/9 findings passed deduplication/contradiction verification. Production verification is pending deployment.

## Completed locally

| Priority | Action                                                                                                | Status      | Verification                                                                                |
| -------: | ----------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------- |
|       P0 | Align `pricing.txt`, `llms.txt`, package prices, checkout state, refunds, and PayPal Business wording | Implemented | Automated stale-copy and catalog-parity tests                                               |
|       P0 | Update the LUFS article payment state and modification date                                           | Implemented | Article regression test                                                                     |
|       P1 | Add independent Pricing and Audio Toolkit social metadata and product images                          | Implemented | Metadata source regression test and TypeScript check                                        |
|       P1 | Make global, page, breadcrumb, product, application, and author schema ownership explicit             | Implemented | Schema helper and source ownership tests                                                    |
|       P1 | Stop publishing redirecting automatic hreflang alternates                                             | Implemented | Routing regression test; rendered production headers still require post-deploy verification |
|       P1 | Give Blog and About unique metadata and page schema                                                   | Implemented | Source checks and TypeScript check                                                          |
|       P1 | Connect BlogPosting author to the About Person/ProfilePage entity                                     | Implemented | Author URL regression test                                                                  |
|       P2 | Shorten VIN metadata and remove inherited CollectionPage schema from tool details                     | Implemented | Schema ownership regression test                                                            |
|       P2 | Replace six repeated tool catalog descriptions                                                        | Implemented | Placeholder-copy regression test                                                            |
|       P2 | Add commercial SEO regression coverage                                                                | Implemented | Full local test suite                                                                       |

## Required after deployment

1. Fetch `/`, `/pricing/`, `/audio-toolkit/`, `/blog/`, `/about/`, `/terms/`, `/privacy/`, and representative tool/article pages.
2. Verify HTTP status, title, description, canonical, robots, Open Graph, Twitter, JSON-LD, and hreflang in rendered production responses.
3. Verify `/pricing.txt`, `/llms.txt`, the LUFS article, and both commercial Offer graphs describe the same PayPal state, prices, refunds, and allowance boundary.
4. Crawl every sitemap URL for status, canonical, redirect chains, indexability, and internal-link failures.
5. Validate commercial and author graphs with Schema.org and Google-compatible testing tools.
6. Export GSC coverage, queries, CTR, manual actions, CWV, and crawl statistics.
7. Collect a fresh 28-day CrUX window before treating INP, LCP, or CLS as a current problem.

## Acceptance criteria

- No public commercial source says checkout is unavailable or still onboarding.
- Pricing text, package catalog, page copy, and Offer prices agree.
- English-only commercial pages expose only valid `en` and `x-default` alternates.
- Each document has one site entity graph and only current-canonical page entities.
- BlogPosting author URLs resolve to `/about/`, not an image.
- No detail tool inherits the `/tools/` CollectionPage graph.
- The full test suite and explicit TypeScript check pass.

## Out of scope and unknown

- No deployment, commit, payment API, package price, entitlement, public URL, or historical ADR change is authorized by this batch.
- GSC, production caches, complete crawl results, current CrUX, logs, and transfer-size evidence remain unknown until the post-deploy checks above are run.
