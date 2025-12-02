const { withContentlayer } = require("next-contentlayer2")
const createNextIntlPlugin = require("next-intl/plugin")
const withNextIntl = createNextIntlPlugin("./app/i18n/request.ts")

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

const output = process.env.EXPORT ? "export" : undefined
const basePath = process.env.BASE_PATH || undefined
const unoptimized = process.env.UNOPTIMIZED ? true : undefined

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = () => {
  const plugins = [withContentlayer, withBundleAnalyzer, withNextIntl]
  return plugins.reduce((acc, next) => next(acc), {
    async redirects() {
      return [
        {
          source: "/:path*/feed.xml/",
          destination: "/:path*/feed.xml",
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
    eslint: {
      dirs: ["app", "components", "layouts", "scripts"],
    },
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
      ],
      unoptimized,
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
        config.resolve.alias = {
          ...config.resolve.alias,
          // Use lighter alternatives where possible
        }
      }

      return config
    },
    // Optimize font loading
    optimizeFonts: true,
    // Allow font optimization to fail gracefully
    experimental: {
      optimizePackageImports: ["lucide-react", "react-icons", "@headlessui/react", "date-fns"],
    },
    // Compress output
    compress: true,
    // Optimize production builds
    swcMinify: true,
  })
}
