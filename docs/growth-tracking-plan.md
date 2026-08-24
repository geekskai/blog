# Geekskai growth tracking plan

Microsoft Clarity is the current client-side behavior tool. Events contain no filenames, media URLs, email addresses, Clerk IDs, or other personal data.

## Audio Toolkit funnel

| Event                              | Trigger                                                | Decision supported                   |
| ---------------------------------- | ------------------------------------------------------ | ------------------------------------ |
| `pricing_viewed`                   | Pricing client loads                                   | Establish pricing traffic baseline   |
| `pricing_free_toolkit_clicked`     | Free Toolkit CTA clicked                               | Measure free activation path         |
| `pricing_cta_clicked_payg`         | 480-Credit one-time CTA clicked                        | Measure PAYG intent                  |
| `pricing_cta_clicked_regular`      | Regular monthly CTA clicked                            | Measure recurring intent             |
| `paypal_payg_approved`             | PayPal returns from approved PAYG checkout             | Diagnose pre-capture funnel          |
| `paypal_regular_approved`          | PayPal returns from approved subscription checkout     | Diagnose pre-payment funnel          |
| `audio_file_selected`              | One local file selected                                | Measure single-file activation start |
| `audio_files_selected_batch`       | Multiple local files selected                          | Measure paid batch intent            |
| `audio_processing_started`         | Single-file processing starts                          | Measure core action starts           |
| `audio_processing_started_batch`   | Batch processing starts                                | Measure paid workflow starts         |
| `audio_processing_completed`       | At least one single-file result completes              | Measure core activation              |
| `audio_processing_completed_batch` | At least two results complete                          | Measure paid activation              |
| `audio_processing_failed`          | One or more files fail and processing was not canceled | Find product reliability gaps        |
| `audio_processing_canceled`        | User cancels local processing                          | Find performance or UX friction      |

## Interpretation rules

- A pricing-page view is not activation.
- PayPal approval is not payment or entitlement; paid conversion comes from verified PayPal lifecycle data.
- Audio completion records only the outcome class. Audio, filenames, output settings, and media URLs remain local.
- Review weekly by device class and landing page. Do not optimize from individual Clarity sessions alone.

## Production baseline

Snapshot: 2026-08-12, Microsoft Clarity, previous 3 days.

| Metric               |     Baseline | Interpretation                                             |
| -------------------- | -----------: | ---------------------------------------------------------- |
| Sessions             |        4,787 | Excludes 296 sessions Clarity classified as bots           |
| Unique users         |        4,289 | 82.79% of sessions were from new users                     |
| Pages per session    |         1.33 | Discovery depth is currently low                           |
| Average scroll depth |       31.81% | Most visitors do not reach deep-page content               |
| Dead-click sessions  | 18.80% (900) | Highest confirmed interaction-quality issue                |
| Quick-back sessions  |  2.97% (142) | Use landing-page and query context before changing content |
| LCP                  |        2.6 s | Needs improvement                                          |
| INP                  |       280 ms | Needs improvement                                          |
| CLS                  |         0.19 | Needs improvement                                          |

Clarity funnel `Audio acquisition - pricing to toolkit` tracks the first observable acquisition transition:

1. `https://geekskai.com/pricing/`
2. `https://geekskai.com/audio-toolkit/`

The Audio Toolkit custom events were deployed on 2026-08-12 and were not yet available in Clarity's funnel selector when this baseline was recorded. This is an ingestion/sample state, not evidence that the events are broken.

## Measurement gates

- Recheck after 72 hours or after the first 100 pricing-page sessions, whichever comes later.
- Confirm `pricing_viewed`, `pricing_free_toolkit_clicked`, `audio_file_selected`, `audio_processing_started`, and `audio_processing_completed` appear in Clarity before building the activation funnel.
- Keep checkout and paid-conversion reporting disabled until the PayPal Payment Launch Gate passes. Checkout preparation and approval are never counted as payment.
- Investigate dead clicks and Core Web Vitals before investing in traffic that lands on the same affected pages.
- Preserve the no-PII rule during every analytics change.
