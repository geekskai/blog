# Sitemap quality audit

Run the reproducible crawl with:

```bash
yarn seo:sitemap-quality
```

The default input is `https://geekskai.com/sitemap.xml`, and the default output is
`reports/seo/sitemap-quality.csv`. To merge exported GSC metrics when available:

```bash
yarn seo:sitemap-quality --gsc-csv /absolute/path/to/gsc-pages.csv
```

To audit a route list, pass newline-delimited URLs or JSON containing a `routes` array. JSON
entries may define expectations for intentional redirects, noindex pages, and sitemap inclusion:

```json
{
  "routes": [
    { "url": "https://geekskai.com/fr/tools/example/", "expected": { "redirectTo": "https://geekskai.com/tools/example/" } },
    { "url": "https://geekskai.com/tools/share/", "expected": { "indexable": false, "hreflang": false, "sitemap": false } }
  ]
}
```

The audit records the first status and redirect chain, compares HTML/HTTP/sitemap language
alternates when multiple channels exist, checks Googlebot and AI crawler access in `robots.txt`,
and reports network-limited responses as `BLOCKED`. An expected redirect must use `redirectTo`;
expected noindex pages use `indexable: false`.

`body_language_heuristic` and `similarity_to_english` are review signals, not automatic
indexing decisions. The script never changes robots, canonical tags, GSC, or production data.
