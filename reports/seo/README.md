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

`body_language_heuristic` and `similarity_to_english` are review signals, not automatic
indexing decisions. The script never changes robots, canonical tags, GSC, or production data.
