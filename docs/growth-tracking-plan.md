# Geekskai growth tracking plan

Microsoft Clarity is the current client-side behavior tool. Events contain no filenames, media URLs, email addresses, Clerk IDs, or other personal data.

## Audio Toolkit funnel

| Event                                   | Trigger                                                | Decision supported                   |
| --------------------------------------- | ------------------------------------------------------ | ------------------------------------ |
| `pricing_viewed`                        | Pricing client loads                                   | Establish pricing traffic baseline   |
| `pricing_interval_selected_monthly`     | Monthly selected                                       | Compare billing-cycle intent         |
| `pricing_interval_selected_annual`      | Annual selected                                        | Compare billing-cycle intent         |
| `pricing_free_toolkit_clicked`          | Free Toolkit CTA clicked                               | Measure free activation path         |
| `pricing_cta_clicked_{tier}_{interval}` | Basic or Pro CTA clicked                               | Measure plan intent                  |
| `pricing_signin_required_{tier}`        | Purchase intent reaches authentication                 | Find registration friction           |
| `checkout_created_{tier}_{interval}`    | Checkout API returns a Creem URL                       | Measure valid checkout creation      |
| `checkout_failed_{tier}_{interval}`     | Checkout creation fails                                | Detect billing funnel breakage       |
| `audio_file_selected`                   | One local file selected                                | Measure single-file activation start |
| `audio_files_selected_batch`            | Multiple local files selected                          | Measure paid batch intent            |
| `audio_processing_started`              | Single-file processing starts                          | Measure core action starts           |
| `audio_processing_started_batch`        | Batch processing starts                                | Measure paid workflow starts         |
| `audio_processing_completed`            | At least one single-file result completes              | Measure core activation              |
| `audio_processing_completed_batch`      | At least two results complete                          | Measure paid activation              |
| `audio_processing_failed`               | One or more files fail and processing was not canceled | Find product reliability gaps        |
| `audio_processing_canceled`             | User cancels local processing                          | Find performance or UX friction      |

## Interpretation rules

- A pricing-page view is not activation.
- A checkout URL is not payment; paid conversion comes from verified Creem webhook data.
- Audio completion records only the outcome class. Audio, filenames, output settings, and media URLs remain local.
- Review weekly by device class and landing page. Do not optimize from individual Clarity sessions alone.
