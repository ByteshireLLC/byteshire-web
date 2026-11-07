// The site's data model. Each app is described once, in src/content/apps/<slug>.yaml,
// and every page about it is generated from that file. A missing or misspelled
// field fails the build (`astro check` and `astro build`), never a published page.
import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { readdir, readFile } from "node:fs/promises";
import { parse as parseYaml } from "yaml";

const platform = z.enum(["iPhone", "iPad", "Mac", "Apple Watch", "Apple TV", "Apple Vision Pro"]);

const apps = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/apps" }),
  schema: z.object({
    // The name as people say it, and the full name where the store name is longer.
    name: z.string(),
    fullName: z.string().optional(),
    // live: on the App Store. prerelease: not on the App Store yet.
    status: z.enum(["live", "prerelease"]),
    platforms: z.array(platform).min(1),
    // Home-page card copy. An app without it gets no card yet.
    summary: z.string().optional(),
    // Whether /<slug>/ is a landing page. Legal pages link back only when it is.
    landingPage: z.boolean().default(false),
    appStore: z
      .object({
        id: z.string().regex(/^\d+$/),
        // App Analytics provider token (App Store Connect → Analytics → Acquisition → Campaigns).
        providerToken: z.string().regex(/^\d+$/),
      })
      .optional(),
    // Short links at /<slug>/<channel>/ that forward to the App Store with a
    // campaign token. See README › Campaign short links for the token convention.
    shortLinks: z.record(z.string().regex(/^[a-z]+$/), z.string()).default({}),
  }),
});

// Privacy policies and terms of use, served at /<app>-<kind>/. Those URLs are
// linked from App Store listings and the apps' paywalls: see SPEC › Load-bearing URLs.
const legal = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/legal" }),
  schema: z.object({
    app: reference("apps"),
    kind: z.enum(["privacy", "terms"]),
    title: z.string(),
    description: z.string(),
    effective: z.coerce.date(),
    updated: z.coerce.date().optional(),
  }),
});

// Reads the front matter of every <folder>/<slug>/index.html at the repo root.
// Discboard's scripts/publish_board.py writes these pages in Jekyll's format, and
// keeping them where and how it writes them means it needs no change.
function frontMatterPages(folder: string) {
  return async () => {
    const entries = [];
    for (const slug of await readdir(folder)) {
      let source;
      try {
        source = await readFile(`${folder}/${slug}/index.html`, "utf8");
      } catch {
        continue;
      }
      const match = source.match(/^---\n([\s\S]*?)\n---/);
      if (!match) throw new Error(`${folder}/${slug}/index.html has no front matter`);
      entries.push({ id: slug, ...parseYaml(match[1]) });
    }
    return entries;
  };
}

// Promotional discboards at /discboards/<slug>/.
const boards = defineCollection({
  loader: frontMatterPages("discboards"),
  schema: z.object({
    layout: z.literal("promo-board"),
    promo_slug: z.string(),
    title: z.string(),
    description: z.string(),
    wallpaper_alt: z.string(),
    wallpaper_credit: z.string().optional(),
  }),
});

// The old /b/<slug>/ board pages, now forwarding to /discboards/<slug>/.
const movedBoards = defineCollection({
  loader: frontMatterPages("b"),
  schema: z.object({
    layout: z.literal("redirect"),
    redirect_to: z.string().startsWith("/"),
    title: z.string(),
  }),
});

export const collections = { apps, legal, boards, movedBoards };
