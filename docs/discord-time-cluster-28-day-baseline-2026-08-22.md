# Discord/time cluster 28-day baseline — 2026-08-22

## Measurement status

This is a pre-deployment baseline and dashboard specification, not a claim that the experiment has completed. The 28-day observation window starts only after the repaired pages are deployed and verified. If deployment occurs on 2026-08-22, the earliest complete evaluation date is 2026-09-19; otherwise both dates move together.

Keep the two tool URLs and the guide stable during the window. Do not add another overlapping Discord timestamp tool, redirect either tool, or change its search intent while the experiment is running.

## Reproducible GSC baseline

Source: the user-supplied Web Search exports created on 2026-08-22. Search Console query rows and page rows are separate tables; they cannot prove which page received a particular query.

### Latest 28 days

| Asset or query                                         | Clicks | Impressions |   CTR | Average position |
| ------------------------------------------------------ | -----: | ----------: | ----: | ---------------: |
| `/tools/discord-time-converter/`                       |      2 |       6,345 | 0.03% |            25.56 |
| `/tools/discord-timestamp-generator/`                  |      1 |       1,439 | 0.07% |            39.99 |
| `/blog/ai/discord-timestamp-generator-complete-guide/` |      1 |       1,316 | 0.08% |            48.78 |
| Query `time zone converter discord`                    |      0 |       2,230 |    0% |             9.44 |

The three English assets total 4 clicks and 9,100 impressions in the page table. This sum is a cluster diagnostic, not a substitute for Search Console property totals.

### Latest three months

| Asset or query                                         | Clicks | Impressions |   CTR | Average position |
| ------------------------------------------------------ | -----: | ----------: | ----: | ---------------: |
| `/tools/discord-time-converter/`                       |      3 |       8,392 | 0.04% |            28.67 |
| `/tools/discord-timestamp-generator/`                  |      4 |       2,695 | 0.15% |            35.10 |
| `/blog/ai/discord-timestamp-generator-complete-guide/` |      2 |       1,924 | 0.10% |            49.82 |
| Query `time zone converter discord`                    |      0 |       2,661 |    0% |             8.64 |

## Outcome event contract

| Event                  | Meaning                                                        | Required properties                                    |
| ---------------------- | -------------------------------------------------------------- | ------------------------------------------------------ |
| `tool_started`         | First interaction with a tool in the current page view         | `tool_id`, `action`                                    |
| `tool_succeeded`       | A valid batch result or a generated result successfully copied | `tool_id`, `action`; optional `format`, `result_count` |
| `tool_failed`          | A batch has no valid result or copying fails                   | `tool_id`, `action`; optional `format`, `result_count` |
| `tool_result_copied`   | A usable result reaches the clipboard                          | `tool_id`, `action`; optional `format`, `result_count` |
| `related_tool_clicked` | A user opens the distinct sibling tool or guide                | `tool_id`, `action`                                    |

Inputs, selected dates, time zones, timestamp codes, clipboard contents, and saved configurations are prohibited analytics properties.

## Dashboard formulas and segments

- Successful Tool Outcome rate = unique page views with `tool_result_copied` or valid batch `tool_succeeded` divided by unique page views with `tool_started`.
- Copy failure rate = `tool_failed` copy attempts divided by all copy attempts.
- Related-tool depth = unique sessions with `related_tool_clicked` divided by sessions with `tool_succeeded`.
- Search outcomes: non-brand clicks, impressions, CTR, and position for each of the three URLs and the target query.
- Required segments: page, device, country, new/returning visitor, and analytics provider. Do not combine provider counts into one total.

## Evaluation rules after one complete 28-day window

Pass the sprint only if all of the following hold:

1. Target-query clicks rise above the zero-click baseline, or one of the two pages gains query-aligned non-brand clicks with no loss hidden by cluster aggregation.
2. At least one tool records successful copied outcomes, with no persistent copy-failure concentration on mobile.
3. Related-tool navigation is measurable and points to the distinct next task rather than an overlapping duplicate.
4. Both tool canonicals remain self-referential, all three URLs remain indexable as intended, and no mobile or structured-data regression is introduced.

Do not call the experiment successful from impressions alone. If outcomes improve but search clicks do not, continue improving the existing pages. Consider a new tool only when query evidence shows a separate unmet task.
