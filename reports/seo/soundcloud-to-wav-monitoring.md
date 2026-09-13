# SoundCloud source-format release monitoring

Updated: 2026-09-13

## Release baseline

This document records the pre-release baseline for the transparent source-format copy. It does not attribute the August traffic change to this release or to a Google update.

| Scope | Date range | Clicks | Impressions | CTR | Average position |
| --- | --- | ---: | ---: | ---: | ---: |
| `sc-domain:geekskai.com`, all pages and queries | 2026-06-11 to 2026-09-10 | 23,800 | 638,000 | 3.7% | 9.8 |
| Page filter: URLs containing `/tools/soundcloud-to-wav/` | 2026-06-11 to 2026-09-10 | 16,200 | 267,000 | 6.0% | 6.1 |
| Page-filtered query: `soundcloud to wav` | 2026-06-11 to 2026-09-10 | 5,170 | 24,278 | Not captured in this table | Not captured in this table |
| Page-filtered query: `soundcloud to wav converter` | 2026-06-11 to 2026-09-10 | 3,607 | 15,511 | Not captured in this table | Not captured in this table |

The page-filtered values were captured from Search Console's Web report on 2026-09-13. The `URLs containing` filter can include localized variants that use the same path; retain the exact filter, country, device, and search-type settings for every comparison. Search Console warns that charts and tables can be partial when filters are applied.

## Search Console checks

For the release date `T0`, record the following at `T0`, `T0 + 7 days`, `T0 + 14 days`, and `T0 + 28 days`:

1. Filter Performance by the canonical page `/tools/soundcloud-to-wav/` and compare clicks, impressions, CTR, and average position with the immediately preceding equal-length period.
2. Within that page view, export `soundcloud to wav`, `soundcloud to wav converter`, and the related WAV long-tail queries separately.
3. Repeat the comparison by country and device before deciding that a copy change affected demand or ranking.
4. Confirm the rendered canonical, hreflang set, and indexability have not changed. This release must not add a redirect or `noindex`.

## Product telemetry

The client emits only non-identifying dimensions through the existing analytics adapter. No SoundCloud URL, track title, creator, account identifier, or file data is sent.

| Event | Action | Dimensions | Decision supported |
| --- | --- | --- | --- |
| `tool_started` | `download` or `playlist_download` | `tool_id`, requested `format`, optional track count | Demand by workflow and requested format |
| `tool_succeeded` | `download` or `playlist_track_download` | `tool_id`, actual `format`, `result_count: 1` | Actual MP3/M4A distribution and completed browser saves |
| `tool_failed` | `download` or `playlist_track_download` | `tool_id`, requested `format` | Media-resolution/download failure rate |
| `quota_initialization_failed` | `initial`, `retry`, `auth_timeout`, or auth-pending state | `tool_id` | Quota and authentication availability failures |
| `quota_initialization_succeeded` | `initial` or `retry` | `tool_id` | Retry recovery rate and local/server initialization health |
| `quota_blocked` | `playlist_allowance` | `tool_id`, requested `format` | Playlist runs stopped because allowance was unavailable |

Use the actual output format from `tool_succeeded`, not the format selection, when reporting MP3 versus M4A. Count `tool_failed` separately from `quota_blocked`; an allowance block is not a media-download failure.

## Review rule

If page-level CTR declines materially after enough impressions accrue, first verify the page's rendered title, description, canonical, hreflang, indexability, download format, quota initialization, and browser-save success rate. Improve clarity only within the verified MP3/M4A capability; do not restore WAV conversion, lossless, 320kbps, unlimited-download, or unrestricted-playlist claims.
