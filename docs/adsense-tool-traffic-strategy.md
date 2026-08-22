# Geekskai free-tool traffic and AdSense strategy

## Decision

Geekskai is an acquisition-first free-tool portfolio intended for later AdSense monetization. Payment work is paused, and the current stage is ad-free while organic traffic, tool outcomes, and policy-eligible pages are established. New tools are selected from observed search demand and must pass both a usefulness gate and an advertising-policy gate before receiving development priority.

Pricing is removed from primary navigation and the sitemap and carries `noindex` during this stage. The package and billing implementation remains dormant and recoverable, but creates no public acquisition promise or active checkout.

Existing downloader pages may continue to serve current traffic, but the downloader category is frozen for expansion and excluded from the first AdSense growth cluster even if it leads current traffic. AdSense eligibility is evaluated page by page; downloader result and action screens are not assumed eligible.

English-language demand in markets with stronger policy-safe advertising value receives research and optimization priority. This does not make Geekskai a United-States-only or English-only product: multilingual pages remain available and compete for investment using their own Search Console and revenue-quality evidence.

Ordinary acquisition tools provide their complete core result without registration. A future account may add optional saved history, synchronization, or batch convenience, but cannot block the primary search-intent outcome. Existing downloader quota rules remain separate.

Sign-in remains a secondary navigation action for existing account and downloader-quota journeys. Ordinary acquisition tools do not display registration prompts before or immediately after the core result; the existing downloader Quota Gate may continue to offer registration after its allowance is exhausted.

Ordinary tools process inputs and results in the browser whenever the promised outcome can be delivered reliably on-device. Server processing requires a demonstrated technical need and demand justification. Analytics may record tool lifecycle events, but not user input or result payloads.

Geekskai remains an umbrella brand rather than rebranding around the first winning cluster. The homepage highlights only a small set of clusters supported by current acquisition and outcome evidence; the complete tool directory remains available without giving every tool equal prominence.

The homepage hero belongs to the current first-ranked cluster, followed by no more than three validated clusters and a secondary link to the complete directory. Homepage prominence is revisited when current acquisition or outcome evidence changes.

## Selected skill stack

- `agent-reach` and `competitor-profiling`: current competitor, community, and SERP research.
- `seo`, `programmatic-seo`, and `ai-seo`: query-page fit, scalable pages, crawlability, citations, and answer-engine visibility.
- `free-tools`: evaluate a tool as a growth asset rather than a feature idea.
- `analytics` and `attribution`: connect Search Console landing pages to successful tool outcomes and traffic quality.
- `site-architecture`, `content-strategy`, and `marketing-loops`: build coherent clusters, internal links, and a repeatable keyword-gap loop.
- `humanizer`: final editorial pass after facts, examples, and tool results are written; it is not a substitute for original evidence.

Pricing, paywall, onboarding, sales, and paid-ad skills remain out of the active execution path while commercialization is paused.

## Current evidence

### Confirmed

- The project already contains roughly fifty tools across downloaders, converters, calculators, generators, and utility categories.
- The supplied 28-day Web Search Console export contains 15.2K clicks and 376K impressions; the separate three-month export contains 19,837 clicks, 625,691 impressions, 3.17% CTR, and average position about 9.9. The filters and chart totals reconcile with the supplied dashboard views.
- Page-table rows attribute 18,874 of 19,837 three-month clicks to downloader URLs. Because Search Console charts and tables use different aggregation and the table is row-limited, this is directional rather than an exact sitewide share, but it confirms that raw site traffic is not the eligible acquisition north star.
- Among non-downloader opportunities, Tip Screen is the strongest individual page at 100 clicks and 5,525 impressions over three months. The Discord/time portfolio has only 15 page-table clicks but 12,032 impressions across 21 localized rows, including 8,392 impressions for the English Discord Time Converter and 2,695 for the English Discord Timestamp Generator.
- The query `time zone converter discord` produced 2,661 impressions at average position 8.64 but no clicks over three months. The two English Discord pages currently overlap in title, description, and functionality, so intent separation and cannibalization repair precede any new Discord tool.
- The recorded Clarity baseline showed 1.33 pages per session, 31.81% average scroll, and 18.80% dead-click sessions. Discovery exists, but depth and interaction quality need work before aggressive ad placement.
- The directory positioning and navigation mix unrelated audiences. Tool count is not the current bottleneck.
- Current external research shows the generic developer-tool market is crowded; free, no-sign-up, and local processing are baseline claims rather than durable differentiation.

### Likely interpretations requiring post-change validation

- Discord/time offers the strongest first policy-eligible cluster opportunity because it combines observed impressions, an existing near-page-one query, two functional pages, one supporting guide, local deterministic processing, and low advertising-policy risk. Its current click evidence is weak, so it is an optimization hypothesis rather than a guaranteed traffic outcome.
- Tip Screen is the strongest isolated eligible traffic page and should receive a bounded snippet and intent-fit experiment. It is not the first cluster because its prank/fake-screen positioning, ad-placement ambiguity, and lack of three coherent adjacent tools make it a weaker AdSense foundation.
- Norwegian measurement conversion is the runner-up cluster: `/no/tools/cm-to-tommer-converter/` has 3,008 impressions at position 11.23 and `cm til tommer` has 843 impressions at position 10.46, but there are no clicks in the supplied three-month table and it is outside the English-priority market rule.
- Calculator and deterministic-conversion clusters can support original examples, formulas, reference tables, and programmatic long-tail pages with lower policy risk than third-party media downloaders.
- File converters can attract demand but are highly competitive and become low-value pages when the only content is an upload box.

### Unknown

- Search Console cannot prove whether the two Discord pages cannibalize the same result without query-by-page filtered exports or API data.
- Current eligible-page RPM, ad coverage, policy-center state, invalid-traffic segmentation, and successful-tool-outcome rate remain unknown.
- External keyword volume, advertiser value, and stable post-change CTR remain unknown. Search Console impressions demonstrate exposure, not guaranteed future clicks or revenue.

## Opportunity score

Apply the hard vetoes first. Score only candidates that pass all of them.

### Hard vetoes

- Copyright, platform-terms, privacy, safety, or advertising-policy risk cannot be bounded.
- The useful page would be thin, replicated, or indistinguishable from a download/navigation screen.
- The result depends on an unstable or unapproved upstream service.
- The promised output cannot be automatically verified.

### Weighted score (100 points)

| Factor | Weight | Required evidence |
| --- | ---: | --- |
| Existing organic demand | 25 | Search Console query/page data; otherwise external keyword data |
| Ranking attainability | 20 | SERP composition, weak results, domain authority gap, content gap |
| Policy-safe AdSense potential | 15 | Page-purpose review, advertiser relevance, safe placement; CPC is not treated as RPM |
| Cluster and pSEO expansion | 15 | At least 10 useful non-duplicate query variants or connected tools |
| Build and maintenance efficiency | 10 | Local deterministic logic preferred; known dependency and upkeep cost |
| Outcome quality and page depth | 10 | Verifiable result, related next action, useful examples/reference content |
| International fit | 5 | English-market opportunity plus language-independent input or validated localization demand |

Development order follows score, but a candidate with no first-party evidence starts as a research experiment, not a committed feature.

## Evidence-led cluster ranking

This ranking uses the supplied 28-day and three-month exports plus repository and current competitor evidence. The score is a prioritization aid, not a traffic forecast.

| Priority | Cluster | First-party signal | Main risk | Decision |
| --- | --- | --- | --- | --- |
| 1 | Discord/time utilities | 12,032 page-table impressions; a 2,661-impression query at position 8.64; two tools and one guide already exist | Near-zero CTR, overlapping intent, competitive SERP | First acquisition cluster; repair and consolidate intent before adding a tool |
| 2 | Norwegian measurement converters | 3,008 impressions at position 11.23 on the leading page; 843-impression query near page one | Zero clicks and outside English-priority scope | Runner-up; preserve as the next controlled localization experiment |
| 3 | Tip Screen | 100 clicks, 5,525 impressions, position 8.29; strongest isolated eligible tool | Weak cluster depth, prank/deceptive framing, ad-control confusion | Run a bounded page-level CTR experiment; do not make it the first cluster |
| 4 | VIN and vehicle utilities | 13 clicks and 2,348 impressions across the category | Accuracy, misuse, trust, standards, and legal boundaries | Maintain testing-only positioning; no scaled templates yet |
| 5 | Calculators and other deterministic converters | 23 clicks and 7,372 impressions across many unrelated rows | Fragmented intent and saturated terms | Improve only when a coherent query cluster appears |
| 6 | Data and document utilities | Clear task intent and natural adjacent actions | Only one click across 1,173 impressions; strong incumbents | No first-sprint investment |
| 7 | Text/font and trend generators | Some cheap and shareable implementations | Saturated, shallow, volatile, or rights-sensitive | Maintain proven pages; do not mass-produce clones |
| 8 | Third-party media downloaders | 18,874 clicks and 405,633 page-table impressions | Copyright, provider, and ad-placement risk | Maintain, freeze expansion, exclude from eligible cluster metrics |

## Ninety-day execution

### Days 1-14: measure and repair

During the first 30 days, allocate 80% of acquisition effort to existing pages with demonstrated Search Console opportunity. Allocate the remaining 20% to at most one new tool, and only when query evidence identifies a missing result that an existing page cannot satisfy.

1. Export Search Console queries and pages for 3, 6, and 12 months, including country and device.
2. Join query-page data to tool categories and identify pages with high impressions, positions 5-20, and below-expected CTR.
3. Instrument `tool_started`, `tool_succeeded`, `tool_failed`, and `related_tool_clicked`; exclude tool input and media URLs.
4. Fix confirmed broken links, misleading counts, dead clicks, mobile interaction latency, and layout shift before adding ad density.
5. Create a page-level AdSense eligibility inventory. Keep ads away from upload, convert, generate, and download controls.

Exit criteria: top landing pages are known, successful outcomes are measurable, invalid/bot traffic is separated, and every currently monetized page has a reviewed placement map.

All public usage, user, reliability, satisfaction, and performance claims require reproducible first-party evidence with a defined scope and period. Remove placeholder or estimated social proof, including `25K+`-style counters and vague substitutes such as `thousands of users`.

### Days 15-45: compound existing demand

1. Select the best single existing cluster from first-party data. Do not split the first sprint across unrelated high-impression pages.
2. Improve title/snippet intent match, original explanations, examples, edge cases, FAQs as normal page content, and related-tool navigation.
3. Add only one or two missing tools that close a demonstrated query gap inside those clusters.
4. Build cluster hubs and bidirectional internal links; avoid isolated one-page launches.
5. Request indexing only after the tool result, canonical, sitemap, structured data, and mobile behavior pass verification.

Exit criteria: the selected cluster has a hub, at least three useful connected pages, measurable successful outcomes, and no thin/duplicate variants.

Before indexing a new or materially changed tool, verify deterministic example outputs, invalid and boundary inputs, mobile browser behavior, canonical and search metadata, and Successful Tool Outcome instrumentation. Keep the page `noindex` until every check passes.

### Days 46-90: scale winners

1. Expand only clusters that show increasing non-brand clicks and acceptable successful-outcome rates.
2. Generate programmatic pages only when inputs produce materially different answers, examples, or reference data.
3. Use Agent Reach to collect real questions and terminology from GitHub, Reddit, YouTube/Bilibili, social platforms, and web results; humanize only after factual editing.
4. Review AdSense page RPM, coverage, viewability, policy notices, and traffic-source quality by cluster. Never buy low-quality traffic to inflate impressions.
5. Retire, merge, or noindex experiments that produce thin search entrances without useful outcomes.

Exit criteria: at least one cluster has sustained click growth, repeatable query expansion, policy-safe monetization, and a documented build template.

Review each indexed acquisition page after 90 days. If it has no meaningful non-brand impressions, Successful Tool Outcomes, or defensible cluster contribution, improve it, consolidate it into a stronger page, set it to `noindex`, or redirect it as appropriate. Do not keep it indexed merely to increase page count or delete it solely because 28-day clicks are absent.

Programmatic expansion starts with no more than 10 pages and remains unchanged for at least 28 days. A query variant is indexable only when it provides a materially different calculation, answer, example, or authoritative reference value; keyword substitution by itself is not publishable value. Expansion requires at least 80% normal indexing, no unresolved duplicate-content or canonical defect, real non-brand impressions, and evidence that the pages lead to Successful Tool Outcomes.

## Weekly keyword-gap loop

1. **Observe:** Search Console queries, landing pages, outcome events, internal searches, and Agent Reach questions.
2. **Score:** apply vetoes and the 100-point model.
3. **Improve before build:** first update an existing page when it can satisfy the query.
4. **Build the smallest gap:** ship one tool or one materially useful page, not a batch of near-duplicates.
5. **Distribute:** link from the cluster hub, related tools, and evidence-backed content; use social/community channels only where the tool answers an existing question.
6. **Measure after 28 days:** clicks, position, CTR, successful outcomes, related-tool depth, traffic quality, and eligible-page revenue.
7. **Scale or stop:** expand winners; merge, noindex, or stop weak experiments.

## Question-led distribution

Organic search remains the primary channel. Agent Reach is used to find real questions, terminology, and relevant discussions across GitHub, Reddit, X, Facebook, Instagram, web search, YouTube/Bilibili, and available transcript sources. A Geekskai answer or tool link is appropriate only when it directly solves the discussion's problem. Identical cross-platform promotion and automated posting are excluded; each external post or reply requires separate execution authorization.

Eligible tools may add an optional share link or embed code after a successful result. The shared reference uses an opaque identifier and exposes no raw input or sensitive result data. Sharing is never required, rewarded, or represented as verified publication.

After a Successful Tool Outcome, show one to three plausible next-step tools from the same cluster. Do not use generic site-wide popularity for this primary recommendation area or distract from completion before the result is available.

## Cluster-supporting content

Publish tutorials, formulas, worked examples, comparisons, and evidence-backed answers only when they support a validated tool cluster and a demonstrated search task. Unrelated, duplicated, or weak legacy posts enter a review queue for improvement, consolidation, redirect, or `noindex`; do not mass-delete them merely because the portfolio strategy changed.

For SEO and GEO, state the direct answer or usable result first, followed by the method, worked example, limitations, authoritative sources, and last-updated context needed to verify it. AI may assist research and drafting, and Humanizer may refine the final prose, but neither may invent facts, tests, examples, or citations.

Use Geekskai as the accountable editorial identity and show the real test method, data source, calculation rule, known limitations, and last meaningful update where applicable. Do not create virtual experts, credentials, reviews, or author histories.

## Primary metric

Use **non-brand organic clicks to policy-eligible tool pages** as the acquisition metric, guarded by successful-tool-outcome rate and invalid-traffic quality. Treat AdSense revenue as the business result and pageviews/tool count as diagnostics, not the early north star.

## AdSense readiness threshold

AdSense may enter a limited placement test only when one policy-eligible cluster satisfies every condition below:

- At least 5,000 non-brand organic search clicks during a continuous 28-day period.
- At least three connected, useful tool pages in the cluster.
- Stable Successful Tool Outcome measurement for the same 28-day period.
- No unresolved advertising-policy issue affecting the site or selected pages.
- A passed mobile core-experience review before ad code is introduced.

This is an internal business-readiness threshold, not a Google traffic requirement. Downloader visits and ineligible pages do not count toward it.

## AdSense guardrails

- Do not display ads during the current Ad-Free Growth Stage. Advertising begins only after every AdSense readiness condition is verified.
- Do not place ads where they can be mistaken for navigation, download links, or tool actions.
- Do not use artificial traffic, traffic exchanges, click incentives, or language that asks users to support the site by clicking ads.
- Provide substantial original publisher value around the functional interface; avoid replicated or auto-generated pages without added value.
- Keep a current privacy policy covering Google advertising cookies and required disclosures.
- Treat site approval as conditional, not proof that every page or traffic source is compliant.

Official references:

- Google Publisher Policies: https://support.google.com/adsense/answer/10502938?hl=en
- Ad placement policies: https://support.google.com/adsense/answer/1346295?hl=en
- Invalid traffic: https://support.google.com/adsense/answer/16737?hl=en
- Traffic quality guidance: https://support.google.com/adsense/answer/1348752?hl=en
