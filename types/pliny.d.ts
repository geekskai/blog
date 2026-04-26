declare module "pliny/mdx-components" {
  export const MDXLayoutRenderer: any
}

declare module "pliny/utils/contentlayer" {
  export type CoreContent<T = any> = any
  export const sortPosts: any
  export const coreContent: any
  export const allCoreContent: any
}

declare module "pliny/utils/formatDate" {
  export const formatDate: any
}

declare module "pliny/analytics" {
  export type AnalyticsConfig = any
  export const Analytics: any
}

declare module "pliny/search" {
  export type SearchConfig = any
  export const SearchProvider: any
}

declare module "pliny/search/AlgoliaButton" {
  export const AlgoliaButton: any
}

declare module "pliny/search/KBarButton" {
  export const KBarButton: any
}

declare module "pliny/ui/TOCInline" {
  const TOCInline: any
  export default TOCInline
}

declare module "pliny/ui/Pre" {
  const Pre: any
  export default Pre
}

declare module "pliny/ui/BlogNewsletterForm" {
  const BlogNewsletterForm: any
  export default BlogNewsletterForm
}

declare module "pliny/ui/NewsletterForm" {
  const NewsletterForm: any
  export default NewsletterForm
}

declare module "pliny/comments" {
  export const Comments: any
}

declare module "pliny/mdx-plugins/index.js" {
  export const remarkExtractFrontmatter: any
  export const remarkCodeTitles: any
  export const remarkImgToJsx: any
  export const extractTocHeadings: any
}

declare module "pliny/utils/contentlayer.js" {
  export const sortPosts: any
  export const allCoreContent: any
}

declare module "pliny/utils/htmlEscaper.js" {
  export const escape: any
}
