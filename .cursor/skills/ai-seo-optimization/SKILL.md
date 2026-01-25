---
name: ai-seo-optimization
description: Optimize content and websites for AI search engines (ChatGPT, Perplexity, Google AI Overviews) using GEO principles, content chunking, structured data, and brand visibility strategies. Use when working on SEO, AI visibility, content optimization, GEO, getting brand mentioned in AI, or implementing technical SEO for LLM search.
---

# AI-Era SEO & GEO Optimization

Quick reference for optimizing content and websites for AI search engines. For complete details, see [AI-SEO-Complete-Guide.md](../../AI-SEO-Complete-Guide.md).

## Core Principles

1. **Brand is the ultimate signal** - In LLM search era, brand presence across web > perfect content
2. **Information Retrieval Score** - If AI can't extract your content chunks, you're invisible
3. **Content freshness** - 30-90 day update cycle is strongest AI ranking signal
4. **Topical authority** - Build knowledge graph + information graph, not keyword stuffing
5. **Re-Ranker determines ranking** - Focus on semantic relevance, not keyword density

## Quick Action Checklist

### Technical Setup (Do First)
- [ ] Unblock AI crawlers in `robots.txt` (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- [ ] Add `last-modified` metadata to pages
- [ ] Implement content freshness badges
- [ ] Submit XML sitemap with correct `lastmod` values

### Content Optimization
- [ ] Use `<strong>` tags for core facts (pricing, features, positioning)
- [ ] Structure content in chunks (fact chunks, feature chunks)
- [ ] Answer in first sentence (Wikipedia principle)
- [ ] Add citations with specific sources, dates, and numbers
- [ ] Include FAQ sections with structured data

### Brand Visibility
- [ ] Test AI visibility with prompt templates weekly
- [ ] Build presence on Reddit (relevant subreddits)
- [ ] Create YouTube videos with transcripts and timestamps
- [ ] Reach out to sites AI already cites for inclusion

## Code Patterns

### Content Chunking Structure

```tsx
// ✅ Good: Clear content chunk structure
const ContentChunk = () => (
  <article>
    <section className="fact-chunk">
      <h2>Core Features</h2>
      <ul>
        <li><strong>Feature Name</strong>: Feature description</li>
        <li><strong>Pricing</strong>: Free to use</li>
        <li><strong>Target Users</strong>: Students, developers</li>
      </ul>
    </section>
  </article>
)
```

### Content Freshness Badge

```tsx
// app/components/ContentFreshness.tsx
import { formatDistanceToNow } from "date-fns"

export function ContentFreshnessBadge({ lastModified }: { lastModified: Date }) {
  const daysSinceUpdate = Math.floor((Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24))
  const isFresh = daysSinceUpdate < 90

  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${
      isFresh ? "border-green-500/30 bg-green-500/20" : "border-orange-500/30 bg-orange-500/20"
    }`}>
      <span>{isFresh ? "✓" : "⚠"}</span>
      <span className="text-sm">
        {isFresh ? `Updated ${formatDistanceToNow(lastModified, { addSuffix: true })}`
                 : `Last updated ${formatDistanceToNow(lastModified, { addSuffix: true })}`}
      </span>
    </div>
  )
}
```

### robots.txt for AI Access

```
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /
```

### Schema.org - Organization & WebApplication

```typescript
// app/utils/schema-generator.ts
export function generateToolSchema(tool: Tool) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: `https://geekskai.com${tool.href}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: "GeeksKai",
      url: "https://geekskai.com",
    },
    featureList: tool.features,
  }
}
```

### FAQ Schema

```typescript
export function generateFAQSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}
```

## Content Writing Patterns

### Answer-First Structure

```
## Question as Heading (Exactly How Users Ask)

Direct answer in first sentence. No buildup, no fluff.

**Key points:**
- Bullet point 1
- Bullet point 2
- Bullet point 3

Details and context here if needed.

**Quick takeaway:** One sentence summary.
```

### Quick Answer Box Template

```
> **Quick Answer:** [Direct answer to the main question]
>
> **Best for:** [Target audience]
>
> **Cost:** [Price range]
>
> **Key benefit:** [Main advantage]
```

### Citation Format

❌ **Wrong:** "Studies show this increases conversion"

✅ **Right:** "[HubSpot's 2024 study](url) of 1,000 businesses found this increases conversion by 34%"

**Citation requirements:**
- Specific source name
- Recent date (within 2 years)
- Exact numbers
- Clear attribution with link

## AI Visibility Testing

### Prompt Templates

Test these weekly in ChatGPT/Perplexity:

- "What's the best [your category] for [specific use case]?"
- "best [your category] with [specific feature]?"
- "How do I [problem you solve] without [common pain point]?"
- "[your brand] vs [top competitor]"
- "best [your category] tool for [target audience]"

### Tracking Spreadsheet

| Prompt | Mentioned? | Sentiment | Sources Cited | AI Platform | Date |
|--------|------------|-----------|---------------|-------------|------|
| Best PM tool for startups | No | - | Monday, Asana | ChatGPT | 1/8/25 |

## 10 Proven Strategies Summary

1. **Unblock AI crawlers** - Check robots.txt immediately
2. **Test current visibility** - Use prompt templates weekly
3. **Piggyback on cited sources** - Reach out to sites AI already uses
4. **Create superior content** - Outrank competitors with depth
5. **Build SEO foundation** - 50% of AI citations come from top 10 Google results
6. **Answer-first structure** - Wikipedia principle, direct answers
7. **Add citations** - Increases visibility by 40%
8. **Dominate Reddit** - AI's opinion source
9. **Create YouTube videos** - AI Overview king with transcripts
10. **Strategic PR** - Build authority through media mentions

## Key Metrics (KPIs)

### AI Search Era KPIs
- Information Retrieval Score
- Content Freshness (< 90 days)
- Topical Coverage
- Brand Mentions (quantity & quality)
- Fact Retrieval Rate

### Traditional SEO (Still Important)
- Organic Traffic
- Ranking Position
- CTR
- Dwell Time
- Bounce Rate

## Common Mistakes to Avoid

- ❌ Blocking AI crawlers in robots.txt
- ❌ Burying answers in long paragraphs
- ❌ Vague citations without sources/dates
- ❌ Ignoring content freshness (90+ days old)
- ❌ Keyword stuffing instead of topical coverage
- ❌ Missing structured data (Schema.org)

## Additional Resources

For complete implementation details, code examples, and advanced strategies, see:
- [AI-SEO-Complete-Guide.md](../../AI-SEO-Complete-Guide.md) - Full comprehensive guide
