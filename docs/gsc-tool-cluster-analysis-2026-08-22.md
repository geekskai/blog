# Geekskai GSC tool-cluster analysis — 2026-08-22

## Decision

Select **Discord/time utilities** as the first policy-eligible acquisition cluster.

This is not the cluster with the most current clicks. It is the strongest coherent cluster that combines observed demand, an attainable near-page-one query, existing implementation depth, deterministic browser-local outcomes, low policy risk, and at least three connected assets. The first sprint repairs overlapping intent and measures outcomes; it does not add another tool.

Treat **Tip Screen** as a separate page-level CTR experiment. It is the leading individual non-downloader tool by clicks but is not the first cluster because its fake/prank interface positioning, ad-placement ambiguity, and limited adjacent-task depth weaken its long-term AdSense fit.

Keep **Norwegian measurement conversion** as runner-up. It has near-page-one exposure but no recorded clicks in the supplied three-month page/query tables.

## Source and scope

Two user-supplied Google Search Console exports were analyzed without sending their contents to an external service:

| Export                                                  | Filter             |                                                       Chart scope |                                  Table rows |
| ------------------------------------------------------- | ------------------ | ----------------------------------------------------------------: | ------------------------------------------: |
| `geekskai.com-Performance-on-Search-2026-08-22.zip`     | Web, last 28 days  |                                    15.2K clicks; 376K impressions |                    355 pages; 1,000 queries |
| `geekskai.com-Performance-on-Search-2026-08-22 (1).zip` | Web, last 3 months | 19,837 clicks; 625,691 impressions; 3.17% CTR; position about 9.9 | 523 page rows plus header; 1,000 query rows |

Search Console chart totals and table-row sums are not expected to reconcile exactly. Charts aggregate by property, page tables aggregate by URL, query tables omit privacy-protected queries, and exported tables are capped. Category totals below are decision evidence, not accounting totals.

## Confirmed portfolio distribution

Three-month page-table classification:

| Category               | Page rows | Clicks | Impressions |   CTR | Weighted position |
| ---------------------- | --------: | -----: | ----------: | ----: | ----------------: |
| Downloaders            |        88 | 18,874 |     405,633 | 4.65% |              7.50 |
| Content                |        82 |    515 |     183,470 | 0.28% |             12.50 |
| Other                  |        88 |    277 |       4,358 | 6.36% |             13.73 |
| Trend/quiz/generator   |        54 |    176 |      12,110 | 1.45% |             19.55 |
| Calculators/converters |        73 |     23 |       7,372 | 0.31% |             21.40 |
| Text/font              |        74 |     21 |       2,506 | 0.84% |             20.53 |
| Discord/time           |        21 |     15 |      12,032 | 0.12% |             28.82 |
| VIN/vehicle            |        29 |     13 |       2,348 | 0.55% |             18.82 |
| Data/document          |        15 |      1 |       1,173 | 0.09% |             54.92 |

Downloader traffic dominates the current site but is excluded from the acquisition north star and the first AdSense cluster. Large-impression legacy articles such as the `myfavouriteplaces.org` page are also not evidence of coherent tool demand and require a separate content-quality inventory.

## Candidate evidence

### 1. Discord/time — selected cluster

- English Discord Time Converter: 3 clicks and 8,392 impressions over three months; 2 clicks and 6,345 impressions in the supplied 28-day export.
- English Discord Timestamp Generator: 4 clicks and 2,695 impressions over three months; 1 click and 1,439 impressions in 28 days.
- Query `time zone converter discord`: 2,661 impressions, no clicks, average position 8.64 over three months.
- Existing connected assets: Time Converter, Timestamp Generator, and the Discord timestamp guide.
- Current metadata overlaps: the Time Converter title calls itself a timestamp generator and both pages promise timezone support and timestamp creation.
- Competitors commonly combine all seven Discord formats, timezone-safe generation, reverse decoding, examples, and copy-ready output. Geekskai already implements much of this functionality, so the immediate gap is intent clarity and result presentation rather than another tool.

Decision: use strict differentiation, not consolidation. The Time Converter owns named-timezone conversion and reverse decoding; the Timestamp Generator owns new event/countdown creation, presets, and format previews. The supplied exports prove demand and page exposure, but not a query-by-page join, so redirecting either indexed URL would discard evidence without proving cannibalization. Do not publish a third overlapping generator.

### 2. Norwegian measurements — runner-up

- `/no/tools/cm-to-tommer-converter/`: 3,008 impressions, no clicks, average position 11.23 over three months.
- Query `cm til tommer`: 843 impressions, no clicks, average position 10.46.
- Deterministic calculation, strong local-processing fit, low policy risk, and clear adjacent conversion tasks.

Decision: preserve as the next localization experiment. It does not displace the first English-priority sprint until the Discord repair is measured or Norway begins producing clicks.

### 3. Tip Screen — isolated page experiment

- 100 clicks, 5,525 impressions, 1.81% CTR, and average position 8.29 over three months.
- 59 clicks and 3,817 impressions in the supplied 28-day export, showing that most of its three-month exposure is recent.
- Query examples include `fake tip screen website`, `tip screen generator`, `fake tip screen`, and `custom tip screen`.
- The page generates realistic payment-like screens, supports dark-pattern controls, and exports screenshots. This supplies a useful satire/education outcome but also creates prank/deception framing and potential visual confusion if ads are later placed near controls.

Decision: test title/snippet and clarify satire/educational purpose. Keep any future ads outside the generator and result area. Do not invent adjacent pages merely to satisfy the three-page cluster threshold.

### 4. VIN/vehicle — research only

- Category total: 13 clicks and 2,348 impressions over three months.
- English Random VIN Generator: 5 clicks, 1,842 impressions, average position 18.25.
- Current code contains testing-only explanations and misuse restrictions, but correct check digits do not prove that a generated VIN is unassigned or safe for every jurisdiction.

Decision: maintain synthetic testing positioning and authoritative standards references. Do not scale brand/year pages until accuracy, misuse, and data-source boundaries pass a separate review.

## Prioritization score

Scores apply the documented 100-point model and use medium confidence because RPM, outcome events, and query-by-page joins are unavailable.

| Candidate              | Demand 25 | Attainability 20 | Policy 15 | Cluster 15 | Efficiency 10 | Outcome 10 | International 5 |  Total |
| ---------------------- | --------: | ---------------: | --------: | ---------: | ------------: | ---------: | --------------: | -----: |
| Discord/time           |        18 |               13 |        14 |         14 |             9 |          9 |               5 | **82** |
| Norwegian measurements |        13 |               16 |        15 |         13 |            10 |          9 |               2 | **78** |
| Tip Screen             |        22 |               17 |         8 |          5 |             8 |          7 |               3 | **70** |
| VIN/vehicle            |        10 |               10 |         7 |         11 |             6 |          7 |               4 | **55** |

The score deliberately distinguishes an individual page winner from a portfolio-cluster winner. Tip Screen leads eligible tool clicks; Discord/time leads the first sustainable cluster decision.

## Pricing and the apparent traffic cliff

The supplied three-month chart does not support deleting Pricing as a traffic repair:

- Pricing-related code was committed on 2026-08-12.
- The seven complete days from August 5–11 averaged 674.7 clicks and 16,488 impressions.
- August 13–17 averaged 633 clicks and 13,035 impressions. Clicks were about 6% lower, but August 14 and 15 still recorded 712 and 743 clicks.
- August 18 and 19 fall to only 617 and 694 impressions while CTR jumps above 34% and average position improves to about 5. This shape is inconsistent with a normal ranking collapse and indicates incomplete or anomalous latest data.

Pricing remains unchanged. If a decline persists after complete data is available, inspect the broad August 12 release as a whole because it also changed global navigation, middleware, quotas, and downloader journeys; do not attribute causality to the Pricing URL alone.

## First 30-day experiment

1. Record the supplied query and page evidence, and explicitly preserve the query-by-page join as an unknown.
2. Define mutually exclusive user intents and use strict differentiation while that join remains unavailable.
3. Instrument start, success, failure, copy, and related-tool events without input payloads.
4. Repair the stronger page first: direct tool outcome, query-aligned title/snippet, all seven formats, worked examples, limitations, and mobile copy behavior.
5. Link the second tool and existing guide bidirectionally as distinct next steps.
6. Verify deterministic outputs, invalid input handling, metadata, canonical, structured data, mobile experience, and analytics.
7. Hold pages stable for 28 days; evaluate non-brand clicks, CTR on target queries, successful outcomes, and related-tool depth.

Success is not “more impressions.” The experiment passes when target-query clicks and Successful Tool Outcomes rise without indexation, canonical, policy, or mobile regressions. A new tool is considered only after the measurement window reveals a distinct unmet query.

## Remaining unknowns

- Query-by-page overlap and actual cannibalization between the two Discord URLs. The current implementation deliberately avoids a redirect until this can be measured.
- Successful Tool Outcome rate, dead-click targets, and mobile conversion/copy failures.
- Eligible-page RPM, advertising coverage, invalid-traffic quality, and AdSense policy-center status.
- Twelve-month seasonality and whether the recent downloader growth persists.
- Search volume and advertiser value beyond observed Geekskai impressions.
