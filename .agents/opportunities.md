# Geekskai Opportunity Backlog

**Version:** v1  
**Created:** 2026-09-15  
**Evidence snapshot:** Product Growth Review completed 2026-09-13  
**Current phase:** MEASURE / INVESTIGATE / VALIDATE only

## Operating Rules

- This backlog contains only opportunities extracted from the completed Geekskai Product Growth Review.
- An Opportunity is a problem or decision gap, not a proposed solution.
- Allowed activity types in this phase: `MEASURE`, `INVESTIGATE`, `VALIDATE`.
- Forbidden in this phase: `BUILD FEATURE`, `REDESIGN`, `CHANGE PRICING`, `CHANGE PAYWALL`, `A/B TEST`.
- Evidence Level `D` items cannot enter development. No `D` item has been promoted into this backlog; unsupported product claims remain `UNKNOWN` rather than being converted into work.
- `NOW` means one active investigation, not a list of parallel projects.

## Evidence Levels

| Level | Definition |
| --- | --- |
| A | Strong first-party behavior or verified revenue data |
| B | Multiple reliable signals |
| C | One weak signal |
| D | Hypothesis without direct evidence; cannot enter development |

## Current Selection

| Role | Opportunity | Status |
| --- | --- | --- |
| **Primary Opportunity** | **OP-001 — Quota Gate users do not start signup** | INVESTIGATING |
| **Secondary Opportunity** | **OP-002 — Sitewide Acquisition → Activation is not observable** | QUEUED — NOT ACTIVE |
| **Research Opportunity** | **OP-006 — Customer motivations, objections, and willingness to pay are unknown** | RESEARCH REQUIRED — NOT ACTIVE |

Only OP-001 is active. Secondary and Research Opportunities are selection markers for later sequencing, not authorization to work on them concurrently.

## Priority Summary

| Priority | Opportunities |
| --- | --- |
| **NOW** | OP-001 |
| **NEXT** | OP-002, OP-003, OP-005, OP-008 |
| **LATER** | OP-004, OP-007, OP-009, OP-010, OP-011, OP-012, OP-013 |
| **UNKNOWN** | OP-006, OP-014 |

---

## NOW

### OP-001

**ID:** OP-001  
**Title:** Quota Gate users do not start signup  
**Type:** INVESTIGATE  
**Funnel Stage:** Signup  
**Problem:** Among unique first-party quota journeys that saw the download Quota Gate, only 18.60% started signup. This is the largest currently comparable quantified drop-off.  
**Evidence:** In the 30-day UTC window ending 2026-09-13, 1,763 unique journeys recorded `quota_gate_viewed`; 328 recorded `signup_started`. Drop-off was 81.40%, representing 1,435 journeys. The same funnel recorded 157 new account completions and 132 successful downloads within 24 hours. Source: Neon first-party growth events, documented in `docs/geekskai-growth-dashboard-specification.md`.  
**Affected Users:** 1,763 Quota Gate journeys; 1,435 did not start signup.  
**Business Impact:** The gate sits upstream of account creation and post-signup activation. The measured end-to-end Gate → Activated Registration rate is 7.49%.  
**Unknown:** Which gate action users chose; how many dismissed without action; whether behavior differs by tool, locale, device, quota mode, repeat exposure, or remaining allowance; whether the account CTA was attempted but navigation failed.  
**Evidence Level:** A  
**Impact:** 5  
**Confidence:** 5  
**Ease of Investigation:** 4  
**Status:** INVESTIGATING — investigation contract in `.agents/investigations/OP-001.md`

---

## NEXT

### OP-002

**ID:** OP-002  
**Title:** Sitewide Acquisition → Activation is not observable  
**Type:** MEASURE  
**Funnel Stage:** Acquisition → Activation  
**Problem:** Geekskai cannot calculate a sitewide Successful Outcome rate or identify which landing pages and tools turn traffic into completed results.  
**Evidence:** Clarity recorded 36,781 non-bot sessions in the reviewed 30-day window. GA4 collection was not enabled in the current site configuration, and the 50 public tools did not have complete, consistent `tool_started`, `tool_succeeded`, and `tool_failed` coverage.  
**Affected Users:** Up to 36,781 observed non-bot sessions across 50 public tools during the review window.  
**Business Impact:** Blocks comparison of traffic quality, tool Activation, landing-page performance, and the true sitewide growth bottleneck.  
**Unknown:** Sitewide Activated Users, success and failure rates by tool, time-to-result, and channel-to-outcome conversion.  
**Evidence Level:** B  
**Impact:** 5  
**Confidence:** 5  
**Ease of Investigation:** 2  
**Status:** QUEUED — NOT ACTIVE; Secondary Opportunity

### OP-003

**ID:** OP-003  
**Title:** Nearly half of quota-driven signup starts do not complete an account  
**Type:** INVESTIGATE  
**Funnel Stage:** Signup  
**Problem:** The measured Signup Started → New Account Completed conversion is 47.87%.  
**Evidence:** Of 328 quota journeys that started signup, 157 completed a new account and 171 did not. Drop-off was 52.13% in the reviewed 30-day window.  
**Affected Users:** 328 signup-start journeys; 171 did not complete a new account.  
**Business Impact:** Reduces the number of users eligible to resume their interrupted download, even though post-signup activation is high.  
**Unknown:** Drop-off step, authentication method, verification status, field or provider error, completion time, device distribution, and whether users returned through another session.  
**Evidence Level:** A  
**Impact:** 4  
**Confidence:** 5  
**Ease of Investigation:** 3  
**Status:** QUEUED — NOT ACTIVE

### OP-005

**ID:** OP-005  
**Title:** Acquisition source cannot be connected to signup, revenue, or retention  
**Type:** MEASURE  
**Funnel Stage:** Cross-funnel  
**Problem:** Search and session sources cannot be reliably joined to product results, authenticated users, billing outcomes, or repeat use.  
**Evidence:** The current growth journey stores limited journey, account, and share attribution data but no general first source, medium, campaign, landing page, or referrer. GA4 anonymous identity, Clarity identity, server journey, Clerk user, and Billing user do not share a complete non-PII analytics contract.  
**Affected Users:** All acquisition journeys outside the currently linkable first-party quota path.  
**Business Impact:** Blocks channel-to-outcome, channel-to-revenue, CAC, ROAS, and source-level retention decisions.  
**Unknown:** Which sources produce Activated Users, paying users, and retained users.  
**Evidence Level:** B  
**Impact:** 5  
**Confidence:** 5  
**Ease of Investigation:** 2  
**Status:** QUEUED — NOT ACTIVE

### OP-008

**ID:** OP-008  
**Title:** Search acquisition is highly concentrated in three SoundCloud pages  
**Type:** VALIDATE  
**Funnel Stage:** Acquisition  
**Problem:** A large share of known Bing acquisition depends on one task cluster, but equivalent full-site GSC validation is unavailable.  
**Evidence:** Bing Webmaster Tools recorded 75K clicks from 2026-06-13 through 2026-09-12. SoundCloud Downloader, SoundCloud to MP3, and SoundCloud to WAV contributed about 56.6K clicks, approximately 75.5% of the total.  
**Affected Users:** Approximately 56.6K Bing search clicks in the three-month evidence window.  
**Business Impact:** A material change in this cluster could dominate reported acquisition performance and conceal changes elsewhere.  
**Unknown:** Whether Google shows the same concentration; how much of the traffic completes a Successful Outcome; how much proceeds to signup or Audio Toolkit.  
**Evidence Level:** A  
**Impact:** 5  
**Confidence:** 5  
**Ease of Investigation:** 4  
**Status:** QUEUED — NOT ACTIVE

---

## LATER

### OP-004

**ID:** OP-004  
**Title:** Client and server Audio completion signals do not reconcile  
**Type:** VALIDATE  
**Funnel Stage:** Activation  
**Problem:** Client-side Audio completion signals and server-confirmed processing records cannot currently be treated as one funnel.  
**Evidence:** The reviewed 30-day Clarity data showed 8 Audio completion sessions, while server Audio operations showed 2 processing completers. The systems have different identities and event semantics.  
**Affected Users:** All observed Audio Toolkit journeys; the currently confirmed server sample is 2 completers.  
**Business Impact:** Blocks reliable Audio activation, onboarding, retention, and paid-value decisions.  
**Unknown:** Whether the difference is caused by duplicate client events, client-only completion, missing server linkage, consent, environment, or timing.  
**Evidence Level:** B  
**Impact:** 3  
**Confidence:** 4  
**Ease of Investigation:** 3  
**Status:** BACKLOG — NOT ACTIVE

### OP-007

**ID:** OP-007  
**Title:** The Tools page publishes an unverified `25K+ happy users` claim  
**Type:** VALIDATE  
**Funnel Stage:** Acquisition / Conversion  
**Problem:** A public trust claim has no reproducible user-count or satisfaction evidence.  
**Evidence:** `app/[locale]/tools/page.tsx` contains `25K+` beside `Happy Users`, includes a `TODO: Replace with actual number`, and repeats a “Join 25,000+ happy users worldwide” message. The Review found no satisfaction survey, NPS, or verified user-count definition supporting it.  
**Affected Users:** Visitors to the indexed Tools directory; current page audience count is unavailable.  
**Business Impact:** Makes product trust and conversion claims impossible to audit and introduces an unsupported public proof point.  
**Unknown:** Actual unique-user count, definition of “user,” satisfaction level, and conversion impact of the claim.  
**Evidence Level:** B  
**Impact:** 3  
**Confidence:** 5  
**Ease of Investigation:** 5  
**Status:** BACKLOG — NOT ACTIVE

### OP-009

**ID:** OP-009  
**Title:** SoundCloud-to-WAV search intent and delivered format are not identical  
**Type:** VALIDATE  
**Funnel Stage:** Acquisition → Activation  
**Problem:** The `/soundcloud-to-wav/` URL targets a WAV-oriented query, while the current tool transparently saves the MP3 or M4A stream actually available and does not synthesize WAV.  
**Evidence:** Bing recorded 8.3K clicks to the page during the three-month window. Current page copy states “No fake WAV upconversion” and explains that output keeps the real MP3/M4A extension.  
**Affected Users:** 8.3K Bing clicks in the reviewed period.  
**Business Impact:** A query-to-result mismatch could affect click quality and Successful Outcome, but no joined result data currently proves impact.  
**Unknown:** Query-level CTR, quick-back rate, format-selection rate, successful downloads, and whether visitors expected an actual WAV file.  
**Evidence Level:** B  
**Impact:** 3  
**Confidence:** 4  
**Ease of Investigation:** 3  
**Status:** BACKLOG — NOT ACTIVE

### OP-010

**ID:** OP-010  
**Title:** Pricing → Audio Toolkit navigation is not connected to verified purchase  
**Type:** MEASURE  
**Funnel Stage:** Revenue  
**Problem:** The current Pricing funnel ends at Audio Toolkit navigation and cannot measure purchase conversion.  
**Evidence:** Clarity recorded 85 Audio Toolkit visits from 596 Pricing sessions, a 14.26% navigation rate and 85.74% drop-off. Separately, server data recorded 2 paying users from 9 checkout users within 7 days. The identities and denominators cannot be joined.  
**Affected Users:** 596 Pricing sessions and 9 checkout users in the reviewed window; these groups cannot be deduplicated or linked.  
**Business Impact:** Pricing page performance can be misread if navigation is treated as revenue.  
**Unknown:** Pricing → offer view → checkout → verified payment conversion by plan and entry source.  
**Evidence Level:** A  
**Impact:** 3  
**Confidence:** 5  
**Ease of Investigation:** 4  
**Status:** BACKLOG — NOT ACTIVE

### OP-011

**ID:** OP-011  
**Title:** Standard D1/D7/D30 product retention is unavailable  
**Type:** MEASURE  
**Funnel Stage:** Retention  
**Problem:** Geekskai cannot form a complete first-Activation cohort across public tools and Audio Toolkit.  
**Evidence:** Thirty-nine of 223 registered download users completed downloads on at least two UTC dates in the reviewed 30-day window, but this 17.49% window measure is not D30 retention. Public tools lack complete user-level success history, and Audio completion volume is too small.  
**Affected Users:** 223 registered download users plus unmeasured public-tool and Audio users.  
**Business Impact:** Blocks evaluation of repeat product value and the relationship between Activation and retention.  
**Unknown:** D1, D7, and D30 retention by first Activation, tool, source, and user state.  
**Evidence Level:** B  
**Impact:** 4  
**Confidence:** 5  
**Ease of Investigation:** 2  
**Status:** BACKLOG — NOT ACTIVE

### OP-012

**ID:** OP-012  
**Title:** PAYG orders expire without a verified explanation  
**Type:** INVESTIGATE  
**Funnel Stage:** Revenue  
**Problem:** PAYG order creation is observed, but completed PAYG payment was not established in the Review evidence.  
**Evidence:** Billing records contained 16 expired PAYG orders. The reviewed completed payments were three $29 subscription payment records totaling $87 gross.  
**Affected Users:** Users associated with 16 expired PAYG orders; exact unique-user count was not established.  
**Business Impact:** May represent lost revenue or non-customer/test traffic, but the current evidence cannot distinguish them.  
**Unknown:** Environment, test status, checkout progression, PayPal error or cancellation state, unique users, and purchase intent.  
**Evidence Level:** A  
**Impact:** 3  
**Confidence:** 3  
**Ease of Investigation:** 4  
**Status:** BACKLOG — NOT ACTIVE; no price inference permitted

### OP-013

**ID:** OP-013  
**Title:** Audio upgrade prompt conversion is not measurable  
**Type:** MEASURE  
**Funnel Stage:** Revenue  
**Problem:** The Audio Toolkit upgrade prompt has no isolated impression-to-payment funnel.  
**Evidence:** Current code shows the “Need more Credits?” prompt after a batch summary or insufficient Credits and links to Pricing. No dedicated prompt impression and CTA event is connected through checkout to verified payment.  
**Affected Users:** Signed-in free Audio users who see the prompt; count is currently `UNKNOWN`.  
**Business Impact:** Blocks evaluation of the current paywall moment and prevents distinguishing paywall performance from general Pricing traffic.  
**Unknown:** Impressions, CTA rate, checkout rate, verified payment rate, dismiss behavior, and prior successful-processing state.  
**Evidence Level:** B  
**Impact:** 3  
**Confidence:** 5  
**Ease of Investigation:** 3  
**Status:** BACKLOG — NOT ACTIVE; no paywall change permitted

---

## UNKNOWN

### OP-006

**ID:** OP-006  
**Title:** Customer motivations, objections, and willingness to pay are unknown  
**Type:** INVESTIGATE  
**Funnel Stage:** Cross-funnel / Revenue  
**Problem:** Product behavior and search tasks are available, but there is no first-party explanation of why users choose, register, buy, decline, or leave Geekskai.  
**Evidence:** The Review found no customer interviews, support-ticket synthesis, survey, NPS verbatims, win/loss research, churn reasons, or verified competitor-choice evidence. Search terms describe tasks but not user roles or buying motives.  
**Affected Users:** Registered users, 9 observed checkout users, verified payers, and non-converters; exact reachable sample is `UNKNOWN`.  
**Business Impact:** Blocks validated persona, positioning, objection, packaging, and price-point decisions.  
**Unknown:** Functional/emotional/social Jobs, trigger events, alternatives, perceived value, objections, non-purchase reasons, and willingness to pay.  
**Evidence Level:** B for the research gap; customer conclusions remain UNKNOWN  
**Impact:** 4  
**Confidence:** 5 that the evidence gap exists  
**Ease of Investigation:** 3  
**Status:** RESEARCH REQUIRED — NOT ACTIVE; Research Opportunity

### OP-014

**ID:** OP-014  
**Title:** Paid Audio activation has insufficient sample for a product decision  
**Type:** VALIDATE  
**Funnel Stage:** Revenue → Activation  
**Problem:** Paid workspace use is observed, but the sample is too small to determine whether paying users reach a successful paid result.  
**Evidence:** The Review found 2 first paid workspace opens and 0 first paid processing completions.  
**Affected Users:** 2 observed paid workspace users.  
**Business Impact:** Paid value realization cannot yet be confirmed or rejected.  
**Unknown:** Whether the two users attempted processing, used free Credits first, encountered an error, returned later, or were production customers.  
**Evidence Level:** C  
**Impact:** 2  
**Confidence:** 2  
**Ease of Investigation:** 4  
**Status:** INSUFFICIENT EVIDENCE — NOT ACTIVE

## Evidence Sources

- `docs/geekskai-growth-dashboard-specification.md` — funnel values, data authority boundaries, availability, and missing-event contracts.
- `.agents/product-marketing.md` — product definitions, search evidence, customer evidence boundaries, pricing and entitlement terminology.
- `lib/growth/events.ts`, `lib/db/schema.ts` — current first-party growth events and stored dimensions.
- `components/download-quota/useDownloadQuota.ts`, `components/download-quota/DownloadShareModal.tsx` — current Quota Gate triggers, actions, and return path.
- `lib/billing/catalog.ts`, current Pricing and Audio Toolkit pages — current price and entitlement facts.
- Bing Webmaster Tools evidence captured in the completed Review — `geekskai.com`, 2026-06-13 through 2026-09-12.

## Change Log

- v1 (2026-09-15) — Converted the completed Product Growth Review into a deduplicated, evidence-ranked Opportunity Backlog. Activated only OP-001.
