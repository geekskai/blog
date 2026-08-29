# Geekskai sitemap quality baseline

Audit date: 2026-08-29  
Source: live `https://geekskai.com/sitemap.xml` before this local change is deployed

## Summary

- Sitemap URLs: 662 total, 662 unique
- HTTP status: 662 returned 200
- Content groups: 168 blog pages, 484 tool pages, 10 site/text pages
- Self-canonical: 644 yes, 18 no or unavailable
- Hreflang target/reciprocity issues: 4 sitemap URLs
- GSC clicks, impressions, and last-crawled columns are blank because no GSC CSV was imported

## Confirmed review groups

- Nine localized PDF-to-Markdown URLs canonicalize to the English page and have 1.000
  five-word-shingle similarity to English. The local fix removes them from the sitemap and redirects
  them to English.
- Nine localized Morse Code Translator URLs are self-canonical online but have 1.000 similarity to
  English and the body-language heuristic reports English. The local fix removes them from the
  sitemap and redirects them to English.
- Seven historical blog URLs canonicalize to a different blog URL. They remain in the manual-review
  list; this change does not rewrite those mappings automatically.
- `llms.txt` and `pricing.txt` are plain-text resources without HTML canonical elements. They remain
  available and were not treated as content-page failures.
- Four localized Random 4 Digit Number Generator pages have 200 hreflang targets but incomplete
  reciprocal references. They remain a separate manual-review item.

The row-level evidence is in `sitemap-quality.csv`. Language detection and template similarity are
review signals only; they do not trigger automatic noindex decisions.
