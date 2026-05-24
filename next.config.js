const { withContentlayer } = require("next-contentlayer2")
const createNextIntlPlugin = require("next-intl/plugin")
const withNextIntl = createNextIntlPlugin("./app/i18n/request.ts")

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

const output = process.env.EXPORT ? "export" : undefined
const basePath = process.env.BASE_PATH || undefined
// const unoptimized = process.env.UNOPTIMIZED ? true : undefined

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = () => {
  const plugins = [withContentlayer, withBundleAnalyzer, withNextIntl]
  const nextConfig = plugins.reduce((acc, next) => next(acc), {
    async redirects() {
      return [
        {
          source: "/:path*/feed.xml/",
          destination: "/:path*/feed.xml",
          permanent: true,
        },
        {
          source: "/tools/youtube-shots-downloader/",
          destination: "/tools/youtube-shorts-downloader/",
          permanent: true,
        },
        {
          source: "/:locale/tools/youtube-shots-downloader/",
          destination: "/:locale/tools/youtube-shorts-downloader/",
          permanent: true,
        },
        {
          source: "/blog/primevue/how-to-change-css-of-primevue/",
          destination: "/blog/css/how-to-change-css-of-primevue/",
          permanent: true,
        },
        {
          source: "/blog/china/china-wok-menu-guide/",
          destination: "/blog/",
          permanent: true,
        },
      ]
    },
    output,
    basePath,
    trailingSlash: true,
    reactStrictMode: true,
    pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "picsum.photos",
        },
        {
          protocol: "https",
          hostname: "openweathermap.org",
        },
        {
          protocol: "https",
          hostname: "api.producthunt.com",
        },
        {
          protocol: "https",
          hostname: "i1.sndcdn.com",
        },
        {
          protocol: "https",
          hostname: "i2.sndcdn.com",
        },
        {
          protocol: "https",
          hostname: "i3.sndcdn.com",
        },
        {
          protocol: "https",
          hostname: "i4.sndcdn.com",
        },
        {
          protocol: "https",
          hostname: "a1.sndcdn.com",
        },
      ],
      // 启用图片优化以减少 Fast Origin Transfer 费用
      // 仅在明确需要时才禁用优化（如静态导出）
      unoptimized: output === "export" ? true : false,
      // 优化图片格式和缓存 — 较长 TTL 减少 origin 回源与重复转换
      formats: ["image/avif", "image/webp"],
      minimumCacheTTL: 604800, // 7 days
      // 工具站/博客无需 2K/4K 变体，缩小尺寸档位可降低 Image Optimization 传输量
      deviceSizes: [640, 750, 828, 1080, 1200, 1920],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    webpack: (config, { isServer }) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      })

      // Optimize bundle size for Cloudflare Workers
      if (isServer) {
        // Exclude large client-side only dependencies from server bundle
        config.externals = config.externals || []
        config.externals.push({
          "pdfjs-dist": "commonjs pdfjs-dist",
          html2canvas: "commonjs html2canvas",
          "file-saver": "commonjs file-saver",
          jszip: "commonjs jszip",
          heic2any: "commonjs heic2any",
          jsdom: "commonjs jsdom",
        })

        // Optimize module resolution
        config.resolve = config.resolve || {}
        config.resolve.extensionAlias = {
          ...config.resolve.extensionAlias,
          ".js": [".js", ".ts", ".tsx"],
        }
        config.resolve.alias = {
          ...config.resolve.alias,
          // Use lighter alternatives where possible
        }
      }

      return config
    },
    // Allow font optimization to fail gracefully
    experimental: {
      optimizePackageImports: ["lucide-react", "react-icons", "@headlessui/react", "date-fns"],
    },
    // Compress output
    compress: true,
    // 添加缓存头以减少 Fast Origin Transfer 费用
    async headers() {
      const immutableCache = [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ]

      return [
        {
          source: "/static/:path*",
          headers: immutableCache,
        },
        {
          source: "/fonts/:path*",
          headers: immutableCache,
        },
        {
          // Next.js 构建产物 — 命中 edge 后不再回源
          source: "/_next/static/:path*",
          headers: immutableCache,
        },
        {
          // 图片优化结果 — 与 minimumCacheTTL 配合，减少重复 origin 拉取
          source: "/_next/image",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=604800, stale-while-revalidate=86400",
            },
          ],
        },
      ]
    },
  })

  return nextConfig
}
