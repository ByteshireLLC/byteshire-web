// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import passthrough from "./src/integrations/passthrough.mjs";

export default defineConfig({
  site: "https://byteshire.com",
  // Every page is served as /<path>/ (a folder with index.html), matching the
  // Jekyll site's `permalink: pretty`. The load-bearing legal URLs depend on it.
  trailingSlash: "always",
  build: { format: "directory" },
  // Keep the whitespace between inline elements. The footer links are spaced
  // partly by the space character between them, and compression removes it.
  compressHTML: false,
  integrations: [
    sitemap({
      // Short links and the legacy /b/ forwarding pages are redirects, not pages.
      filter: (page) => !/\/(discboard\/[a-z]+|b\/[^/]+)\/$/.test(page),
    }),
    passthrough(),
  ],
  vite: { plugins: [tailwindcss()] },
});
