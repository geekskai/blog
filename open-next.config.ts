import { defineCloudflareConfig } from "@opennextjs/cloudflare"

export default defineCloudflareConfig({
  // Use minimal caching to reduce bundle size
  incrementalCache: "dummy",
  tagCache: "dummy",
})
