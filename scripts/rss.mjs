import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import { slug } from 'github-slugger'
import { escape } from 'pliny/utils/htmlEscaper.js'
import siteMetadata from '../data/siteMetadata.js'
import tagData from '../app/tag-data.json' assert { type: 'json' }
import { allBlogs } from '../.contentlayer/generated/index.mjs'
import { sortPosts } from 'pliny/utils/contentlayer.js'

const outputFolder = process.env.EXPORT ? 'out' : 'public'

const generateRssItem = (config, post) => `
  <item>
    <guid>${config.siteUrl}/blog/${post.slug}/</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}/blog/${post.slug}/</link>
    ${post.summary ? `<description>${escape(post.summary)}</description>` : ''}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${escape(config.email)} (${escape(config.author)})</author>
    ${post.tags ? post.tags.map((t) => `<category>${escape(t)}</category>`).join('') : ''}
    ${post.body.raw ? `<content:encoded><![CDATA[${post.body.raw}]]></content:encoded>` : ''}
  </item>
`

const generateRss = (config, posts, page = 'feed.xml') => `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}/blog/</link>
      <description>${escape(config.description)}</description>
      <language>${config.language}</language>
      <managingEditor>${escape(config.email)} (${escape(config.author)})</managingEditor>
      <webMaster>${escape(config.email)} (${escape(config.author)})</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(config, post)).join('\n')}
    </channel>
  </rss>
`

async function generateRSS(config, allBlogs, page = 'feed.xml') {
  try {
    const publishPosts = allBlogs.filter((post) => post.draft !== true)

    // 确保有文章可以生成
    if (!publishPosts.length) {
      console.log('No posts to generate RSS feed')
      return
    }

    // 生成主 RSS feed
    const sortedPosts = sortPosts(publishPosts)
    const rss = generateRss(config, sortedPosts)
    writeFileSync(`./${outputFolder}/${page}`, rss)

    // 生成标签 RSS feeds
    for (const tag of Object.keys(tagData)) {
      const filteredPosts = publishPosts.filter((post) =>
        post.tags.map((t) => slug(t)).includes(tag)
      )

      if (filteredPosts.length) {
        const tagRss = generateRss(config, filteredPosts, `tags/${tag}/${page}`)
        const rssPath = path.join(outputFolder, 'tags', tag)
        mkdirSync(rssPath, { recursive: true })
        writeFileSync(path.join(rssPath, page), tagRss)
      }
    }
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    throw error
  }
}

const rss = () => {
  try {
    generateRSS(siteMetadata, allBlogs)
    console.log('RSS feed generated successfully')
  } catch (error) {
    console.error('Failed to generate RSS feed:', error)
    process.exit(1)
  }
}
export default rss
