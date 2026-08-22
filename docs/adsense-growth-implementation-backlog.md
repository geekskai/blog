# Geekskai acquisition implementation backlog

## Scope and evidence boundary

This backlog tracks the confirmed acquisition-first, ad-free strategy. The first Discord/time repair sprint is now implemented locally; no third-party dashboard was changed and the measurement window does not begin until deployment.

Confirmed first-party performance evidence currently available:

- Supplied 28-day Web Search Console export: 15.2K clicks and 376K impressions. Supplied three-month Web Search Console export: 19,837 clicks, 625,691 impressions, 3.17% CTR, and average position about 9.9. Both exports record Web Search and their respective date filters.
- The three-month page table attributes 18,874 clicks and 405,633 impressions to downloader URLs. It does not reconcile exactly with chart totals because Search Console page tables and charts aggregate differently and tables are row-limited; it is sufficient to prove downloader dominance and exclude those rows from eligible-cluster prioritization.
- The selected first acquisition cluster is Discord/time. Across localized page rows it has 15 clicks and 12,032 impressions over three months; the English Discord Time Converter has 8,392 impressions, the English Discord Timestamp Generator has 2,695, and `time zone converter discord` has 2,661 impressions at average position 8.64 with no clicks.
- Tip Screen is the strongest isolated non-downloader tool at 100 clicks and 5,525 impressions, but it is not the first cluster because it lacks a coherent three-tool path and carries greater fake-interface and ad-placement risk.
- Recorded Clarity baseline: 1.33 pages per session, 31.81% average scroll, 18.80% dead-click sessions, LCP 2.6 s, INP 280 ms, and CLS 0.19.
- Repository evidence: the tools directory mixes unrelated categories; `app/[locale]/tools/page.tsx` contains an unverified `25K+` claim and other TODO statistics; `data/toolNavigation.ts` hard-codes a tool count; Pricing is still referenced by navigation, footer, sitemap, `llms.txt`, `pricing.txt`, downloader, account, workspace, and content surfaces.

Gate 0 is complete for the supplied 28-day and three-month periods. A 12-month export and query-by-page API join would improve confidence but no longer block the first repair sprint. The selected cluster remains an evidence-backed experiment until post-change CTR and Successful Tool Outcomes validate it.

## Priority model

- **P0:** blocks trustworthy prioritization or creates an immediate trust/policy contradiction.
- **P1:** required foundation for measuring and improving the selected cluster.
- **P2:** cluster implementation after first-party evidence selects it.
- **P3:** controlled expansion after the cluster baseline is stable.
- **P4:** AdSense test only after the agreed readiness threshold.

Effort is relative: **S** up to one focused day, **M** two to five days, **L** more than five days or dependent on several surfaces.

## Gate 0 — real GSC decision packet

| ID     | Work                                                                                              | Priority | Effort | Dependency                        | Acceptance criteria                                                                                                                                              |
| ------ | ------------------------------------------------------------------------------------------------- | -------- | ------ | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GSC-01 | Export Web Search query data for the latest 28 days and 3 months; obtain 12 months when available | P0       | S      | Read-only Search Console access   | **Partially complete:** supplied periods contain query, clicks, impressions, CTR, position, and recorded filters; 12 months remains optional follow-up           |
| GSC-02 | Export landing-page data for supplied periods                                                     | P0       | S      | GSC-01                            | **Complete:** both exports contain canonical page, clicks, impressions, CTR, and position                                                                        |
| GSC-03 | Export country and device breakdowns for the latest 3 months                                      | P0       | S      | GSC-01                            | **Complete:** English-priority markets and desktop/mobile opportunity are recorded without assuming RPM                                                          |
| GSC-04 | Classify material landing pages by portfolio category                                             | P0       | S      | GSC-02                            | **Complete:** downloader, content, Discord/time, VIN/vehicle, converter, data/document, text/font, generator, and other rows are separated                       |
| GSC-05 | Separate brand queries and policy-ineligible/downloader entrances                                 | P0       | S      | GSC-01–04                         | **Complete for page-level decisions:** downloader URLs are excluded; query typos and privacy-hidden rows mean API-level north-star reporting remains future work |
| GSC-06 | Score candidate clusters using the agreed model                                                   | P0       | M      | GSC-01–05; external SERP research | **Complete:** Discord/time is the winner; Norwegian measurement conversion is runner-up; Tip Screen is a separate page-level experiment                          |

### Gate 0 output

Produce one table containing, for each candidate cluster:

- non-brand clicks and impressions;
- number of pages and queries ranking 5–20;
- weighted CTR by position band;
- English-priority market share;
- downloader/policy exclusions;
- build and maintenance estimate;
- final score and evidence confidence.

Do not begin a new tool or homepage redesign until GSC-06 selects the first cluster.

## P0 — independent trust and strategy alignment

These tasks do not depend on knowing the winning cluster, but still require explicit implementation authorization.

| ID       | Work                                                                                               | Effort | Dependencies                      | Repository evidence                                                                                 | Acceptance criteria                                                                                                                    |
| -------- | -------------------------------------------------------------------------------------------------- | ------ | --------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| TRUST-01 | Remove unverified social-proof counters from the tools directory                                   | S      | None                              | `app/[locale]/tools/page.tsx` contains `25K+` and TODO statistics                                   | No public usage, user, reliability, or performance number appears without a reproducible source and period                             |
| TRUST-02 | Derive the public tool count from one canonical data source                                        | S      | None                              | `data/toolNavigation.ts` hard-codes `TOOL_COUNT = 51`; the directory separately uses `tools.length` | Header, directory, and other count surfaces cannot drift from the same source                                                          |
| PRICE-01 | Remove Pricing from primary navigation and footer promotion                                        | S      | Confirmed Dormant Pricing Surface | `data/headerNavLinks.ts`, `components/Header.tsx`, and `components/SiteFooter.tsx` link to Pricing  | No primary discovery path promotes a paused paid product; account recovery remains functional                                          |
| PRICE-02 | Remove Pricing and `pricing.txt` from indexable discovery                                          | S      | PRICE-01                          | `app/sitemap-config.ts`, `public/llms.txt`, and `public/pricing.txt` promote Pricing                | Pricing has `noindex`; sitemap and AI-discovery files do not present an active offer                                                   |
| PRICE-03 | Replace residual acquisition links to Pricing with an appropriate free-tool or account destination | M      | PRICE-01                          | Links exist in downloader quota, account billing, workspace, Terms, and audio content               | No user journey promises purchasable Basic or Pro; dormant billing administration remains reachable only where operationally necessary |

## P1 — measurement and current-site repair

| ID      | Work                                                                                   | Effort | Dependency      | Acceptance criteria                                                                                                                                                                             |
| ------- | -------------------------------------------------------------------------------------- | ------ | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DATA-01 | Define one privacy-safe tool lifecycle event contract                                  | S      | None            | **Implemented locally:** stable start, success, failure, copied-result, and related-tool events permit only tool ID, action, format, and result count                                           |
| DATA-02 | Instrument the selected cluster                                                        | M      | GSC-06, DATA-01 | **Implemented locally:** both English Discord tools emit privacy-safe lifecycle/copy/navigation events; unit tests cover GA/dataLayer deduplication and server rendering                        |
| DATA-03 | Build a 28-day acquisition dashboard specification                                     | S      | DATA-01         | **Specified:** `docs/discord-time-cluster-28-day-baseline-2026-08-22.md` defines pre-change GSC baselines, event formulas, segments, guardrails, and the deployment-dependent evaluation window |
| SEO-01  | Revalidate the historical localized-link and About canonical findings before editing   | S      | None            | Live evidence confirms whether `/zh-cn/` broken links and `/about/` canonical defects still exist; stale findings are closed without code changes                                               |
| PERF-01 | Revalidate mobile interaction and layout-shift baselines on the selected landing pages | M      | GSC-06          | Current field/lab evidence identifies the actual interaction causing poor INP or CLS; no source defect is claimed from an old aggregate alone                                                   |
| UX-01   | Audit dead clicks on the selected cluster                                              | M      | GSC-06          | Each high-frequency dead-click target is mapped to an exact URL and element; false positives are separated from confirmed defects                                                               |

## P2 — first single-cluster sprint

| ID         | Work                                                                                             | Effort | Dependency          | Acceptance criteria                                                                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------ | ------ | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CLUSTER-01 | Specify the Discord/time cluster around scheduling one moment correctly for every Discord member | S      | GSC-06              | **Complete:** the two tools and guide have explicit intent boundaries and copy is the primary successful outcome                                                     |
| CLUSTER-02 | Separate or consolidate the two overlapping English tool intents before adding a new tool        | M      | CLUSTER-01, DATA-02 | **Strict differentiation implemented locally:** converter owns named-timezone conversion/decoding; generator owns creation/presets; both retain their own canonicals |
| CLUSTER-03 | Turn the stronger page into the Discord/time task hub                                            | M      | CLUSTER-01/02       | **Implemented locally:** both tools expose all seven formats and link to the distinct sibling task and evidence-first guide                                          |
| CLUSTER-04 | Add outcome-adjacent recommendations                                                             | M      | CLUSTER-01          | Each successful result recommends one to three plausible same-cluster next steps; no unrelated popularity block displaces them                                       |
| CLUSTER-05 | Add safe result sharing only where appropriate                                                   | M      | CLUSTER-01          | Opaque references reveal no raw input or sensitive result; sharing is optional, unrewarded, and not claimed as verified                                              |
| CLUSTER-06 | Add no new Discord tool during the first 28-day measurement window                               | S      | CLUSTER-02/03       | Existing overlap is repaired first; a new tool requires post-change query evidence for a distinct unmet task and passes the full Indexing Release Gate               |
| HOME-01    | Replace the random-tool homepage hierarchy after the winner is known                             | M      | GSC-06, CLUSTER-03  | Hero promotes the winner; no more than three validated clusters appear below; complete directory remains secondary                                                   |

## P3 — content, GEO, and controlled expansion

| ID         | Work                                             | Effort         | Dependency              | Acceptance criteria                                                                                                                                     |
| ---------- | ------------------------------------------------ | -------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CONTENT-01 | Publish only cluster-supporting evidence content | M per batch    | CLUSTER-01              | Every article supports a demonstrated query with a direct answer, method, worked example, limitations, authoritative sources, and real update context   |
| CONTENT-02 | Inventory legacy content                         | M              | GSC-02                  | Each legacy URL is marked keep, improve, consolidate, redirect, or `noindex`; decisions include traffic, links, relevance, and risk evidence            |
| GEO-01     | Apply verifiable publisher information           | S per template | CLUSTER-02              | Tool pages identify Geekskai and expose real method, source, rules, limitations, and meaningful update date without virtual experts                     |
| PSEO-01    | Design a maximum 10-page programmatic pilot      | M              | Stable cluster baseline | Each page has a materially different answer, calculation, example, or authoritative reference value; keyword substitution alone fails review            |
| PSEO-02    | Evaluate the pilot after at least 28 days        | S              | PSEO-01                 | At least 80% index normally, no unresolved duplicate/canonical defect exists, non-brand impressions appear, and pages lead to outcomes before expansion |
| DIST-01    | Run question-led research with Agent Reach       | M per cycle    | CLUSTER-01              | Findings include exact question, platform, evidence URL, terminology, and proposed useful response; no posting occurs without separate authorization    |

## P4 — AdSense readiness and limited test

No advertising implementation begins until one eligible cluster passes all conditions:

- at least 5,000 non-brand organic search clicks in a continuous 28-day period;
- at least three connected useful tool pages;
- 28 days of stable Successful Tool Outcome measurement;
- no unresolved advertising-policy issue;
- passed mobile core-experience review.

After the gate passes, create a separate implementation plan for a small number of manual ad placements. Auto Ads and placements near input, result, generate, convert, upload, or download controls remain outside the initial test.

## First 30-day sequencing

1. **Days 1–2:** approve the supplied GSC decision packet and Discord/time intent map; do not react to the incomplete final GSC dates.
2. **Days 3–5:** define lifecycle events, remove unverified statistics, and revalidate live canonical/mobile issues on the two Discord pages.
3. **Week 2:** separate or consolidate Time Converter and Timestamp Generator intent, metadata, examples, and internal links; keep Pricing unchanged unless a separate dormant-surface implementation is authorized.
4. **Week 3:** instrument successful generation/conversion/copy outcomes and make the stronger page the cluster hub; repair the supporting guide instead of publishing a new article batch.
5. **Week 4:** verify build, deterministic outputs, mobile behavior, canonicals, structured data, and analytics; then hold the cluster stable for a 28-day measurement window. Do not add a new Discord tool during this window.

The 80/20 allocation is enforced across the period: 80% existing-page and cluster improvement, 20% at most one evidence-backed new tool.

## Explicit blockers and unknowns

- **Not blocking:** 28-day and three-month query, page, country, device, and chart exports are now available and analyzed. A 12-month export and Search Console API query-by-page join would improve seasonality and cannibalization confidence.
- **Selected hypothesis:** Discord/time leads the first coherent eligible-cluster sprint; Tip Screen remains the isolated eligible-click leader and receives only a bounded page experiment.
- **Unknown:** whether overlapping Discord URLs are both shown for the same queries. Strict differentiation is the reversible decision until a page-filtered query export or Search Console API join proves consolidation is safer.
- **Unknown:** current policy-center state, eligible-page RPM, coverage, and invalid-traffic segmentation; these are not inferred from site approval.
- **Unknown:** whether historical `/zh-cn/`, About canonical, INP, and Clarity dead-click findings remain live today; revalidate before editing.
